import { combineReducers } from 'redux';

import settings from './settings';
import startTransaction from './start_transaction';
import transactions from './transactions';
import connectorStatus from './connector_status';
import logs from './logs';
import ReduxSymbols from '../symbols';
import ReduxHelper from '../../helpers/redux';

export default combineReducers({
  logs,
  settings,
  transactions,
  socketStatus: ReduxHelper.generateReducer<boolean>(ReduxSymbols.socketStatus, false),
  startTransaction,
  connectorStatus,
});
