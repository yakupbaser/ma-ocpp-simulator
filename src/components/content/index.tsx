import React from 'react';
import './index.scss';
import AppContentSocketConnectionStatus from './socket_status';

interface IAppContent {
  children: any;
  title: string;
}
const AppContent: React.FC<IAppContent> = (props) => {
  return (
    <div className="app-content">
      <AppContentSocketConnectionStatus />
      <div className="app-content-container">
        <div className="title">{props.title}</div>
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
};

export default AppContent;
