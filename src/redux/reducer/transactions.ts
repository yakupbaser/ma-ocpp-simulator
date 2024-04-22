import LocalStorage from '../../helpers/local_storage';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRTransaction {
  transactionId: string;
  startMeter: number;
  connectorId: number;
  idTag: string;
  currentBatteryPercent: number;
  startAt: number;
}

export default ReduxHelper.generateReducer<IRTransaction[]>(ReduxSymbols.transactions, LocalStorage.getTransactions(), false);
