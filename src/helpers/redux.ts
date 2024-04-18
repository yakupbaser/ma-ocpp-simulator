/* eslint-disable default-param-last */
import AppHelper from './app';

export interface IReduxStateABPLoadOptions {
  skip: number;
  take: number;
  requireTotalCount: boolean;
}
export interface IReduxState<T> {
  error: boolean;
  data: T | null;
  isLoading: boolean;
  errorMessage?: string;
  requestObject?: any;
  reduxDataUniqueId?: string;
  reduxCallUniqueId?: string;
  callTime: Date;
  responseTime: Date;
  durationOfCalling: number;
}
export interface IReduxSymbol {
  call: string;
  failure: string;
  success: string;
  clear: string;
}
export default class ReduxHelper {
  public static generateSymbol(rootName: string): IReduxSymbol {
    const call = rootName;
    const clear = `${rootName}_CLEAR`;
    const success = `${rootName}_SUCCESS`;
    const failure = `${rootName}_FAILURE`;
    return {
      call,
      clear,
      success,
      failure,
    };
  }

  public static generateReducer<T>(rootSymbol: IReduxSymbol, data?: T, emptyDataWhenCall = true) {
    const initialState: IReduxState<T> = {
      isLoading: false,
      data: data || null,
      error: false,
      callTime: new Date(),
      responseTime: new Date(),
      durationOfCalling: 0,
    };
    return (state: IReduxState<T> = initialState, action: any): IReduxState<T> => {
      switch (action.type) {
        case rootSymbol.call:
          return {
            ...state,
            requestObject: { ...action },
            isLoading: true,
            error: false,
            data: emptyDataWhenCall ? null : state.data,
            callTime: new Date(),
            reduxCallUniqueId: AppHelper.generateUniqueId(),
          };
        case rootSymbol.failure:
          return {
            ...state,
            error: true,
            isLoading: false,
            data: null,
            errorMessage: action.errorMessage,
            responseTime: new Date(),
          };
        case rootSymbol.success:
          return {
            ...state,
            error: false,
            errorMessage: undefined,
            isLoading: false,
            data: action.data,
            reduxDataUniqueId: AppHelper.generateUniqueId(),
            responseTime: new Date(),
            durationOfCalling: new Date().getTime() - state.callTime.getTime(),
          };
        case rootSymbol.clear:
          return initialState;
        default:
          return state;
      }
    };
  }
}
