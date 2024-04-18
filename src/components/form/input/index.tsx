import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppFormValidationContext } from '../app_form/validation_group/context';
import './index.scss';
import AppHelper from '../../../helpers/app';

export interface IAppInputMinLenghtValidation {
  min: number;
  message: string;
}
export interface IAppInputMaxLenghtValidation {
  min: number;
  message: string;
}
export interface IAppInput {
  textBoxRef?: any;
  value?: string | number;
  line?: number;
  onChange?(text?: string): any;
  placeholder?: string;
  requiredRule?: string;
  mask?: string;
  emailRule?: string;
  validationType?: 'url';
  readOnly?: boolean;
  disabled?: boolean;
  minLengthValidation?: IAppInputMinLenghtValidation;
  maxLengthValidation?: IAppInputMaxLenghtValidation;
}

const AppInput: React.FC<IAppInput> = (props) => {
  const [showValidationError, setShowValidationError] = useState<boolean>(false);
  const ref = useRef<any>();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string | number | undefined>(props.value ?? '');
  const onChange = (newValue: string | undefined) => {
    if (props.onChange) props.onChange(newValue);
  };
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | undefined>(undefined);
  const [uniqueId] = useState(AppHelper.generateUniqueId());
  const { addValidateControl } = useAppFormValidationContext();
  const validateEmail = (email: any) => {
    return String(email)
      .toLowerCase()
      .match(
        // eslint-disable-next-line max-len
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const checkIsValid = (disableChangeMessage = false): boolean => {
    const isWritedAnyValueOnInput = !!props.value && props.value.toString().length > 0;
    // console.log('isWritedAnyValueOnInput', isWritedAnyValueOnInput, props.validationType, AppHelper.urlControl(props.value?.toString() ?? ''));
    let result = true;
    let message;
    if (isWritedAnyValueOnInput && !!props.mask && props.mask.length !== props.value?.toString().length) {
      message = t('global.validation.invalidVariable');
      result = false;
    } else if (!!props.requiredRule && (props.value === undefined || (props.value ?? '').toString().length === 0)) {
      message = props.requiredRule;
      result = false;
    } else if (!!props.emailRule && !validateEmail(props.value)) {
      message = props.emailRule;
      result = false;
      // eslint-disable-next-line max-len,prettier/prettier
    } else if (isWritedAnyValueOnInput && props.validationType === 'url' && !AppHelper.urlControl(props.value!.toString())) {
      message = t('global.validation.url');
      result = false;
    } else if (!!props.minLengthValidation && (!props.value || props.value.toString().length < props.minLengthValidation.min)) {
      message = props.minLengthValidation.message;
      result = false;
    } else if (!!props.maxLengthValidation && (!props.value || props.value.toString().length > props.maxLengthValidation.min)) {
      message = props.maxLengthValidation.message;
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
    setInputValue(props.value);
  }, [props]);

  const renderInput = () => {
    if (props.line) {
      return (
        <textarea
          className="-app-textarea"
          rows={props.line}
          disabled={props.disabled}
          readOnly={props.readOnly}
          placeholder={props.placeholder}
          ref={props?.textBoxRef ?? ref}
          onFocus={() => setShowValidationError(true)}
          onBlur={() => setShowValidationError(false)}
          value={props.value ?? inputValue}
          onChange={({ target: { value } }) => onChange(value)}
        />
      );
    }

    return (
      <input
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        className="-app-input"
        onFocus={() => setShowValidationError(true)}
        onBlur={() => setShowValidationError(false)}
        ref={props?.textBoxRef ?? ref}
        value={props.value ?? inputValue}
        onChange={({ target: { value } }: any) => onChange(value)}
      />
    );
  };
  let classNameOfContainer = '-app-form-item-container';
  if (!!validationErrorMessage && !checkIsValid(true)) classNameOfContainer += ' has-error ';
  if (props.readOnly) classNameOfContainer += ' -app-input-readonly ';
  if (props.disabled) classNameOfContainer += ' -app-input-disabled ';

  return (
    <div className={classNameOfContainer}>
      {renderInput()}
      <label className={showValidationError ? 'active' : ''}>{validationErrorMessage}</label>
    </div>
  );
};
export default AppInput;
