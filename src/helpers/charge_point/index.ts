/* eslint-disable @typescript-eslint/no-use-before-define */
import OCPPConnectorStatus from '../../constants/ocpp/connector_statuses';
import OCPPEvent from '../../constants/ocpp/events';
import OCPPMessageType from '../../constants/ocpp/message_types';
import ReduxStore from '../../redux';
import ReduxSymbols from '../../redux/symbols';
import AppSocket, { OutgoingWebSocketPayload } from '../../socket';
import AppHelper from '../app';
import LocalStorage from '../local_storage';
import AppChargePointConnector from './connector';

setInterval(() => {
  const settings = LocalStorage.getSettings();
  const maximumWatt = (settings?.maximumKw ?? 11) * 1000;
  const currentWatt = Math.min(maximumWatt, AppHelper.random(maximumWatt * 0.95, maximumWatt * 1.1));
  AppChargePoint.currentPowerWatt = currentWatt;
}, 100);
setInterval(() => {
  // Kw
  const totalEnergy = (AppChargePoint.currentPowerWatt / 1000) * (1 / 60);
  const chargingConnectors = AppChargePoint.connectors.filter((e) => e.getOCPPStatus() === OCPPConnectorStatus.charging);
  for (const connector of chargingConnectors) {
    connector.addEnergy(totalEnergy / chargingConnectors.length);
  }
}, 1000);

class _AppChargePoint {
  isChargePointReady = false;
  isCarReady = false;
  connectors: AppChargePointConnector[] = [];
  heartbeatWorker: NodeJS.Timer | undefined = undefined;
  meterValueWorker: NodeJS.Timer | undefined = undefined;
  currentPowerWatt = 0;

  private generateCP = () => {
    ReduxStore.dispatch({
      type: ReduxSymbols.connectorsStatus.success,
      data: {},
    });
    const settings = AppSocket.getSettings();
    this.connectors = [];
    for (let i = 0; i < Math.max(1, settings.configurationKeys.numberOfConnectors); i++) this.connectors.push(new AppChargePointConnector({ connectorNumber: i + 1 }));
    if (this.heartbeatWorker) clearInterval(this.heartbeatWorker);
    if (this.meterValueWorker) clearInterval(this.meterValueWorker);
    this.sendHeartbeat();
  };

  getConnector = (connectorId?: number) => this.connectors.find((e) => e.getNumber() === connectorId);

  private sendHeartbeat = async () => {
    const settings = AppSocket.getSettings();
    this.heartbeatWorker = setInterval(() => {
      if (!AppSocket.isSocketAvailable()) return;
      const payload: OutgoingWebSocketPayload = [OCPPMessageType.callMessage, AppHelper.generateUniqueId(), OCPPEvent.heartbeat, {}];
      AppSocket.sendPayload(payload);
    }, Math.max(100, settings.configurationKeys.heartbeatInterval * 1000));
  };

  bootNotification = () => {
    let settings = AppSocket.getSettings();
    const sendPayload: OutgoingWebSocketPayload = [
      OCPPMessageType.callMessage,
      AppHelper.generateUniqueId(),
      OCPPEvent.bootNotification,
      {
        chargePointVendor: settings.chargePointVendor,
        chargePointModel: settings.chargePointModel,
        chargePointSerialNumber: settings.chargePointSerialNumber,
        chargeBoxSerialNumber: settings.chargeBoxSerialNumber,
        firmwareVersion: settings.firmwareVersion,
        iccid: settings.iccid,
        imsi: settings.imsi,
        meterType: settings.meterType,
        meterSerialNumber: settings.meterSerialNumber,
      },
    ];
    AppSocket.addSocketEventCallback(sendPayload[1], (socketData) => {
      const [, , payload] = socketData;
      const heartbeatInterval = payload.interval;
      settings = AppSocket.getSettings();
      ReduxStore.dispatch({ type: ReduxSymbols.settings.call, data: { ...settings, heartbeatInterval: parseInt(heartbeatInterval) }, disableReconnectSocket: true });
      this.sendStatusNotificationsOfConnectors();
      this.generateCP();
      ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'BootNotification Accepted', data: socketData } });
    });
    AppSocket.sendPayload(sendPayload);
  };
  sendStatusNotificationsOfConnectors = () => {
    this.connectors.forEach((connector) => {
      connector.sendStatusNotification();
    });
  };
}
const AppChargePoint = new _AppChargePoint();
export default AppChargePoint;
export { AppChargePointConnector };
