import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from '../../constants/routes';
import AppMenu from './menu';
import './index.scss';
import AppIndicatorScreen from '../indicators/screen';

export interface IAppContainer {}

const AppContainer: React.FC<IAppContainer> = () => {
  const HomeScreen = AppRoutes.filter((e) => e.path === '/')[0].screen;
  return (
    <div className="app-container">
      <AppMenu />
      <Routes>
        <Route
          path="*"
          element={
            <Suspense fallback={<AppIndicatorScreen />}>
              <HomeScreen />
            </Suspense>
          }
        />
        {AppRoutes.map((e) => (
          <Route
            key={e.path}
            {...e}
            element={
              <Suspense fallback={<AppIndicatorScreen />}>
                <e.screen />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </div>
  );
};
export default AppContainer;
