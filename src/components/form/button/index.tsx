import React from 'react';
import { useAppFormValidationContext } from '../app_form/validation_group/context';
import './index.scss';
import AppButtonIndicator from '../../indicators/button';

export interface IAppButton {
  onClick?(): any;
  testId?: string;
  text: string;
  disableValidationCheck?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'danger' | 'secondary' | 'primary';
  width?: any;
}
const AppButton: React.FC<IAppButton> = (props) => {
  const { validate } = useAppFormValidationContext();
  const onClick = () => {
    if (props.isLoading || props.disabled) return;
    if (!props.disableValidationCheck && !validate()) return null;
    if (props.onClick) props.onClick();
  };
  return (
    <span key={props.testId} id={props.testId} style={{ width: props.width ?? '100%' }} className={`-action-button ${props.type}`} onClick={onClick}>
      <AppButtonIndicator hidden={!props.isLoading} />
      <div hidden={props.isLoading} style={{ marginBottom: 10, marginTop: 10 }}>
        {props.text}
      </div>
    </span>
  );
};

export default AppButton;
