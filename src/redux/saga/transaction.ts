import { put, takeLatest } from 'redux-saga/effects';
import ReduxSymbols from '../symbols';
import LocalStorage from '../../helpers/local_storage';

function* _func(callObject: any) {
  LocalStorage.setTransaction(callObject.data);
  yield put({ type: ReduxSymbols.transaction.success, data: callObject.data });
}

function* watcher() {
  yield takeLatest(ReduxSymbols.transaction.call, _func);
}

export default watcher();
