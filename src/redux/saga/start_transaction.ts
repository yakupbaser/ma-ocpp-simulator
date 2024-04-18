import { put, takeLatest } from 'redux-saga/effects';
import ReduxSymbols from '../symbols';
import AppSocket from '../../socket';
import OCPPMessageType from '../../constants/ocpp/message_types';
import AppHelper from '../../helpers/app';
import OCPPEvent from '../../constants/ocpp/events';
import { IRStartTransaction } from '../reducer/start_transaction';

function* _func(callObject: any) {
  const { connectorId, idTag, event, meterStart, transactionId } = callObject.data as IRStartTransaction;
  const timestamp = new Date().toISOString();
  const uniqueId = AppHelper.generateUniqueId();
  if (event === OCPPEvent.authorize) {
    yield put({ type: ReduxSymbols.startTransaction.success, data: { connectorId, uniqueId, idTag, event } });
    AppSocket.sendPayload([OCPPMessageType.callMessage, uniqueId, event, { idTag }]);
  }
  if (event === OCPPEvent.startTransaction) {
    yield put({ type: ReduxSymbols.startTransaction.success, data: { meterStart, connectorId, uniqueId, idTag, event, timestamp } });
    AppSocket.sendPayload([OCPPMessageType.callMessage, uniqueId, event, { idTag, meterStart, connectorId, timestamp }]);
  }
  if (event === OCPPEvent.statusNotification) {
    AppSocket.sendPayload([
      OCPPMessageType.callMessage,
      uniqueId,
      event,
      {
        connectorId: 1,
        errorCode: 'NoError',
        status: 'Preparing',
      },
    ]);
    // TODO: In the future we will check the status message responses also
    yield AppHelper.sleep(1000);
    AppSocket.sendPayload([
      OCPPMessageType.callMessage,
      uniqueId,
      event,
      {
        connectorId: 1,
        errorCode: 'NoError',
        status: 'Charging',
        info: 'Charging',
      },
    ]);
    yield put({ type: ReduxSymbols.transaction.call, data: { transactionId, startMeter: 0, connectorId: 1 } });
    yield put({ type: ReduxSymbols.startTransaction.clear });
  }
}

function* watcher() {
  yield takeLatest(ReduxSymbols.startTransaction.call, _func);
}

export default watcher();
