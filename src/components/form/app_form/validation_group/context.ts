import { createContext, useContext } from 'react';

export interface IAppFormValidationContext {
  addValidateControl(controlKey: string, control?: { (): boolean }): void;
  validate(): boolean;
}
export const AppFormValidationContext = createContext<IAppFormValidationContext>({
  addValidateControl: () => {},
  validate: () => true,
});
export const useAppFormValidationContext = () => useContext(AppFormValidationContext);
