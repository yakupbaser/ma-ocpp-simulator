import OCPPEvent from '../../constants/ocpp/events';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRStartTransaction {
  connectorId: string;
  transactionId: string;
  uniqueId: string;
  idTag: string;
  event: OCPPEvent;
  meterStart: number;
  timestamp: string;
}

export default ReduxHelper.generateReducer<IRStartTransaction | undefined>(ReduxSymbols.startTransaction, undefined, false);
