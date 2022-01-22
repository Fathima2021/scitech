/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiCall, URLMapper } from '../../utils/api-request.util';
import { EventsEnum } from '../events';

export const fetchPatents = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.caseInfo?.CaseId) {
      const _data = await apiCall(URLMapper.FETCH_PATENTS, { caseId: claims?.caseInfo?.CaseId });
      dispatch({ type: EventsEnum.UPDATE_PATENT, data: _data });
    }
  };
};

export const fetchClaims = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.patentId) {
      const _data = await apiCall(URLMapper.FETCH_CLAIMS, { patentId: claims?.active?.patentId });
      dispatch({ type: EventsEnum.UPDATE_CLAIMS, data: _data });
    }
  };
};

export const fetchClaimsElements = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.claimId) {
      const _data = await apiCall(URLMapper.FETCH_CLAIM_ELEMENTS, { claimId: claims?.active?.claimId });
      dispatch({ type: EventsEnum.UPDATE_CLAIM_ELEMENTS, data: _data });
    }
  };
};

export const fetchParties = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.caseInfo?.CaseId) {
      const _data = await apiCall(URLMapper.FETCH_PARTIES, { caseId: claims?.caseInfo?.CaseId });
      dispatch({ type: EventsEnum.UPDATE_PARTY, data: _data });
    }
  };
};

export const fetchProducts = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.partyId) {
      const _data = await apiCall(URLMapper.FETCH_PRODUCTS, {
        partyId: claims?.active?.partyId,
        patentId: claims?.active?.patentId,
      });
      dispatch({ type: EventsEnum.UPDATE_PRODUCTS, data: _data });
    }
  };
};

export const fetchProductsCategories = (): any => {
  return async (dispatch: any, getState: any) => {
    const { claims } = getState();
    if (claims?.active?.accusedProductId) {
      const _data = await apiCall(URLMapper.FETCH_PRODUCTS_HEAD, {
        productId: claims?.active?.accusedProductId,
      });
      dispatch({ type: EventsEnum.UPDATE_PRODUCTS_CATEGORY, data: _data });
    }
  };
};
