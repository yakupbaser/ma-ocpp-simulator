import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import { useAppFormValidationContext } from '../app_form/validation_group/context';
import './index.scss';
import AppHelper from '../../../helpers/app';

export interface IAppNumberInput {
  value?: number;
  decimalsLimit?: number;
  testId?: string;
  onChange?(value: number): any;
  requiredRule?: string;
  readOnly?: boolean;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  disableGroupSeperator?: boolean;
}

const AppNumberInput: React.FC<IAppNumberInput> = (props) => {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | undefined>(undefined);
  const [uniqueId] = useState(AppHelper.generateUniqueId());
  const [showValidationError, setShowValidationError] = useState<boolean>(false);
  const { t } = useTranslation();

  const { addValidateControl } = useAppFormValidationContext();

  const getNumberOfString = (numberOfString: string | undefined): number => {
    if (!numberOfString) return 0;
    const detectedNumber = parseFloat(numberOfString);
    return isNaN(detectedNumber) ? 0 : detectedNumber;
  };
  const onChange = (newValue: string | undefined) => {
    if (props.onChange) props.onChange(getNumberOfString(newValue));
    setInputValue(newValue);
  };

  const checkIsValid = (disableChangeMessage = false): boolean => {
    let result = true;
    let message;
    if (!!props.requiredRule && props.value?.toString() !== '0' && getNumberOfString(props.value?.toString()) === 0) {
      message = props.requiredRule;
      result = false;
    }
    if (!!props.requiredRule && (inputValue === undefined || inputValue?.toString().length === 0)) {
      message = props.requiredRule;
      result = false;
    }
    if ((inputValue?.toString().length ?? 0) > 0 && props.max !== undefined && props.max < parseFloat(inputValue ?? '0')) {
      message = t('global.validation.maxNumber').replace('___NUMBER___', props.max?.toString());
      result = false;
    }
    if ((inputValue?.toString().length ?? 0) > 0 && props.min !== undefined && props.min > parseFloat(inputValue ?? '0')) {
      message = t('global.validation.minNumber').replace('___NUMBER___', props.min?.toString());
      result = false;
    }
    if (!disableChangeMessage) setValidationErrorMessage(message);
    return result;
  };
  useEffect(() => {
    return () => addValidateControl(uniqueId, undefined);
  }, []);
  useEffect(() => {
    addValidateControl(uniqueId, () => checkIsValid());
  }, [inputValue]);
  useEffect(() => {
    if (inputValue === undefined || getNumberOfString(inputValue) !== props.value) {
      setInputValue(props.value?.toString());
    }
  }, [props]);

  let classNameOfContainer = '-app-form-item-container';
  if (!!validationErrorMessage && !checkIsValid(true)) classNameOfContainer += ' has-error ';
  if (props.readOnly) classNameOfContainer += ' -app-input-readonly ';
  if (props.disabled) classNameOfContainer += ' -app-input-disabled ';
  return (
    <div className={classNameOfContainer}>
      <CurrencyInput
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        min={props.min}
        max={props.max}
        className="-app-input"
        onFocus={() => setShowValidationError(true)}
        onBlur={() => setShowValidationError(false)}
        id={props.testId}
        value={inputValue}
        disableGroupSeparators={props.disableGroupSeperator}
        groupSeparator=" "
        decimalSeparator="."
        decimalsLimit={props.decimalsLimit ?? 2}
        step={1}
        onValueChange={onChange}
      />
      <label className={showValidationError ? 'active' : ''}>{validationErrorMessage}</label>
    </div>
  );
};
export default AppNumberInput;
