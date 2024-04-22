import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AppIcons from '../icons';
import { IRLog } from '../../redux/reducer/logs';
import ReduxSymbols from '../../redux/symbols';

interface IAppContainerLogs {
  toggleLogs(): any;
  isShowing: boolean;
}
const AppContainerLogs: React.FC<IAppContainerLogs> = (props) => {
  const localizationPrefix = 'logs';
  const logs: IRLog[] = useSelector((state: any) => state.logs?.data ?? []);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onClearLogsClick = () => {
    dispatch({ type: ReduxSymbols.logs.clear });
  };
  const renderLog = (log: IRLog) => {
    return (
      <div className="log" key={`log-${log.uniqueId}`}>
        <div className="log-header">
          <label className="createdAt">{log.createdAt.format('HH:mm:ss')}</label>
          <label className="information">{log.information}</label>
        </div>
        {/* <label className="data" dangerouslySetInnerHTML={{ __html: log.data }}> */}
        <label className="data">{JSON.stringify(log.data)}</label>
      </div>
    );
  };
  return (
    <div className="app-logs">
      <div className="header">
        <div className="clear-logs" onClick={onClearLogsClick}>
          {t(`${localizationPrefix}.clearLogs`)}
        </div>
        <div className="information" onClick={props.toggleLogs}>
          {t(`${localizationPrefix}.${props.isShowing ? 'hideAllLogs' : 'showAllLogs'}`)}
        </div>
        {props.isShowing ? <AppIcons.GlobalChevronDown height={20} width={20} /> : <AppIcons.GlobalChevronUp height={20} width={20} />}
      </div>
      <div className="logs">{logs.map(renderLog)}</div>
    </div>
  );
};

export default AppContainerLogs;
