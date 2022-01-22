import { apiCall, URLMapper } from '../../utils/api-request.util';
import { EventsEnum } from '../events';
import { fetchProductsCategories } from './claims.actions';
import { fetchEvidences } from './evidences.actions';

export const fetchCaseDetails = (caseId: number): any => {
  return async (dispatch: any, getState: any) => {
    const _data = await apiCall(URLMapper.FETCH_CASES, { caseId });
    dispatch({ type: EventsEnum.UPDATE_CASE, data: _data });
  };
};

export const fetchFigures = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.patentId) {
      const _data = await apiCall(URLMapper.FETCH_FIGURES, { patentId: claims?.active?.patentId });
      dispatch({ type: EventsEnum.UPDATE_FIGURES, data: _data });
    }
  };
};

export const createCategory = (sectionName: string): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.accusedProductId) {
      const _data = await apiCall(
        URLMapper.CREATE_PRODUCTS_HEAD,
        {
          productId: claims?.active?.accusedProductId,
          sectionName,
        },
        'POST',
      );
      dispatch(fetchProductsCategories());
    }
  };
};

export const createEvidence = (body: any): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    const fdata = new FormData();
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const element = body[key];
        if (key === 'figures') {
          for (const iterator of element) {
            fdata.append(key, iterator, iterator.name);
          }
        } else {
          fdata.append(key, element);
        }
      }
    }
    fdata.append('elementId', claims.active.elementId);
    fdata.append('productId', claims.active.accusedProductId);
    fdata.append('subHeadId', claims.active.categoryId);
    fdata.append('order', (claims.infringments || []).length + 1);
    const _data = await apiCall(URLMapper.CREATE_EVIDENCE, fdata, 'POST', 'multipart/form-data');
    console.log('Hererere');
    dispatch(fetchEvidences({ type: body.type }));
  };
};
