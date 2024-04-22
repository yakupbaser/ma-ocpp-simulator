import { takeLatest } from 'redux-saga/effects';
import ReduxSymbols from '../../symbols';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* _func(callObject: any) {
  // const newStatus=callObject.
  // AppChargePoint.connectors.filter(e=>e.)
  // TODO: in the future
}

function* watcher() {
  yield takeLatest(ReduxSymbols.connectorsStatus.success, _func);
}

export default watcher();
