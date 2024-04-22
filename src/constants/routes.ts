import React from 'react';
import AppHelper from '../helpers/app';

export interface IAppRoute {
  path: string;
  screen: any;
  name: string;
}

const generateLazy = (screen: string, sleepTime = 750) => {
  return React.lazy(async () => {
    await AppHelper.sleep(sleepTime);
    // eslint-disable-next-line max-len,prettier/prettier
    return import(`../screens${screen.charAt(0) === '/' ? screen : `/${screen}`}`);
  });
};
const AppRoutes: IAppRoute[] = [
  { path: '/', name: 'Home', screen: generateLazy('/home') },
  { path: '/charge-point', name: 'Charge Point', screen: generateLazy('/charge_point') },
  { path: '/settings', name: 'Settings', screen: generateLazy('/settings') },
];

export default AppRoutes;
