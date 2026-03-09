export type StepOneFormData = {
  agencyName: string;
  dba: string;
  ein: string;
  npn: string;
  agencyPhone: string;
  agencyEmail: string;
  agencyWebsite: string;
  w9File: File | null;
  physicalAddress1: string;
  physicalAddress2: string;
  physicalCity: string;
  physicalState: string;
  physicalZip: string;
  mailingAddress1: string;
  mailingAddress2: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
};

export type StepOneStoredDraft = Omit<StepOneFormData, "w9File"> & {
  w9FileName: string;
};

export type StepTwoFormData = {
  retailerPercent: string;
  wholesalePercent: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerLicenseNumber: string;
  ownerAddress1: string;
  ownerAddress2: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
  ownerCellPhone: string;
  ownerEmail: string;
  eoInsuranceCompanyName: string;
  eoPolicyNumber: string;
  eoPolicyLimits: string;
  eoDeductible: string;
  eoEffectiveDate: string;
  eoExpirationDate: string;
  eoDeclarationFile: File | null;
  licensedAgentsCount: string;
  unlicensedRepresentativesCount: string;
};

export type StepTwoStoredDraft = Omit<StepTwoFormData, "eoDeclarationFile"> & {
  eoDeclarationFileName: string;
};

export type StateLicenseEntry = {
  id: string;
  licenseNumber: string;
  state: string;
  dateIssued: string;
  licenseFile: File | null;
};

export type StepThreeFormData = {
  stateLicenses: StateLicenseEntry[];
  yearsExperienceCommercialAuto: string;
  executiveFirstYearPropertyCasualtyLicensed: string;
  currentCommercialAutoBookOfBusiness: string;
  totalPropertyCasualtyBookPremium: string;
  languagesSpoken: string;
};

export type StateLicenseStoredEntry = Omit<StateLicenseEntry, "licenseFile"> & {
  licenseFileName: string;
};

export type StepThreeStoredDraft = Omit<StepThreeFormData, "stateLicenses"> & {
  stateLicenses: StateLicenseStoredEntry[];
};

export type CarrierEntry = {
  id: string;
  companyName: string;
  lossRatioPercent: string;
  premium: string;
};

export type YesNoAnswer = "yes" | "no" | "";

export type StepFourFormData = {
  isPartOfAllianceClusterAggregator: YesNoAnswer;
  allianceDetails: string;
  topCarriers: CarrierEntry[];
  productionLossReportFile: File | null;
  licenseRevokedAnswer: YesNoAnswer;
  licenseRevokedExplanation: string;
  convictedAnswer: YesNoAnswer;
  convictedExplanation: string;
  pendingChargesAnswer: YesNoAnswer;
  pendingChargesExplanation: string;
  appointmentRevokedAnswer: YesNoAnswer;
  appointmentRevokedExplanation: string;
  hearAboutUs: string;
};

export type CarrierStoredEntry = CarrierEntry;

export type StepFourStoredDraft = Omit<StepFourFormData, "productionLossReportFile"> & {
  topCarriers: CarrierStoredEntry[];
  productionLossReportFileName: string;
};
