import { put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';
import ReduxSymbols from '../symbols';
import { IRLog } from '../reducer/logs';
import AppHelper from '../../helpers/app';

function* _func(callObject: any) {
  let logs: IRLog[] = yield select((state: any) => state.logs.data ?? []);
  logs = _.cloneDeep(logs);
  const now = moment();
  logs.unshift({ createdAt: now, ...callObject.data, uniqueId: `${now.unix()}-${AppHelper.generateUniqueId()}` });
  yield put({ type: ReduxSymbols.logs.success, data: logs });
}

function* watcher() {
  yield takeLatest(ReduxSymbols.logs.call, _func);
}

export default watcher();
