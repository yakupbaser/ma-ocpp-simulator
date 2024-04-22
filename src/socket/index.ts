/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import AppChargePoint from '../helpers/charge_point';
import ReduxStore from '../redux';
import { IRSettings, IRSettingsConfigurationKeys } from '../redux/reducer/settings';
import ReduxSymbols from '../redux/symbols';
import OCPPEvent from '../constants/ocpp/events';
import OCPPMessageType from '../constants/ocpp/message_types';
import OCPPConnectorStatus from '../constants/ocpp/connector_statuses';
import OCPPConnectorAvailabilityType from '../constants/ocpp/connector_availability_type';
import LocalStorage from '../helpers/local_storage';

export type OutgoingWebSocketPayload = [OCPPMessageType, string, OCPPEvent, any] | [OCPPMessageType, string, any];
class _AppSocket {
  webSocket: WebSocket | undefined;
  socketEventCallbacks: { [uniqueId: string]: { callback: (data?: any) => any; uniqueId: string } } = {};

  private socketConnected = () => {
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Web Socket connection is successfully', data: { uri: this.webSocket?.url } } });
    ReduxStore.dispatch({ type: ReduxSymbols.socketStatus.success, data: true });
    AppChargePoint.bootNotification();
  };
  private socketDisconnected = () => {
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Web Socket disconnected', data: { uri: this.webSocket?.url } } });
    ReduxStore.dispatch({ type: ReduxSymbols.socketStatus.success, data: false });
  };

  addSocketEventCallback = (uniqueId: string, callback: (data?: any) => any) => {
    this.socketEventCallbacks = { ...this.socketEventCallbacks, [uniqueId]: { callback, uniqueId } };
  };
  getSettings = () => {
    const store = _.cloneDeep(ReduxStore.getState());
    const settings: IRSettings = store.settings.data!;
    return settings;
  };
  isSocketAvailable = () => {
    return !!this.webSocket && this.webSocket.readyState === WebSocket.OPEN;
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

  onMessage = ({ data }: any) => {
    let socketData;
    try {
      socketData = JSON.parse(data);
    } catch (err) {
      ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: `Socket Parse Error: ${err} -> ${data}`, data: {} } });
      return;
    }
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Message received from websocket', data: socketData } });
    const messageType: OCPPMessageType = socketData[0];
    if (this.socketEventCallbacks?.[socketData[1]]) {
      this.socketEventCallbacks[socketData[1]].callback(socketData);
      delete this.socketEventCallbacks[socketData[1]];
      return;
    }
    if (messageType === OCPPMessageType.callMessage) {
      const [, uniqueId, eventType, payload] = socketData as [any, string, OCPPEvent, any];
      if (eventType === OCPPEvent.remoteStartTransaction) return this.remoteStartTransaction({ payload, uniqueId });
      if (eventType === OCPPEvent.remoteStopTransaction) return this.remoteStopTransaction({ payload, uniqueId });
      if (eventType === OCPPEvent.unlockConnector) return this.unlockConnector({ payload, uniqueId });
      if (eventType === OCPPEvent.changeAvailability) return this.changeAvailability({ payload, uniqueId });
      if (eventType === OCPPEvent.getConfiguration) return this.getConfiguration({ payload, uniqueId });
      if (eventType === OCPPEvent.changeConfiguration) return this.changeConfiguration({ payload, uniqueId });
    }
  };

  private getConfiguration = (args: { uniqueId: any; payload: any }) => {
    const { uniqueId } = args;
    const settings = this.getSettings();
    const readonlyKeys = ['numberOfConnectors', 'supportedFeatureProfiles'];
    const keys = Object.keys(settings.configurationKeys).map((key: string) => {
      return { key, value: settings.configurationKeys[key as keyof IRSettingsConfigurationKeys], readonly: readonlyKeys.includes(key) };
    });
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { configurationKey: [...keys], unknownKey: null }]);
  };
  private changeConfiguration = (args: { uniqueId: any; payload: any }) => {
    const { uniqueId, payload } = args;
    let newSettings: IRSettings = _.cloneDeep(this.getSettings());
    newSettings = { ...newSettings, configurationKeys: { ...newSettings.configurationKeys, [payload.key]: payload.value as any } };
    LocalStorage.setSettings(newSettings);
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
  };

  private changeAvailability = (args: { uniqueId: any; payload: any }) => {
    const { payload, uniqueId } = args;
    const { connectorId, type } = payload as { connectorId: number; type: OCPPConnectorAvailabilityType };
    const connector = AppChargePoint.getConnector(connectorId);
    if (!connector) return;
    const connectorStatus = _.cloneDeep(connector.getStatus());
    connectorStatus.availabilityType = type;
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
    connector.setStatus(connectorStatus);
  };
  private remoteStartTransaction = (args: { uniqueId: any; payload: any }) => {
    const { payload, uniqueId } = args;
    const store = _.cloneDeep(ReduxStore.getState());
    const connectorStatus = store.connectorStatus.data?.[payload.connectorId];
    if (connectorStatus?.ocppStatus !== OCPPConnectorStatus.preparing && connectorStatus?.ocppStatus !== OCPPConnectorStatus.finishing) {
      this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Rejected' }]);
      ReduxStore.dispatch({
        type: ReduxSymbols.logs.call,
        data: { information: `RemoteStartTransaction failed because connector status is ${connectorStatus?.ocppStatus}` },
      });
      return;
    }
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'RemoteStartTransaction Accepted and authorizing' } });
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
    ReduxStore.dispatch({ type: ReduxSymbols.startTransaction.call, data: { ...payload, event: OCPPEvent.authorize } });
  };
  private remoteStopTransaction = (args: { uniqueId: any; payload: any }) => {
    const { payload, uniqueId } = args;
    const store = _.cloneDeep(ReduxStore.getState());
    const stoppingTransaction = store.transactions.data?.find((e) => e.transactionId === payload?.transactionId);
    if (stoppingTransaction) {
      const newTransactions = store.transactions.data?.filter((e) => e.transactionId === payload?.transactionId) ?? [];
      ReduxStore.dispatch({ type: ReduxSymbols.transactions.call, data: newTransactions });
    } else {
      return this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Rejected' }]);
    }
    const connector = AppChargePoint.getConnector(stoppingTransaction?.connectorId);
    if (!connector) return this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Rejected' }]);
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
    connector.stopTransaction({ transactionId: payload?.transactionId });
  };

  private unlockConnector = (args: { uniqueId: any; payload: any }) => {
    const store = _.cloneDeep(ReduxStore.getState());
    const { payload, uniqueId } = args;
    const connectorStatus = store.connectorStatus.data?.[payload?.connectorId ?? -1];
    if (!connectorStatus?.ocppStatus || (connectorStatus?.ocppStatus !== OCPPConnectorStatus.finishing && connectorStatus.ocppStatus !== OCPPConnectorStatus.preparing)) {
      this.sendPayload([
        OCPPMessageType.callResultMessage,
        uniqueId,
        // eslint-disable-next-line max-len,prettier/prettier
        { status: 'Rejected', 'x-ma-information': 'You cannot unlock connector. Because connector status is not finishing status. If there is an active transaction use StopTransaction instead.' },
      ]);
      return;
    }
    this.sendPayload([OCPPMessageType.callResultMessage, uniqueId, { status: 'Accepted' }]);
    AppChargePoint.getConnector(payload?.connectorId)?.setStatus({ ...connectorStatus!, ocppStatus: OCPPConnectorStatus.available, isChargingSocketPlugged: false });
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
