import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes, { IAppRoute } from '../../constants/routes';

const AppMenu: React.FC<any> = () => {
  const [activeMenuItemPath, setActiveMenuItemPath] = useState('/');

  const navigate = useNavigate();
  useEffect(() => {
    setActiveMenuItemPath(window.location.pathname);
  }, []);
  const onClickMenuItem = (e: any, menuItem: IAppRoute) => {
    e.stopPropagation();
    e.preventDefault();
    // window.history.pushState({}, menuItem.name, menuItem.path);
    setActiveMenuItemPath(menuItem.path);
    navigate(menuItem.path);
  };

  const renderMenuItem = (menuItem: IAppRoute) => {
    return (
      // eslint-disable-next-line max-len,prettier/prettier
      <a key={menuItem.name} href={menuItem.path} className={`menu-item ${activeMenuItemPath===menuItem.path?"active":"passive"}`}  onClick={(e: any) => onClickMenuItem(e, menuItem)}>
        <label className="name">{menuItem.name}</label>
      </a>
    );
  };
  return (
    <div className="app-menu">
      <label className="title">MA OCPP Simulator</label>
      <div className="menu-items">{AppRoutes.map(renderMenuItem)}</div>
    </div>
  );
};

export default AppMenu;
