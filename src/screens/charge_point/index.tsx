import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-grid-system';
import AppContent from '../../components/content';
import { IReduxState } from '../../helpers/redux';
import { IRConnectorStatuses } from '../../redux/reducer/connector_status';
import ChargePointScreenConnector from './connector';
import './index.scss';
import AppChargePoint from '../../helpers/charge_point';
import AppSocket from '../../socket';
import ChargePointScreenVariables from './variables';

const ChargePointScreen: React.FC<any> = () => {
  const currentChargePoint: IReduxState<IRConnectorStatuses> = useSelector((state: any) => state.connectorStatus);
  const localizationPrefix = 'chargePoint';
  const { t } = useTranslation();
  const renderConnectors = () => {
    if (!currentChargePoint.data) return;
    return AppChargePoint.connectors.map((connector) => {
      return <ChargePointScreenConnector key={connector.getNumber()} connectorNumber={connector.getNumber()} />;
    });
  };
  return (
    <AppContent title={`${t(`${localizationPrefix}.pageTitle`)}-${AppSocket.getSettings().chargePointCode} (${AppSocket.getSettings().maximumKw} kW)`}>
      <ChargePointScreenVariables />
      <Row className="charge-point-connectors">
        <Col xs={24}>{renderConnectors()}</Col>
      </Row>
    </AppContent>
  );
};

export default ChargePointScreen;
