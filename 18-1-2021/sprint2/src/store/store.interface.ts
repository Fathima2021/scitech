export interface ReduxStore {
  caseInfo: ICase;
  patents: IPatent[];
  claims: IClaim[];
  evidences: IEvidence;
  parties: IParty[];
  elements: IElement[];
  filters: {
    patentId: number;
    claimId: number;
    elementId: number;
    partyId: number;
    accussedProductId: number;
  };
}

export interface IProduct {
  AccusedProductId?: number;
  ProductName?: string;
  ParentId?: number;
  CaseId?: number;
  PatentId?: number;
  PartyId?: number;
}

export interface IPatentAccusedProduct {
  AccusedProductId: number;
  PatentId: number;
  Product: IProduct;
}

export interface IProductCategory {
  ProductSubHeadId: number;
  SectionName: string;
  AccusedProductId: number;
}

export interface IPatent {
  PatentId: number;
  CaseId: number;
  PatentNumber: string;
  PatentPDFId: number;
  TutorialId: number;
  AbstractText?: any;
  Summary?: any;
  Inventor: string;
  Issued: string;
  Filed: string;
  Assignee: string;
  Comments: string;
  Title: string;
  SummaryDate?: any;
  Abstract: string;
  IsPriorArt: boolean;
  InPreparation: boolean;
  PatentAccusedProducts?: IPatentAccusedProduct[];
  Claims?: IClaim[];
}

export interface ICase {
  CaseId: number;
  CaseName: string;
  Judge: string;
  CaseDescription: string;
  Duration: number;
  InceptionMonth: number;
  InceptionYear: number;
  District: string;
  CaseFile: string;
  Passcode: string;
  Ism: boolean;
  Isf: boolean;
  Patents?: IPatent[];
}

export interface ITerm {
  TermId: number;
  CaseId: number;
  TermText: string;
  Active: boolean;
}

export interface IClaimTerm {
  ClaimTermId: number;
  TermId: number;
  ClaimId: number;
  Term: ITerm;
}

export interface IElement {
  ElementId: number;
  ClaimId: number;
  ElementText: string;
  PlaintiffFigureId?: any;
  DefendantFigureId: number;
  InvaliditySummary?: any;
  InfringementSummary?: any;
  ElementOrder: number;
  InvaliditySummaryRecorded?: any;
  InfringementSummaryRecorded?: any;
  ElementHeading: string;
  idx: number;
}

export interface IClaim {
  ClaimId: number;
  Asserted: boolean;
  PatentId: number;
  ClaimOrder: number;
  DependsOnId: number;
  ClaimText: string;
  ClaimTerms: IClaimTerm[];
  Elements: IElement[];
}

export interface IEvidence {
  EvidenceId: number;
  Heading: string;
  EvidenceOrder?: any;
  EvidenceReference: string;
  EvidenceLibraryId?: number;
  Evidence: string;
  PinCite: boolean;
  PartyId: number;
  IsRedacted: boolean;
}

export interface IInfringement {
  InfringementId: number;
  ElementId: number;
  AccusedProductId: number;
  EvidenceId: number;
  EvidenceOrder: number;
  Evidence: IEvidence;
}

export interface IParty {
  Id?: number;
  SideId?: number;
  ShortName?: string;
  Name?: string;
  IsHighlighted?: boolean;
  IsPrimary?: boolean;
}

export interface ISide {
  id?: number;
  CaseId?: number;
  Side?: string;
  isClientSide?: boolean;
  isCounterSide?: boolean;
  Party?: IParty;
}

export interface IFigure {
  FigureId?: number;
  PatentId?: number;
  FigureText?: string;
  Figure?: string;
  Selected?: boolean;
  UserModified?: boolean;
  FigureHeading?: string;
  Path?: string;
}
