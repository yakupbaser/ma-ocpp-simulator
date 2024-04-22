import { put, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import ReduxSymbols from '../symbols';
import OCPPMessageType from '../../constants/ocpp/message_types';
import AppHelper from '../../helpers/app';
import OCPPEvent from '../../constants/ocpp/events';
import { IRStartTransaction } from '../reducer/start_transaction';
import OCPPConnectorStatus from '../../constants/ocpp/connector_statuses';
import AppSocket from '../../socket';
import ReduxStore from '..';
import AppChargePoint from '../../helpers/charge_point';

const _authorizeCallback = (connectorId: number, socketData: any) => {
  // Authorize response
  const store = _.cloneDeep(ReduxStore.getState());
  const [, , authorizeResponse] = socketData;
  const startTransactionData = store.startTransaction.data;
  if (authorizeResponse?.idTagInfo?.status === 'Accepted') {
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Authorizing accepted from startTransaction', data: socketData } });
    // Authorize accepted for idTag
    ReduxStore.dispatch({
      type: ReduxSymbols.startTransaction.call,
      data: { ...startTransactionData, event: OCPPEvent.startTransaction, meterStart: Math.floor(AppChargePoint.getConnector(connectorId)?.currentEnergyWatt ?? 0) },
    });
  } else {
    // TODO: Not accepted authorize
  }
};
const _startTransactionCallback = (connectorId: number, idTag: any, socketData: any) => {
  // Authorize response
  const store = _.cloneDeep(ReduxStore.getState());
  const [, , startTransactionResponse] = socketData;
  const startTransactionData = store.startTransaction.data;
  if (startTransactionResponse?.idTagInfo?.status === 'Accepted') {
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Transaction started successfully', socketData } });
    // Authorize accepted for idTag
    ReduxStore.dispatch({
      type: ReduxSymbols.startTransaction.call,
      data: { ...startTransactionData, event: OCPPEvent.statusNotification, transactionId: startTransactionResponse?.transactionId },
    });
    const oldConnectorStatus = store.connectorStatus.data?.[connectorId];
    const connector = AppChargePoint.getConnector(connectorId)!;
    if (!oldConnectorStatus) return;
    AppChargePoint.connectors.find((e) => e.getNumber() === 1)?.setStatus({ ...oldConnectorStatus!, ocppStatus: OCPPConnectorStatus.charging });
    ReduxStore.dispatch({
      type: ReduxSymbols.transactions.call,
      data: [
        ...(store.transactions.data ?? []),
        {
          transactionId: startTransactionResponse?.transactionId,
          idTag,
          startMeter: connector.currentEnergyWatt,
          connectorId,
          startAt: moment().unix(),
          currentBatteryPercent: oldConnectorStatus.car.currentBatteryPercent,
        },
      ],
    });
  } else {
    // TODO: Not accepted startTransaction
  }
};

function* _func(callObject: any) {
  const { connectorId, idTag, event, meterStart } = callObject.data as IRStartTransaction;
  const timestamp = moment().utc().toISOString();
  const uniqueId = AppHelper.generateUniqueId();
  if (event === OCPPEvent.authorize) {
    yield put({ type: ReduxSymbols.startTransaction.success, data: { connectorId, uniqueId, idTag, event } });
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Authorizing', data: { idTag } } });
    AppSocket.addSocketEventCallback(uniqueId, (socketData) => _authorizeCallback(parseInt(connectorId), socketData));
    AppSocket.sendPayload([OCPPMessageType.callMessage, uniqueId, event, { idTag }]);
  }
  if (event === OCPPEvent.startTransaction) {
    ReduxStore.dispatch({ type: ReduxSymbols.logs.call, data: { information: 'Transaction starting', data: { idTag, meterStart, connectorId, timestamp } } });
    yield put({ type: ReduxSymbols.startTransaction.success, data: { meterStart, connectorId, uniqueId, idTag, event, timestamp } });
    AppSocket.addSocketEventCallback(uniqueId, (socketData) => _startTransactionCallback(parseInt(connectorId), idTag, socketData));
    AppSocket.sendPayload([OCPPMessageType.callMessage, uniqueId, event, { idTag, meterStart, connectorId, timestamp }]);
  }
}

function* watcher() {
  yield takeLatest(ReduxSymbols.startTransaction.call, _func);
}

export default watcher();
