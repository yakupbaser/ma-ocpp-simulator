enum OCPPConnectorStatus {
  available = 'Available',
  preparing = 'Preparing',
  charging = 'Charging',
  suspendedEvse = 'SuspendedEvse',
  suspendedEv = 'SuspendedEv',
  finishing = 'Finishing',
  reserved = 'Reserved',
  unavailable = 'Unavailable',
  faulted = 'Faulted',
}

export default OCPPConnectorStatus;
