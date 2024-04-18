import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AppContent from '../../components/content';
import { AppButton, AppForm, AppFormItem, AppFormValidation, AppInput, AppNumberInput } from '../../components/form';
import { IRSettings } from '../../redux/reducer/settings';
import { IReduxState } from '../../helpers/redux';
import ReduxSymbols from '../../redux/symbols';

const SettingsScren: React.FC<any> = () => {
  const [value, setValue] = useState<IRSettings>({} as IRSettings);
  const currentSettings: IReduxState<IRSettings> = useSelector((state: any) => state.settings);
  const localizationPrefix = 'settings';
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    setValue(currentSettings.data!);
  }, [currentSettings]);

  const onActionClick = () => {
    dispatch({ type: ReduxSymbols.settings.call, data: value });
  };
  return (
    <AppContent title={t(`${localizationPrefix}.pageTitle`)}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={14}>
          <AppFormValidation>
            <AppForm labelWrap={{ xs: 24, sm: 9, md: 7, lg: 9, xl: 7 }} colWrap={{ xs: 24, sm: 15, md: 17, lg: 15, xl: 17 }}>
              <AppFormItem label={t(`${localizationPrefix}.ocppWSUrl`)}>
                <AppInput value={value.ocppWSUrl} requiredRule={t(`${localizationPrefix}.ocppWSUrlRule`)} onChange={(e) => setValue({ ...value, ocppWSUrl: e ?? '' })} />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.chargePointCode`)}>
                <AppNumberInput
                  value={value.chargePointCode}
                  requiredRule={t(`${localizationPrefix}.chargePointCodeRule`)}
                  onChange={(e) => setValue({ ...value, chargePointCode: e })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.heartbeatInterval`)}>
                <AppNumberInput
                  value={value.heartbeatInterval}
                  requiredRule={t(`${localizationPrefix}.heartbeatInterval`)}
                  onChange={(e) => setValue({ ...value, heartbeatInterval: e })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.meterValueInterval`)}>
                <AppNumberInput
                  value={value.meterValueInterval}
                  requiredRule={t(`${localizationPrefix}.meterValueIntervalRule`)}
                  onChange={(e) => setValue({ ...value, meterValueInterval: e })}
                />
              </AppFormItem>
              <AppFormItem>
                <Row justify="end" style={{ marginTop: 15 }}>
                  <Col xs={24} md={12} xl={8}>
                    <AppButton isLoading={currentSettings.isLoading} text={t(`global.update`)} type="primary" onClick={onActionClick} />
                  </Col>
                </Row>
              </AppFormItem>
            </AppForm>
          </AppFormValidation>
        </Col>
      </Row>
    </AppContent>
  );
};

export default SettingsScren;
// wss://dev-gio..io/evc/api/ocpp/19CC716B-73CA-4BCE-A7EE-37E95366E8C7/313059181013
