import { combineReducers } from 'redux';

import settings from './settings';
import startTransaction from './start_transaction';
import transaction from './transaction';
import ReduxSymbols from '../symbols';
import ReduxHelper from '../../helpers/redux';

export default combineReducers({
  settings,
  transaction,
  socketStatus: ReduxHelper.generateReducer<boolean>(ReduxSymbols.socketStatus, false),
  startTransaction,
});
