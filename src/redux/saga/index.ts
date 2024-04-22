import transaction from './transactions';
import settings from './settings';
import startTransaction from './start_transaction';
import connectorStatus from './connector_status';
import logs from './logs';

export default [settings, logs, ...connectorStatus, startTransaction, transaction];
