/* eslint-disable class-methods-use-this */
import LocalStorageKey from '../constants/local_storage_keys';
import { IRConnectorStatuses } from '../redux/reducer/connector_status';
import { IRSettings } from '../redux/reducer/settings';
import { IRTransaction } from '../redux/reducer/transactions';

class _LocalStorageHelper {
  getSettings = (): IRSettings | undefined => {
    const settings = localStorage.getItem(LocalStorageKey.settings);
    if (settings) return JSON.parse(settings);
    return undefined;
  };
  setSettings = (settings: IRSettings) => {
    localStorage.setItem(LocalStorageKey.settings, JSON.stringify(settings));
  };
  getTransactions = (): IRTransaction[] | undefined => {
    const transactions = localStorage.getItem(LocalStorageKey.transactions);
    if (transactions) return JSON.parse(transactions);
    return undefined;
  };
  setTransactions = (transactions: IRTransaction[]) => {
    localStorage.setItem(LocalStorageKey.transactions, JSON.stringify(transactions));
  };
  getConnectorStatuses = (): IRConnectorStatuses | undefined => {
    const connectorStatuses = localStorage.getItem(LocalStorageKey.connectorStatuses);
    if (connectorStatuses) return JSON.parse(connectorStatuses);
    return undefined;
  };
  setConnectorStatuses = (connectorStatuses: IRConnectorStatuses) => {
    localStorage.setItem(LocalStorageKey.connectorStatuses, JSON.stringify(connectorStatuses));
  };
}

const LocalStorage = new _LocalStorageHelper();
export default LocalStorage;
