import { createContext, useContext } from 'react';
import { ScreenClassMap } from 'react-grid-system';

export interface IAppFormContext {
  labelWrap: ScreenClassMap<number>;
  colWrap: ScreenClassMap<number>;
}
export const AppFormContext = createContext<IAppFormContext>({
  labelWrap: { xs: 24 },
  colWrap: { xs: 24 },
});
export const useAppFormContext = () => useContext(AppFormContext);
