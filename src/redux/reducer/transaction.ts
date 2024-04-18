import LocalStorage from '../../helpers/local_storage';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRTransaction {
  transactionId: string;
  startMeter: number;
  connectorId: number;
}

export default ReduxHelper.generateReducer<IRTransaction>(ReduxSymbols.transaction, LocalStorage.getTransaction(), false);
