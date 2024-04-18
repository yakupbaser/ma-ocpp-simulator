import React from 'react';
import './index.scss';

export interface IAppSwitch {
  isChecked: boolean;
  testId?: string;
  width?: number;
  isLoading?: boolean;
  onChange(isChecked: boolean): void;
}
const AppSwitch: React.FC<IAppSwitch> = (props) => {
  return (
    <label className={`app-switch-${props.width ?? 60}`} id={props.testId}>
      <input type="checkbox" checked={props.isChecked} onChange={(e) => !props.isLoading && props.onChange(e.target.checked)} />
      <span className={`app-switch-slider round ${props.isLoading ? 'loading' : ''}`} />
    </label>
  );
};

export default AppSwitch;
