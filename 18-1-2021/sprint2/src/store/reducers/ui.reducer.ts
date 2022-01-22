/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsEnum } from '../events';

const defaultState = {
  layout: 'list',
};
export const uiReducer = (state = defaultState, payload: any): any => {
  const { type, data } = payload;
  switch (type) {
    case EventsEnum.UPDATE_LAYOUT: {
      return { ...state, layout: data.layout };
    }
    default:
      return state;
  }
};
