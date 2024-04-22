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
    if (currentSettings.data) setValue(currentSettings.data!);
  }, [currentSettings]);

  const onActionClick = () => {
    dispatch({ type: ReduxSymbols.settings.call, data: { ...value, maximumKw: Math.max(11, value.maximumKw) } });
  };
  return (
    <AppContent title={t(`${localizationPrefix}.pageTitle`)}>
      <AppFormValidation>
        <Row>
          <Col xs={24} sm={24} md={24} lg={12}>
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
              <AppFormItem label={t(`maximum kW`)}>
                <AppNumberInput min={11} value={value.maximumKw} onChange={(e) => setValue({ ...value, maximumKw: e })} />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.numberOfConnectors`)}>
                <AppNumberInput
                  max={5}
                  min={1}
                  value={value.configurationKeys?.numberOfConnectors}
                  requiredRule={t(`${localizationPrefix}.numberOfConnectorsRule`)}
                  onChange={(e) => setValue({ ...value, configurationKeys: { ...value.configurationKeys, numberOfConnectors: Math.max(1, e) } })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.heartbeatInterval`)}>
                <AppNumberInput
                  value={value.configurationKeys?.heartbeatInterval}
                  requiredRule={t(`${localizationPrefix}.heartbeatInterval`)}
                  onChange={(e) => setValue({ ...value, configurationKeys: { ...value.configurationKeys, heartbeatInterval: Math.max(1, e) } })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.meterValueInterval`)}>
                <AppNumberInput
                  value={value.configurationKeys?.meterValueInterval}
                  requiredRule={t(`${localizationPrefix}.meterValueInterval`)}
                  onChange={(e) => setValue({ ...value, configurationKeys: { ...value.configurationKeys, meterValueInterval: Math.max(1, e) } })}
                />
              </AppFormItem>
            </AppForm>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <AppForm labelWrap={{ xs: 24, sm: 9, md: 7, lg: 9, xl: 7 }} colWrap={{ xs: 24, sm: 15, md: 17, lg: 15, xl: 17 }}>
              <AppFormItem label={t(`${localizationPrefix}.chargePointVendor`)}>
                <AppInput
                  value={value.chargePointVendor}
                  requiredRule={t(`${localizationPrefix}.chargePointVendorRule`)}
                  onChange={(e) => setValue({ ...value, chargePointVendor: e ?? '' })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.chargePointModel`)}>
                <AppInput
                  value={value.chargePointModel}
                  requiredRule={t(`${localizationPrefix}.chargePointModelRule`)}
                  onChange={(e) => setValue({ ...value, chargePointModel: e ?? '' })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.chargePointSerialNumber`)}>
                <AppInput
                  value={value.chargePointSerialNumber}
                  requiredRule={t(`${localizationPrefix}.chargePointSerialNumberRule`)}
                  onChange={(e) => setValue({ ...value, chargePointSerialNumber: e ?? '' })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.chargeBoxSerialNumber`)}>
                <AppInput
                  value={value.chargeBoxSerialNumber}
                  requiredRule={t(`${localizationPrefix}.chargeBoxSerialNumberRule`)}
                  onChange={(e) => setValue({ ...value, chargeBoxSerialNumber: e ?? '' })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.firmwareVersion`)}>
                <AppInput
                  value={value.firmwareVersion}
                  requiredRule={t(`${localizationPrefix}.firmwareVersionRule`)}
                  onChange={(e) => setValue({ ...value, firmwareVersion: e ?? '' })}
                />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.iccid`)}>
                <AppInput value={value.iccid} requiredRule={t(`${localizationPrefix}.iccidRule`)} onChange={(e) => setValue({ ...value, iccid: e ?? '' })} />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.imsi`)}>
                <AppInput value={value.imsi} requiredRule={t(`${localizationPrefix}.imsiRule`)} onChange={(e) => setValue({ ...value, imsi: e ?? '' })} />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.meterType`)}>
                <AppInput value={value.meterType} requiredRule={t(`${localizationPrefix}.meterTypeRule`)} onChange={(e) => setValue({ ...value, meterType: e ?? '' })} />
              </AppFormItem>
              <AppFormItem label={t(`${localizationPrefix}.meterSerialNumber`)}>
                <AppInput
                  value={value.meterSerialNumber}
                  requiredRule={t(`${localizationPrefix}.meterSerialNumberRule`)}
                  onChange={(e) => setValue({ ...value, meterSerialNumber: e ?? '' })}
                />
              </AppFormItem>
            </AppForm>
          </Col>
          <Col xs={24} sm={14} md={10} lg={9} xl={8} xxl={6} xxxl={5} offset={{ sm: 10, md: 14, lg: 15, xl: 16, xxl: 18, xxxl: 19 }}>
            <AppButton isLoading={currentSettings.isLoading} text={t(`global.update`)} type="primary" onClick={onActionClick} />
          </Col>
        </Row>
      </AppFormValidation>
    </AppContent>
  );
};

export default SettingsScren;
// wss://dev-gio..io/evc/api/ocpp/19CC716B-73CA-4BCE-A7EE-37E95366E8C7/313059181013
