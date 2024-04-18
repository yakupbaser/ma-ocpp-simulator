import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const AppContentSocketConnectionStatus: React.FC<any> = () => {
  const isConnected: boolean = useSelector((state: any) => state.socketStatus.data);
  const { t } = useTranslation();
  return (
    <div className={`socket-connection-status-container ${isConnected ? 'connected' : 'disconnected'}`}>
      {t(`global.${isConnected ? 'socketConnected' : 'socketIsNotConnectedYet'}`)}
    </div>
  );
};

export default AppContentSocketConnectionStatus;
