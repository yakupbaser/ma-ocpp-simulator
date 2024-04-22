import { put, takeLatest } from 'redux-saga/effects';
import ReduxSymbols from '../symbols';
import LocalStorage from '../../helpers/local_storage';
import { IRTransaction } from '../reducer/transactions';

function* _func(callObject: any) {
  const transactions: IRTransaction[] = callObject.data;
  LocalStorage.setTransactions(transactions);
  yield put({ type: ReduxSymbols.transactions.success, data: callObject.data });
}

function* watcher() {
  yield takeLatest(ReduxSymbols.transactions.call, _func);
}

export default watcher();
