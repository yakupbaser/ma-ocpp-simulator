/* eslint-disable no-continue */
import _ from 'lodash';
import moment from 'moment';
import OCPPConnectorStatus from '../../constants/ocpp/connector_statuses';
import ReduxStore from '../../redux';
import { IRConnectorStatus } from '../../redux/reducer/connector_status';
import ReduxSymbols from '../../redux/symbols';
import LocalStorage from '../local_storage';
import AppSocket, { OutgoingWebSocketPayload } from '../../socket';
import OCPPMessageType from '../../constants/ocpp/message_types';
import AppHelper from '../app';
import OCPPEvent from '../../constants/ocpp/events';
import OCPPConnectorAvailabilityType from '../../constants/ocpp/connector_availability_type';
import AppChargePoint from '.';

const defaultStatus: IRConnectorStatus = {
  isChargingSocketPlugged: false,
  isCarReady: false,
  isConnectorReady: false,
  ocppStatus: OCPPConnectorStatus.available,
  availabilityType: OCPPConnectorAvailabilityType.operative,
  car: {
    batteryCapacityKiloWatt: 100,
    batteryVoltage: 50,
    currentBatteryPercent: 10,
  },
};

export default class AppChargePointConnector {
  private connectorNumber: number;
  isPluggedCar = false;
  currentEnergyWatt = 0;

  constructor(args: { connectorNumber: number }) {
    this.connectorNumber = args.connectorNumber;
    this.initStatus();
    this.startSendMeterValues();
    this.currentEnergyWatt = parseInt(localStorage.getItem(`CONNECTOR-${this.connectorNumber}-Energy`) ?? '0');
  }
  private getReduxConnectorStatuses = () => {
    const store = _.cloneDeep(ReduxStore.getState());
    return store.connectorStatus.data!;
  };
  private startSendMeterValues = async () => {
    while (true) {
      const settings = LocalStorage.getSettings();
      if (this.getOCPPStatus() !== OCPPConnectorStatus.charging || !settings) {
        await AppHelper.sleep(100);
        continue;
      }
      const reduxStore = ReduxStore.getState();
      const currentTransaction = reduxStore.transactions.data?.find((e) => e.connectorId === this.connectorNumber);
      const connectorStatuses = reduxStore.connectorStatus.data!;
      const storeTransaction = LocalStorage.getTransactions()?.find((e) => e.transactionId === currentTransaction?.transactionId);
      if (!currentTransaction || !storeTransaction) {
        await AppHelper.sleep(100);
        continue;
      }
      // Şarj Süresi (Dakika) = (Şarj Edilecek Kapasite kWh) / (Şarj Cihazı Gücü kW) * (100% - Mevcut Şarj Seviyesi%)
      const payload = {
        connectorId: this.connectorNumber,
        transactionId: currentTransaction.transactionId,
        meterValue: [
          {
            timestamp: moment().utc().toISOString(),
            sampledValue: [
              {
                unit: 'Wh',
                value: this.currentEnergyWatt,
                location: 'Outlet',
                measurand: 'Energy.Active.Import.Register',
              },
              {
                unit: 'W',
                value: AppChargePoint.currentPowerWatt,
                location: 'Outlet',
                measurand: 'Power.Active.Import',
              },
              {
                unit: 'W',
                value: settings.maximumKw * 1000,
                location: 'Outlet',
                measurand: 'Power.Offered',
              },
              {
                unit: 'Percent',
                value: connectorStatuses[this.connectorNumber].car.currentBatteryPercent ?? 0,
                location: 'EV',
                measurand: 'SoC',
              },
            ],
          },
        ],
      };
      const socketPayload: OutgoingWebSocketPayload = [OCPPMessageType.callMessage, AppHelper.generateUniqueId(), OCPPEvent.meterValues, payload];
      AppSocket.sendPayload(socketPayload);
      const sleepTime = (settings?.configurationKeys.meterValueInterval ?? 1) * 1000;
      await AppHelper.sleep(sleepTime);
    }
  };

  stopTransaction = (args: { transactionId: string }) => {
    const connectorStatus = this.getStatus();
    const store = _.cloneDeep(ReduxStore.getState());
    const stoppingTransaction = store.transactions.data?.find((e) => parseInt(e.transactionId) === parseInt(args?.transactionId));
    const payload = {
      idTag: stoppingTransaction?.idTag,
      meterStop: Math.floor(this.currentEnergyWatt),
      connectorId: stoppingTransaction?.connectorId,
      timestamp: moment().utc().toISOString(),
      transactionId: stoppingTransaction?.transactionId,
      reason: 'Remote',
    };
    const socketPayload: OutgoingWebSocketPayload = [OCPPMessageType.callMessage, AppHelper.generateUniqueId(), OCPPEvent.stopTransaction, payload];
    AppSocket.addSocketEventCallback(socketPayload[1], () => {
      this.setStatus({ ...connectorStatus!, ocppStatus: OCPPConnectorStatus.finishing });
    });
    AppSocket.sendPayload(socketPayload);
  };

  getNumber = () => this.connectorNumber;
  getStatus = (): IRConnectorStatus => {
    const reduxConnectorStatuses = this.getReduxConnectorStatuses();
    return reduxConnectorStatuses?.[this.connectorNumber] ?? defaultStatus;
  };
  getOCPPStatus = (): OCPPConnectorStatus => this.getStatus().ocppStatus;
  addEnergy = (energyWatt: number) => {
    this.currentEnergyWatt += energyWatt;
    localStorage.setItem(`CONNECTOR-${this.connectorNumber}-Energy`, `${this.currentEnergyWatt}`);

    const reduxConnectorStatuses = this.getReduxConnectorStatuses();
    const newStatus = _.cloneDeep(reduxConnectorStatuses[this.connectorNumber]);
    const { batteryCapacityKiloWatt, currentBatteryPercent } = newStatus.car;
    let carCurrentBatteryWatt = (currentBatteryPercent / 100) * batteryCapacityKiloWatt * 1000;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    carCurrentBatteryWatt += energyWatt;
    newStatus.car.currentBatteryPercent = Math.min(100, parseFloat(((carCurrentBatteryWatt / (batteryCapacityKiloWatt * 1000)) * 100).toFixed(4)));
    if (newStatus.car.currentBatteryPercent >= 100) this.setStatus({ ...newStatus, ocppStatus: OCPPConnectorStatus.finishing });
    const newStatuses = { ...reduxConnectorStatuses, [this.connectorNumber]: newStatus };
    ReduxStore.dispatch({ type: ReduxSymbols.connectorsStatus.success, data: newStatuses });
    LocalStorage.setConnectorStatuses(newStatuses);
  };
  setStatus = (status: IRConnectorStatus): Promise<null> => {
    const newStatus = _.cloneDeep(status);
    return new Promise((resolve) => {
      const reduxConnectorStatuses = this.getReduxConnectorStatuses();

      if (newStatus.availabilityType === OCPPConnectorAvailabilityType.inoperative && newStatus.ocppStatus === OCPPConnectorStatus.available) {
        //  Change avaibility status ..
        newStatus.ocppStatus = OCPPConnectorStatus.unavailable;
      } else if (
        newStatus.availabilityType === OCPPConnectorAvailabilityType.operative &&
        newStatus.ocppStatus === OCPPConnectorStatus.unavailable &&
        newStatus.isConnectorReady
      ) {
        newStatus.ocppStatus = OCPPConnectorStatus.available;
      }
      const payload: OutgoingWebSocketPayload = [
        OCPPMessageType.callMessage,
        AppHelper.generateUniqueId(),
        OCPPEvent.statusNotification,
        { connectorId: this.connectorNumber, errorCode: 'NoError', status: newStatus.ocppStatus },
      ];
      if (newStatus.ocppStatus !== OCPPConnectorStatus.charging) {
        // clear transactions
        const store = _.cloneDeep(ReduxStore.getState());
        const oldTransactions = store.transactions?.data ?? [];
        ReduxStore.dispatch({ type: ReduxSymbols.transactions.call, data: oldTransactions.filter((e) => e.connectorId !== this.connectorNumber) });
      }
      AppSocket.addSocketEventCallback(payload[1], () => {
        const newStatuses = { ...reduxConnectorStatuses, [this.connectorNumber]: newStatus };
        ReduxStore.dispatch({ type: ReduxSymbols.connectorsStatus.success, data: newStatuses });
        LocalStorage.setConnectorStatuses(newStatuses);
        resolve(null);
      });
      AppSocket.sendPayload(payload);
    });
  };
  private initStatus = () => {
    const localStorageConnectorStatuses = LocalStorage.getConnectorStatuses();
    const reduxConnectorStatuses = this.getReduxConnectorStatuses();
    ReduxStore.dispatch({
      type: ReduxSymbols.connectorsStatus.success,
      data: { ...reduxConnectorStatuses, [this.connectorNumber]: localStorageConnectorStatuses?.[this.connectorNumber] ?? defaultStatus },
    });
  };
  sendStatusNotification = (args?: { ocppStatus?: OCPPConnectorStatus }): Promise<any> => {
    return new Promise((resolve) => {
      const payload: OutgoingWebSocketPayload = [
        OCPPMessageType.callMessage,
        AppHelper.generateUniqueId(),
        OCPPEvent.statusNotification,
        { connectorId: this.connectorNumber, errorCode: 'NoError', status: args?.ocppStatus ?? this.getStatus().ocppStatus },
      ];
      AppSocket.addSocketEventCallback(payload[1], resolve);
      AppSocket.sendPayload(payload);
    });
  };
}
