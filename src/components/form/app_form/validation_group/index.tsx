import React, { useState } from 'react';
import { AppFormValidationContext } from './context';

interface IAppFormValidation {
  children: any;
}
const AppFormValidation: React.FC<IAppFormValidation> = (props) => {
  const [validateControls, setValidateControls] = useState<{ [key: string]: { (): boolean } | undefined }>({});
  const validate = (): boolean => {
    let result = true;
    Object.values(validateControls).forEach((validateControl) => {
      if (validateControl && !validateControl()) {
        result = false;
      }
    });
    return result;
  };
  const addValidateControl = (controlKey: string, control?: { (): boolean }) => {
    setValidateControls((tempValidateControls: any) => ({ ...tempValidateControls, [controlKey]: control }));
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <AppFormValidationContext.Provider value={{ addValidateControl, validate }}>{props.children}</AppFormValidationContext.Provider>;
};

export default AppFormValidation;
