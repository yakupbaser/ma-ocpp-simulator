import React from 'react';
import AppIndicator from './app';

export interface IAppIndicatorScreen {}
const AppIndicatorScreen: React.FC<IAppIndicatorScreen> = () => {
  return (
    <div
      style={{
        width: window.innerWidth - 250,
        height: window.innerHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AppIndicator width={150} height={150} disableDelay />
    </div>
  );
};

export default AppIndicatorScreen;
