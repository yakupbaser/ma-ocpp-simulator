import ReduxHelper from '../../helpers/redux';

const ReduxSymbols = {
  settings: ReduxHelper.generateSymbol('APP_SETTINGS'),
  socketStatus: ReduxHelper.generateSymbol('SOCKET_STATUS'),
  transaction: ReduxHelper.generateSymbol('TRANSACTION'),
  startTransaction: ReduxHelper.generateSymbol('START_TRANSACTION'),
};

export default ReduxSymbols;
