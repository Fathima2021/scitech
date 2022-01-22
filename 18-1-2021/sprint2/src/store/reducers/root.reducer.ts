import { combineReducers } from '@reduxjs/toolkit';
import { claimsReducer } from './claims.reducer';
import { uiReducer } from './ui.reducer';

export const rootReducer = combineReducers({
  claims: claimsReducer,
  ui: uiReducer,
});
