/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
export const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  // console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const round = (number: number) => Math.round(number * 100) / 100;

export const monitorReducerEnhancer = (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
  const monitoredReducer = (state: any, action: any) => {
    const start = performance.now();
    const newState = reducer(state, action);
    const end = performance.now();
    const diff = round(end - start);
    console.log('reducer process time:', diff);
    return newState;
  };
  return createStore(monitoredReducer, initialState, enhancer);
};
