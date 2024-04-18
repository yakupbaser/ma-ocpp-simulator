/* eslint-disable class-methods-use-this */
import LocalStorageKey from '../constants/local_storage_keys';
import { IRSettings } from '../redux/reducer/settings';
import { IRTransaction } from '../redux/reducer/transaction';

class _LocalStorageHelper {
  getSettings = (): IRSettings | undefined => {
    const settings = localStorage.getItem(LocalStorageKey.settings);
    if (settings) return JSON.parse(settings);
    return undefined;
  };
  setSettings = (settings: IRSettings) => {
    localStorage.setItem(LocalStorageKey.settings, JSON.stringify(settings));
  };
  getTransaction = (): IRTransaction | undefined => {
    const transaction = localStorage.getItem(LocalStorageKey.transaction);
    if (transaction) return JSON.parse(transaction);
    return undefined;
  };
  setTransaction = (transaction: IRTransaction) => {
    localStorage.setItem(LocalStorageKey.transaction, JSON.stringify(transaction));
  };
}

const LocalStorage = new _LocalStorageHelper();
export default LocalStorage;
