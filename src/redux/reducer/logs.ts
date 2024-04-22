import { Moment } from 'moment';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRLog {
  uniqueId: string;
  information: string;
  createdAt: Moment;
  data: any;
}

export default ReduxHelper.generateReducer<IRLog[]>(ReduxSymbols.logs, [], false);
