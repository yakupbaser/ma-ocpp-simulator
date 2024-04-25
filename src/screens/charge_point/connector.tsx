/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-grid-system';
import { IRConnectorStatus, IRConnectorStatusConnectedCar, IRConnectorStatuses } from '../../redux/reducer/connector_status';
import { AppButton, AppInput, AppSwitch } from '../../components/form';
import AppChargePoint from '../../helpers/charge_point';
import AppHelper from '../../helpers/app';
import OCPPConnectorStatus from '../../constants/ocpp/connector_statuses';
import OCPPConnectorAvailabilityType from '../../constants/ocpp/connector_availability_type';
import ReduxSymbols from '../../redux/symbols';
import ReduxStore from '../../redux';
import { IReduxState } from '../../helpers/redux';
import OCPPEvent from '../../constants/ocpp/events';
import AppMessage from '../../helpers/message';

interface IChargePointScreenConnector {
  connectorNumber: number;
}
type ConnectorSwitchKeys = 'isConnectorReady' | 'isCarReady' | 'isChargingSocketPlugged';
const ChargePointScreenConnector: React.FC<IChargePointScreenConnector> = (props) => {
  const connectorStatuses: IReduxState<IRConnectorStatuses> = useSelector((state: any) => state.connectorStatus);
  const connectorStatus = connectorStatuses.data![props.connectorNumber]!;
  const localizationPrefix = 'chargePoint.connector';
  const [changingKey, setChangingKey] = useState<ConnectorSwitchKeys | undefined>(undefined);
  const [idTag, setIdTag] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const [currentWatt, setCurrentWatt] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWatt(AppChargePoint.getConnector(props.connectorNumber)?.currentEnergyWatt ?? 0);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const onStartTransactionClick = () => {
    if ((idTag?.length ?? 0) === 0) return AppMessage.showError({ message: t(`${localizationPrefix}.pleaseEnterValidIDTag`) });
    dispatch({ type: ReduxSymbols.startTransaction.call, data: { connectorId: props.connectorNumber, idTag, event: OCPPEvent.authorize } });
  };
  const onConnectorStatusChange = async (status: IRConnectorStatus, key: ConnectorSwitchKeys) => {
    setChangingKey(key);
    const connector = AppChargePoint.connectors.find((e) => e.getNumber() === props.connectorNumber);
    await AppHelper.sleep(1000); // for animation
    let newStatus = { ...status };
    if (status.isChargingSocketPlugged) {
      newStatus = { ...newStatus, ocppStatus: OCPPConnectorStatus.preparing };
    } else if (status.isCarReady || status.isConnectorReady) {
      newStatus = { ...newStatus, ocppStatus: OCPPConnectorStatus.available };
    } else {
      newStatus = { ...newStatus, ocppStatus: OCPPConnectorStatus.unavailable };
    }
    await connector?.setStatus(newStatus);
    setChangingKey(undefined);
  };

  const onCarInformationChange = (key: keyof IRConnectorStatusConnectedCar, value: any) => {
    AppChargePoint.getConnector(props.connectorNumber)?.setStatus({ ...connectorStatus, car: { ...connectorStatus.car, [key]: parseInt(value) } });
  };

  const renderSwitch = (args: { key: ConnectorSwitchKeys; disabled: boolean }) => {
    return (
      <AppSwitch
        isLoading={changingKey === args.key}
        isDisabled={args.disabled}
        isChecked={connectorStatus[args.key]}
        onChange={(value) => onConnectorStatusChange({ ...connectorStatus, [args.key]: value }, args.key)}
        width={50}
      />
    );
  };
  const renderCarInformationRange = (key: keyof IRConnectorStatusConnectedCar, maxValue: number, suffix: string) => {
    const isDisabled = connectorStatus.ocppStatus === OCPPConnectorStatus.charging || !connectorStatus.isChargingSocketPlugged;
    return (
      <div className="item-container">
        <label className="name">{t(`${localizationPrefix}.carInformation.${key}`)}</label>
        <div className="item">
          <input
            disabled={isDisabled}
            value={connectorStatus.car[key]}
            type="range"
            id="volume"
            name="volume"
            min="0"
            max={maxValue}
            onChange={(e) => onCarInformationChange(key, e.target.value)}
          />
        </div>
        <label className="value">
          ({connectorStatus.car[key]} {suffix})
        </label>
      </div>
    );
  };
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!connectorStatus) return <></>;
  return (
    <Row className="connector">
      <Col xs={24} sm={24} md={24} lg={12} xl={10} xxl={9} className="connector-informations">
        <div className="header">
          <label className="name">{`${t(`${localizationPrefix}.connectorNumber`)}: ${props.connectorNumber}`}</label>
          <label className={`status ${connectorStatus.ocppStatus?.toLowerCase()}`}>{connectorStatus.ocppStatus}</label>
        </div>
        <div className="action-buttons">
          <div className="action-button">
            <label className="action">{`${t(`${localizationPrefix}.energy`)}: ${Math.floor(currentWatt)} W`}</label>
          </div>
          <div className="action-button">
            <label className="action">{t(`${localizationPrefix}.connectorReady`)}</label>
            {renderSwitch({ key: 'isConnectorReady', disabled: connectorStatus.isChargingSocketPlugged || connectorStatus.isCarReady })}
          </div>
          <div className="action-button">
            <label className="action">{t(`${localizationPrefix}.carIsReady`)}</label>
            {renderSwitch({ key: 'isCarReady', disabled: !connectorStatus.isConnectorReady || connectorStatus.isChargingSocketPlugged })}
          </div>
          <div className="action-button">
            <label className="action">{t(`${localizationPrefix}.chargingSocketPlugged`)}</label>
            {renderSwitch({
              key: 'isChargingSocketPlugged',
              disabled: !connectorStatus.isCarReady || connectorStatus.availabilityType === OCPPConnectorAvailabilityType.inoperative,
            })}
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={14} xxl={15} className="car-informations">
        <div className="header">
          <label className="name">{`${t(`${localizationPrefix}.carInformation.title`)}`}</label>
        </div>
        {renderCarInformationRange('currentBatteryPercent', 100, '%')}
        {renderCarInformationRange('batteryCapacityKiloWatt', 150, 'kW')}
        {renderCarInformationRange('batteryVoltage', 800, 'V')}
        <div
          className="start-transaction-container"
          hidden={connectorStatus.ocppStatus !== OCPPConnectorStatus.preparing && connectorStatus.ocppStatus !== OCPPConnectorStatus.finishing}
        >
          <AppInput value={idTag} onChange={setIdTag} placeholder="idTag" />
          <AppButton text={t(`${localizationPrefix}.startTransaction`)} type="primary" onClick={onStartTransactionClick} />
        </div>
      </Col>
    </Row>
  );
};

export default ChargePointScreenConnector;
