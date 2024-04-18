import React from 'react';
import { ScreenClassMap } from 'react-grid-system';
import { AppFormContext } from './context';
import AppFormItem, { _IAppFormItem as IAppFormItem } from './item';
import AppFormValidation from './validation_group';
import './index.scss';

interface IAppForm {
  labelWrap: ScreenClassMap<number>;
  colWrap: ScreenClassMap<number>;
  children: any;
  className?: string;
}
const AppForm: React.FC<IAppForm> = (props) => {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextVariables = { labelWrap: props.labelWrap, colWrap: props.colWrap };
  return (
    <AppFormContext.Provider value={contextVariables}>
      <div className={`app-form ${props.className}`}>{props.children}</div>
    </AppFormContext.Provider>
  );
};

export { AppFormItem, AppFormValidation };
export type { IAppFormItem };
export default AppForm;
