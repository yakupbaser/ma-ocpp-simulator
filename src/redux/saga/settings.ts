import { put, takeLatest } from 'redux-saga/effects';
import { t } from 'i18next';
import ReduxSymbols from '../symbols';
import LocalStorage from '../../helpers/local_storage';
import AppMessage from '../../helpers/message';
import AppSocket from '../../socket';
import AppHelper from '../../helpers/app';

function* _func(callObject: any) {
  LocalStorage.setSettings(callObject.data);
  if (callObject.disableReconnectSocket) {
    yield put({ type: ReduxSymbols.settings.success, data: callObject.data });
    return;
  }
  AppSocket.closeConnection();
  yield AppHelper.sleep(1000);
  yield put({ type: ReduxSymbols.settings.success, data: callObject.data });
  AppMessage.showSuccess({ message: t('settings.updatedSuccessfully') });
  AppSocket.connect();
}

function* watcher() {
  yield takeLatest(ReduxSymbols.settings.call, _func);
}

export default watcher();
