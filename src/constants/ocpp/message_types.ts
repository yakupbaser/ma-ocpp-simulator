enum OCPPMessageType {
  callMessage = 2, // Call the method with request id
  callResultMessage = 3, // Response of called method if success with request id
  callErrorMessage = 4, // Error of called method if denied with request id
}

export default OCPPMessageType;
