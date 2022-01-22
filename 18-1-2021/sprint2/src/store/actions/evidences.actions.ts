import { apiCall, URLMapper } from '../../utils/api-request.util';
import { EventsEnum } from '../events';

export const fetchEvidences = (params: any): any => {
  return async (dispatch: any, getState: any) => {
    console.log('Hererere Too');
    const { claims } = getState();
    if (claims?.active?.patentId) {
      const _data = await apiCall(URLMapper.FETCH_EVIDENCES, {
        accusedProductId: claims?.active?.accusedProductId,
        elementId: claims?.active?.elementId,
        evidenceHeadId: params.categoryId || claims?.active?.categoryId,
        type: params.type,
      });
      dispatch({ type: EventsEnum.UPDATE_EVIDENCE, data: _data });
    }
  };
};

export const deleteEvidence = (data: any): any => {
  return async (dispatch: any, getState: any) => {
    if (data.type === 'INFRINGMENTS') {
      await apiCall(URLMapper.DELETE_INFRINGMENTS + data.id, {}, 'DELETE');
    }
    dispatch(fetchEvidences({ type: 'INFRINGMENTS' }));
  };
};
