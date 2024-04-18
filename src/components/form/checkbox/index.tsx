import React from 'react';
import './index.scss';

export interface IAppCheckBox {
  value?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  testId?: string;
  text?: string;
  className?: string;
  onChange?(value?: boolean): void;
}
const AppCheckBox: React.FC<IAppCheckBox> = (props) => {
  return (
    <label className={`app-checkbox ${props.className}`}>
      <input
        type="checkbox"
        id={props.testId}
        disabled={props.disabled}
        readOnly={props.readOnly}
        name="checkbox-checked"
        checked={props.value}
        onChange={(e) => props.onChange && !props.readOnly && props.onChange(e.target.checked)}
      />
      {props.text}
    </label>
  );
};

export default AppCheckBox;
