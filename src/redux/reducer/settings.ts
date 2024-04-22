import LocalStorage from '../../helpers/local_storage';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRSettingsConfigurationKeys {
  numberOfConnectors: number;
  supportedFeatureProfiles: string;
  heartbeatInterval: number;
  meterValueInterval: number;
}
export interface IRSettings {
  ocppWSUrl: string;
  maximumKw: number;
  chargePointCode: number;
  chargePointVendor: string;
  chargePointModel: string;
  chargePointSerialNumber: string;
  chargeBoxSerialNumber: string;
  firmwareVersion: string;
  iccid: string;
  imsi: string;
  meterType: string;
  meterSerialNumber: string;
  configurationKeys: IRSettingsConfigurationKeys;
}
const defaultSettings: IRSettings = {
  maximumKw: 180,
  chargePointCode: 1,
  ocppWSUrl: 'ws://localhost:11111/MY-OCPP-Chargestation',
  chargePointVendor: 'CP-VENDOR',
  chargePointModel: 'CP-MODEL',
  chargePointSerialNumber: 'f219cbaf-2e72-4104-bc4c-9a23482e21c6',
  chargeBoxSerialNumber: 'f219cbaf-2e72-4104-bc4c-9a23482e21c6',
  firmwareVersion: '1.1.02',
  iccid: '0fa34c76-1aea-4531-980b-644eaeb085cb',
  imsi: '264fe426-0daf-4974-bdaf-35b6861d8115',
  meterType: 'Meter-Value',
  meterSerialNumber: 'f219cbaf-2e72-4104-bc4c-9a23482e21c6',
  configurationKeys: {
    numberOfConnectors: 2,
    supportedFeatureProfiles: 'Core,LocalAuthListManagement,RemoteTrigger,SoC',
    heartbeatInterval: 1,
    meterValueInterval: 1,
  },
};

export default ReduxHelper.generateReducer<IRSettings>(ReduxSymbols.settings, LocalStorage.getSettings() ?? defaultSettings, true);
