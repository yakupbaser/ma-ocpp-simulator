import ReduxHelper from '../../helpers/redux';

const ReduxSymbols = {
  settings: ReduxHelper.generateSymbol('APP_SETTINGS'),
  socketStatus: ReduxHelper.generateSymbol('SOCKET_STATUS'),
  transactions: ReduxHelper.generateSymbol('TRANSACTIONS'),
  startTransaction: ReduxHelper.generateSymbol('START_TRANSACTION'),
  connectorsStatus: ReduxHelper.generateSymbol('CONNECTORS_STATUS'),
  logs: ReduxHelper.generateSymbol('LOGS'),
};

export default ReduxSymbols;
