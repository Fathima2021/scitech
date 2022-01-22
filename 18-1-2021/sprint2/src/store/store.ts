/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { loggerMiddleware, monitorReducerEnhancer } from './middleware';
import { rootReducer } from './reducers/root.reducer';

export default function configureStore(): any {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer, monitorReducerEnhancer];
  const composedEnhancers: any = compose(...enhancers);
  const store = createStore(rootReducer, composedEnhancers);
  return store;
}
