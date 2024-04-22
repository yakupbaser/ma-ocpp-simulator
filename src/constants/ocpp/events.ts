enum OCPPEvent {
  bootNotification = 'BootNotification',
  authorize = 'Authorize',
  statusNotification = 'StatusNotification',
  unlockConnector = 'UnlockConnector',
  heartbeat = 'Heartbeat',
  meterValues = 'MeterValues',
  remoteStartTransaction = 'RemoteStartTransaction',
  remoteStopTransaction = 'RemoteStopTransaction',
  startTransaction = 'StartTransaction',
  stopTransaction = 'StopTransaction',
  changeAvailability = 'ChangeAvailability',
  changeConfiguration = 'ChangeConfiguration',
  getConfiguration = 'GetConfiguration',
}

export default OCPPEvent;
