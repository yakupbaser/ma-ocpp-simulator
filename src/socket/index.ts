/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import ReduxStore from '../redux';
import { IRSettings } from '../redux/reducer/settings';
import ReduxSymbols from '../redux/symbols';
import OCPPEvent from '../constants/ocpp/events';
import AppHelper from '../helpers/app';
import OCPPMessageType from '../constants/ocpp/message_types';

type OutgoingWebSocketPayload = [OCPPMessageType, string, OCPPEvent, any] | [OCPPMessageType, string, any];
class _AppSocket {
  webSocket: WebSocket | undefined;
  bootNotificationStatus: 'accepted' | 'called' | 'not-called' = 'not-called';

  constructor() {
    this.sendHeartbeat();
    this.sendMeterValues();
  }
  private socketConnected = () => {
    ReduxStore.dispatch({ type: ReduxSymbols.socketStatus.success, data: true });
    this.bootNotification();
  };
  private socketDisconnected = () => {
    this.bootNotificationStatus = 'not-called';
    ReduxStore.dispatch({ type: ReduxSymbols.socketStatus.success, data: false });
  };
  private getSettings = () => {
    const store = _.cloneDeep(ReduxStore.getState());
    const settings: IRSettings = store.settings.data!;
    return settings;
  };
  private isSocketAvailable = () => {
    return !!this.webSocket && this.webSocket.readyState === WebSocket.OPEN;
  };
  private sendHeartbeat = async () => {
    while (true) {
      if (!this.isSocketAvailable()) {
        await AppHelper.sleep(1000);
        // eslint-disable-next-line no-continue
        continue;
      }
      // await AppHelper.sleep(1000);
      const settings = this.getSettings();
      await AppHelper.sleep(Math.max(settings.heartbeatInterval * 1000, 1000));
      const payload: OutgoingWebSocketPayload = [OCPPMessageType.callMessage, AppHelper.generateUniqueId(), OCPPEvent.heartbeat, {}];
      this.sendPayload(payload);
    }
  };
  private sendMeterValues = async () => {
    while (true) {
      if (!this.isSocketAvailable()) {
        await AppHelper.sleep(1000);
        // eslint-disable-next-line no-continue
        continue;
      }
      const settings = this.getSettings();
      await AppHelper.sleep(Math.max(settings.meterValueInterval * 1000, 1000));
    }
  };
  sendPayload = (payload: OutgoingWebSocketPayload) => {
    if (this.isSocketAvailable()) this.webSocket?.send(JSON.stringify(payload));
  };
  connect = () => {
    const settings = this.getSettings();
    if (this.webSocket) this.webSocket.close();
    this.webSocket = new WebSocket(`${settings.ocppWSUrl}/${settings.chargePointCode}`, ['ocpp1.6']);
    this.webSocket!.onopen = this.socketConnected;
    this.webSocket!.onclose = this.socketDisconnected;
    this.webSocket!.onerror = this.socketDisconnected;
    this.webSocket!.onmessage = this.onMessage;
  };
  closeConnection = () => {
    if (!this.isSocketAvailable()) return;
    this.webSocket!.close();
  };
  bootNotification = () => {
    this.bootNotificationStatus = 'called';
    const payload: OutgoingWebSocketPayload = [
      OCPPMessageType.callMessage,
      AppHelper.generateUniqueId(),
      OCPPEvent.bootNotification,
      {
        chargePointVendor: 'AVT-Company',
        chargePointModel: 'AVT-Express',
        chargePointSerialNumber: 'avt.001.13.1',
        chargeBoxSerialNumber: 'avt.001.13.1.01',
        firmwareVersion: '0.9.87',
        iccid: '',
        imsi: '',
        meterType: 'AVT NQC-ACDC',
        meterSerialNumber: 'avt.001.13.1.01',
      },
    ];
    this.sendPayload(payload);
  };
  onMessage = ({ data }: any) => {
    const store = _.cloneDeep(ReduxStore.getState());
    const settings: IRSettings = store.settings.data!;
    const socketData = JSON.parse(data);
    const messageType: OCPPMessageType = socketData[0];
    if (this.bootNotificationStatus === 'called' && messageType === OCPPMessageType.callResultMessage) {
      const [, , payload] = socketData;

      this.bootNotificationStatus = 'accepted';
      const heartbeatInterval = payload.interval;
      ReduxStore.dispatch({ type: ReduxSymbols.settings.call, data: { ...settings, heartbeatInterval: parseInt(heartbeatInterval) }, disableReconnectSocket: true });
      this.sendStatusNotification();
      return;
    }
    if (messageType === OCPPMessageType.callMessage) {
      console.log('socketData', socketData);
      const [, uniqueId, eventType, payload] = socketData as [any, string, OCPPEvent, any];
      if (eventType === OCPPEvent.remoteStartTransaction) {
        if (store.transaction.data) {
          // Have active transaction deny to transaction
          return;
        }
        this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
        ReduxStore.dispatch({ type: ReduxSymbols.startTransaction.call, data: { ...payload, event: OCPPEvent.authorize } });
        return;
      }
    }
    if (messageType === OCPPMessageType.callResultMessage) {
      const [, uniqueId] = socketData as [any, string, OCPPEvent, any];
      const startTransactionData = store.startTransaction.data;
      if (startTransactionData && startTransactionData?.uniqueId === uniqueId && startTransactionData.event === OCPPEvent.authorize) {
        // Authorize response
        const [, , authorizeResponse] = socketData;
        if (authorizeResponse?.idTagInfo?.status === 'Accepted') {
          // Authorize accepted for idTag
          ReduxStore.dispatch({
            type: ReduxSymbols.startTransaction.call,
            data: { ...startTransactionData, event: OCPPEvent.startTransaction, meterStart: 0 },
          });
        }
        return;
      }
      if (startTransactionData && startTransactionData?.uniqueId === uniqueId && startTransactionData.event === OCPPEvent.startTransaction) {
        // Start Transaction response
        const [, , startTransactionResponse] = socketData;
        if (startTransactionResponse?.idTagInfo?.status === 'Accepted') {
          // Authorize accepted for idTag
          ReduxStore.dispatch({
            type: ReduxSymbols.startTransaction.call,
            data: { ...startTransactionData, event: OCPPEvent.statusNotification, transactionId: startTransactionResponse?.idTagInfo?.transactionId },
          });
        }
        return;
      }
    }
    console.log(data);
  };
  sendStatusNotification = () => {
    const payload: OutgoingWebSocketPayload = [
      OCPPMessageType.callMessage,
      AppHelper.generateUniqueId(),
      OCPPEvent.statusNotification,
      { connectorId: 1, errorCode: 'NoError', status: 'Available' },
    ];
    this.sendPayload(payload);
  };
}

const AppSocket = new _AppSocket();
setInterval(() => {
  const store = _.cloneDeep(ReduxStore.getState());
  const settings: IRSettings | null | undefined = store?.settings?.data;
  if (!settings || !AppSocket.webSocket || AppSocket.webSocket.readyState === WebSocket.OPEN || AppSocket.webSocket.readyState === WebSocket.CONNECTING) return;
  AppSocket.connect();
}, 1000);
export default AppSocket;
