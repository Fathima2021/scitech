/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventsEnum } from '../events';
import {
  ICase,
  IClaim,
  IElement,
  IFigure,
  IInfringement,
  IParty,
  IPatent,
  IProduct,
  IProductCategory,
  ISide,
} from '../store.interface';

const defaultState = {
  caseInfo: {} as ICase,
  patents: [] as IPatent[],
  claims: [] as IClaim[],
  elements: [] as IElement[],
  infringments: [] as IInfringement[],
  parties: [] as IParty[],
  products: [] as IProduct[],
  categories: [] as IProduct[],
  figures: [] as IFigure[],
  active: {
    patentId: '',
    claimId: '',
    elementId: '',
    accusedProductId: '',
    partyId: '',
    categoryId: '',
  },
};
export const claimsReducer = (state = defaultState, payload: any): any => {
  const { type, data } = payload;
  switch (type) {
    case EventsEnum.UPDATE_CASE: {
      const _cd = updateCaseData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_PATENT: {
      const _cd = updateCasePatentData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_CLAIMS: {
      const _cd = updateClaimsData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_CLAIM_ELEMENTS: {
      const _cd = updateClaimsElementsData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_EVIDENCE: {
      const _cd = updateEvidenceList({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_PARTY: {
      const _cd = updatePartiesData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_PRODUCTS: {
      const _cd = updateProductsData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_FIGURES: {
      const _cd = updateFiguresData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_PRODUCTS_CATEGORY: {
      const _cd = updateProductCategoryData({ ...state }, data.data);
      return { ...state, ..._cd };
    }
    case EventsEnum.UPDATE_SELECTED_CLAIM: {
      return { ...state, active: { ...state.active, claimId: data?.claimId } };
    }
    case EventsEnum.UPDATE_SELECTED_PRODUCT: {
      return { ...state, infringments: [], active: { ...state.active, accusedProductId: data?.accusedProductId } };
    }
    case EventsEnum.UPDATE_SELECTED_PATENT: {
      localStorage.setItem('activePatent', data?.patentId);
      return { ...state, active: { ...state.active, patentId: data?.patentId } };
    }
    case EventsEnum.UPDATE_SELECTED_ELEMENTS: {
      return { ...state, infringments: [], active: { ...state.active, elementId: data?.elementId } };
    }
    case EventsEnum.UPDATE_SELECTED_PARTY: {
      return { ...state, infringments: [], active: { ...state.active, partyId: data?.partyId } };
    }
    case EventsEnum.UPDATE_SELECTED_CATEGORY: {
      return { ...state, infringments: [], active: { ...state.active, categoryId: data?.categoryId } };
    }
    default:
      return state;
  }
};

const updateCaseData = (state: any, data: ICase) => {
  const _cd: any = state;
  _cd.caseInfo = data;
  return _cd;
};

const updateCasePatentData = (state: any, data: IPatent[]) => {
  const _cd: any = state;
  _cd.patents = [...(data as IPatent[])];
  const _first = (data as IPatent[])[0];
  if (_first) {
    _cd.active = {
      ...state.active,
      patentId: _first.PatentId,
    };
  }
  return _cd;
};

const updateClaimsData = (state: any, data: IClaim[]) => {
  const _cd: any = state;
  _cd.claims = [...(data as IClaim[])];
  _cd.active = { ...state.active, claimId: (data as IClaim[])[0].ClaimId };
  return _cd;
};

const updateFiguresData = (state: any, data: IFigure[]) => {
  const _cd: any = state;
  _cd.figures = [...(data as IFigure[])];
  return _cd;
};

const updateClaimsElementsData = (state: any, data: IClaim) => {
  const _cd: any = state;
  _cd.elements = [...(data.Elements as IElement[])];
  _cd.active = { ...state.active, elementId: (data.Elements as IElement[])[0].ElementId };
  return _cd;
};

const updatePartiesData = (state: any, data: ISide[]) => {
  const _cd: any = state;
  _cd.parties = [...(data as ISide[])];
  const filtered = data.find((el) => !el.isCounterSide);
  _cd.active = { ...state.active, partyId: filtered?.Party?.Id };
  return _cd;
};

const updateProductsData = (state: any, data: IProduct[]) => {
  const _cd: any = state;
  _cd.products = [...(data as IProduct[])];
  _cd.active = { ...state.active, accusedProductId: ((data as IProduct[]) || [])[0]?.AccusedProductId };
  return _cd;
};

const updateProductCategoryData = (state: any, data: IProductCategory[]) => {
  const _cd: any = state;
  _cd.categories = [...(data as IProductCategory[])];
  _cd.active = { ...state.active, categoryId: ((data as IProductCategory[]) || [])[0]?.ProductSubHeadId };
  return _cd;
};

const updateEvidenceList = (state: any, data: IInfringement[]) => {
  const _cd: any = state;
  _cd.infringments = data;
  return _cd;
};
