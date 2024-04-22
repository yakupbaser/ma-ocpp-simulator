import OCPPConnectorAvailabilityType from '../../constants/ocpp/connector_availability_type';
import OCPPConnectorStatus from '../../constants/ocpp/connector_statuses';
import ReduxHelper from '../../helpers/redux';
import ReduxSymbols from '../symbols';

export interface IRConnectorStatusConnectedCar {
  currentBatteryPercent: number;
  batteryVoltage: number;
  batteryCapacityKiloWatt: number;
}
export interface IRConnectorStatus {
  isConnectorReady: boolean;
  isCarReady: boolean;
  isChargingSocketPlugged: boolean;
  ocppStatus: OCPPConnectorStatus;
  availabilityType: OCPPConnectorAvailabilityType;
  car: IRConnectorStatusConnectedCar;
}
export interface IRConnectorStatuses {
  [connectorNumber: number]: IRConnectorStatus;
}
export default ReduxHelper.generateReducer<IRConnectorStatuses>(ReduxSymbols.connectorsStatus, {}, false);
