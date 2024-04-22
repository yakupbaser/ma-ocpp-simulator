import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import AppChargePoint from '../../helpers/charge_point';

const ChargePointScreenVariables: React.FC<any> = () => {
  const localizationPrefix = 'chargePoint';
  const [settings, setSettings] = useState({ currentPowerWatt: 0 });
  const { t } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setSettings({ currentPowerWatt: AppChargePoint.currentPowerWatt });
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Row className="charge-point-variables">
      <Col md={6} sm={24} className="variable">
        <div className="variable-name">{t(`${localizationPrefix}.power`)}</div>
        <div className="value">{settings.currentPowerWatt} W</div>
      </Col>
      <Col md={6} sm={24} offset={{ md: 3, sm: 0 }} className="variable">
        <div className="variable-name">{t(`${localizationPrefix}.amper`)}</div>
        <div className="value">-</div>
      </Col>
      <Col md={6} sm={24} offset={{ md: 3, sm: 0 }} className="variable">
        <div className="variable-name">{t(`${localizationPrefix}.voltage`)}</div>
        <div className="value">-</div>
      </Col>
    </Row>
  );
};

export default ChargePointScreenVariables;
