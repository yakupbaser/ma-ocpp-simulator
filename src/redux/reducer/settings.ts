import LocalStorage from '../../helpers/local_storage';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRSettings {
  ocppWSUrl: string;
  chargePointCode: number;
  heartbeatInterval: number;
  meterValueInterval: number;
}
const defaultSettings: IRSettings = {
  chargePointCode: 22,
  heartbeatInterval: 2,
  meterValueInterval: 2,
  ocppWSUrl: 'ws://localhost:11111/MY-OCPP-Chargestation',
};

export default ReduxHelper.generateReducer<IRSettings>(ReduxSymbols.settings, LocalStorage.getSettings() ?? defaultSettings, false);
