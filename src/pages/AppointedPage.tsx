
import { FormEvent, useState } from "react";
import { appointmentRepository } from "../services/appointmentRepository";
import type { CarrierEntry, StateLicenseEntry, StepFourFormData, StepOneFormData, StepThreeFormData, StepTwoFormData, YesNoAnswer } from "../types/appointment";

const sectionTitles = ["1. Company Information", "2. Policy Information", "3. State Licensed", "4. Additional", "5. Finish"] as const;
const hearAboutUsOptions = ["Search Engine", "Referral", "Social Media", "Industry Event", "Current Carrier", "Other"] as const;
const stateOptions = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"] as const;

const createStateLicenseEntry = (): StateLicenseEntry => ({ id: crypto.randomUUID(), licenseNumber: "", state: "", dateIssued: "", licenseFile: null });
const createCarrierEntry = (): CarrierEntry => ({ id: crypto.randomUUID(), companyName: "", lossRatioPercent: "", premium: "" });

const initialStepOneData: StepOneFormData = { agencyName: "", dba: "", ein: "", npn: "", agencyPhone: "", agencyEmail: "", agencyWebsite: "", w9File: null, physicalAddress1: "", physicalAddress2: "", physicalCity: "", physicalState: "", physicalZip: "", mailingAddress1: "", mailingAddress2: "", mailingCity: "", mailingState: "", mailingZip: "" };
const initialStepTwoData: StepTwoFormData = { retailerPercent: "", wholesalePercent: "", ownerFirstName: "", ownerLastName: "", ownerLicenseNumber: "", ownerAddress1: "", ownerAddress2: "", ownerCity: "", ownerState: "", ownerZip: "", ownerCellPhone: "", ownerEmail: "", eoInsuranceCompanyName: "", eoPolicyNumber: "", eoPolicyLimits: "", eoDeductible: "", eoEffectiveDate: "", eoExpirationDate: "", eoDeclarationFile: null, licensedAgentsCount: "", unlicensedRepresentativesCount: "" };
const initialStepThreeData: StepThreeFormData = { stateLicenses: [createStateLicenseEntry()], yearsExperienceCommercialAuto: "", executiveFirstYearPropertyCasualtyLicensed: "", currentCommercialAutoBookOfBusiness: "", totalPropertyCasualtyBookPremium: "", languagesSpoken: "" };
const initialStepFourData: StepFourFormData = { isPartOfAllianceClusterAggregator: "", allianceDetails: "", topCarriers: [createCarrierEntry(), createCarrierEntry()], productionLossReportFile: null, licenseRevokedAnswer: "", licenseRevokedExplanation: "", convictedAnswer: "", convictedExplanation: "", pendingChargesAnswer: "", pendingChargesExplanation: "", appointmentRevokedAnswer: "", appointmentRevokedExplanation: "", hearAboutUs: "" };
type StepFiveFormData = { requestorFirstName: string; requestorLastName: string; requestorEmail: string; requestorEmailRepeat: string; requestorPhone: string; requestorPhoneExt: string; authorizedToSign: boolean; };
const initialStepFiveData: StepFiveFormData = { requestorFirstName: "", requestorLastName: "", requestorEmail: "", requestorEmailRepeat: "", requestorPhone: "", requestorPhoneExt: "", authorizedToSign: false };

export default function AppointedPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepOneData, setStepOneData] = useState<StepOneFormData>(initialStepOneData);
  const [stepTwoData, setStepTwoData] = useState<StepTwoFormData>(initialStepTwoData);
  const [stepThreeData, setStepThreeData] = useState<StepThreeFormData>(initialStepThreeData);
  const [stepFourData, setStepFourData] = useState<StepFourFormData>(initialStepFourData);
  const [stepFiveData, setStepFiveData] = useState<StepFiveFormData>(initialStepFiveData);
  const [stepOneComplete, setStepOneComplete] = useState(false);
  const [stepTwoComplete, setStepTwoComplete] = useState(false);
  const [stepThreeComplete, setStepThreeComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");

  const goToNextStepDev = (): void => { setSaveNotice(""); if (currentStep >= 0) setStepOneComplete(true); if (currentStep >= 1) setStepTwoComplete(true); if (currentStep >= 2) setStepThreeComplete(true); setCurrentStep((current) => Math.min(sectionTitles.length - 1, current + 1)); };

  const handleStepOneSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!stepOneData.w9File) { setSaveNotice("Please upload a completed W-9 form before continuing."); return; }
    setIsSaving(true); setSaveNotice("");
    try { await appointmentRepository.saveStepOneDraft(stepOneData); setStepOneComplete(true); setCurrentStep(1); }
    finally { setIsSaving(false); }
  };

  const handleStepTwoSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!stepOneComplete) { setSaveNotice("Complete company information first."); setCurrentStep(0); return; }
    const retailer = Number(stepTwoData.retailerPercent); const wholesale = Number(stepTwoData.wholesalePercent);
    if (!Number.isFinite(retailer) || !Number.isFinite(wholesale) || retailer + wholesale !== 100) { setSaveNotice("Retailer % and Wholesale % must add up to exactly 100%."); return; }
    if (!stepTwoData.eoDeclarationFile) { setSaveNotice("Please upload an E&O declaration page before continuing."); return; }
    setIsSaving(true); setSaveNotice("");
    try { await appointmentRepository.saveStepTwoDraft(stepTwoData); setStepTwoComplete(true); setCurrentStep(2); }
    finally { setIsSaving(false); }
  };

  const addStateLicense = (): void => setStepThreeData((current) => ({ ...current, stateLicenses: [...current.stateLicenses, createStateLicenseEntry()] }));
  const updateStateLicense = (id: string, key: "licenseNumber" | "state" | "dateIssued" | "licenseFile", value: string | File | null): void => setStepThreeData((current) => ({ ...current, stateLicenses: current.stateLicenses.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)) }));
  const removeStateLicense = (id: string): void => setStepThreeData((current) => current.stateLicenses.length === 1 ? current : ({ ...current, stateLicenses: current.stateLicenses.filter((entry) => entry.id !== id) }));

  const handleStepThreeSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!stepTwoComplete) { setSaveNotice("Complete policy information before continuing to state licensed."); setCurrentStep(1); return; }
    const hasInvalidLicenseRow = stepThreeData.stateLicenses.some((entry) => !entry.licenseNumber.trim() || !entry.state || !entry.dateIssued || entry.licenseFile === null);
    if (hasInvalidLicenseRow) { setSaveNotice("Each state licensed row requires license number, state, date issued, and license file."); return; }
    setIsSaving(true); setSaveNotice("");
    try { await appointmentRepository.saveStepThreeDraft(stepThreeData); setStepThreeComplete(true); setCurrentStep(3); }
    finally { setIsSaving(false); }
  };

  const addCarrier = (): void => setStepFourData((current) => ({ ...current, topCarriers: [...current.topCarriers, createCarrierEntry()] }));
  const updateCarrier = (id: string, key: "companyName" | "lossRatioPercent" | "premium", value: string): void => setStepFourData((current) => ({ ...current, topCarriers: current.topCarriers.map((carrier) => (carrier.id === id ? { ...carrier, [key]: value } : carrier)) }));
  const removeCarrier = (id: string): void => setStepFourData((current) => current.topCarriers.length <= 2 ? current : ({ ...current, topCarriers: current.topCarriers.filter((carrier) => carrier.id !== id) }));
  const updateYesNoAnswer = (key: "isPartOfAllianceClusterAggregator" | "licenseRevokedAnswer" | "convictedAnswer" | "pendingChargesAnswer" | "appointmentRevokedAnswer", value: YesNoAnswer): void => setStepFourData((current) => ({ ...current, [key]: value }));

  const handleStepFourSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!stepThreeComplete) { setSaveNotice("Complete state licensed information first."); setCurrentStep(2); return; }
    if (!stepFourData.isPartOfAllianceClusterAggregator) { setSaveNotice("Please answer the alliance, cluster, or aggregator question."); return; }
    if (stepFourData.isPartOfAllianceClusterAggregator === "yes" && !stepFourData.allianceDetails.trim()) { setSaveNotice("Please tell us more about your alliance, cluster, or aggregator."); return; }
    if (stepFourData.topCarriers.length < 2) { setSaveNotice("Please provide at least 2 carriers."); return; }
    const hasInvalidCarrier = stepFourData.topCarriers.some((carrier) => !carrier.companyName.trim() || !carrier.lossRatioPercent.trim() || !carrier.premium.trim());
    if (hasInvalidCarrier) { setSaveNotice("Each carrier must include company name, loss ratio, and premium."); return; }
    if (!stepFourData.productionLossReportFile) { setSaveNotice("Please upload current full year Agency Production and Loss Ratio Reports."); return; }
    const yesNoChecks: Array<{ answer: YesNoAnswer; explanation: string }> = [ { answer: stepFourData.licenseRevokedAnswer, explanation: stepFourData.licenseRevokedExplanation }, { answer: stepFourData.convictedAnswer, explanation: stepFourData.convictedExplanation }, { answer: stepFourData.pendingChargesAnswer, explanation: stepFourData.pendingChargesExplanation }, { answer: stepFourData.appointmentRevokedAnswer, explanation: stepFourData.appointmentRevokedExplanation } ];
    if (yesNoChecks.some((item) => item.answer === "")) { setSaveNotice("Please answer all Yes/No compliance questions."); return; }
    if (yesNoChecks.some((item) => item.answer === "yes" && !item.explanation.trim())) { setSaveNotice("Explanation is required when you answer Yes."); return; }
    if (!stepFourData.hearAboutUs) { setSaveNotice("Please select how you heard about us."); return; }
    setIsSaving(true); setSaveNotice("");
    try { await appointmentRepository.saveStepFourDraft(stepFourData); setCurrentStep(4); }
    finally { setIsSaving(false); }
  };

  const handleStepFiveSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (stepFiveData.requestorEmail !== stepFiveData.requestorEmailRepeat) { setSaveNotice("Requestor Email and Requestor Email Repeat must match."); return; }
    if (!stepFiveData.authorizedToSign) { setSaveNotice("You must confirm Authorized to sign."); return; }
    setSaveNotice("Application submitted.");
  };

  return (
    <main className="page-shell">
      <section className="title-block"><p className="eyebrow">Appointment Application</p><h1>Get Appointed</h1><p className="tagline">Complete all five sections to submit your agency onboarding request.</p></section>
      <section className="panel appointed-panel">
        <ol className="stepper">{sectionTitles.map((title, index) => <li key={title} className={`step-item ${index === currentStep ? "active" : ""} ${index < currentStep ? "done" : ""}`}>{title}</li>)}</ol>
        {currentStep === 0 ? (
          <form className="appointment-form" onSubmit={handleStepOneSubmit}>
            <h2>Section 1: Company Information</h2>
            <div className="form-grid two-col">
              <label>Agency Name <span className="required-marker">*</span><input type="text" required value={stepOneData.agencyName} onChange={(event) => setStepOneData({ ...stepOneData, agencyName: event.target.value })} /></label>
              <label>DBA<input type="text" value={stepOneData.dba} onChange={(event) => setStepOneData({ ...stepOneData, dba: event.target.value })} /></label>
              <label>EIN <span className="required-marker">*</span><input type="text" required value={stepOneData.ein} onChange={(event) => setStepOneData({ ...stepOneData, ein: event.target.value })} /></label>
              <label>NPN <span className="required-marker">*</span><input type="text" required value={stepOneData.npn} onChange={(event) => setStepOneData({ ...stepOneData, npn: event.target.value })} /></label>
              <label>Agency Phone Number <span className="required-marker">*</span><input type="tel" required value={stepOneData.agencyPhone} onChange={(event) => setStepOneData({ ...stepOneData, agencyPhone: event.target.value })} /></label>
              <label>Agency Email Address <span className="required-marker">*</span><input type="email" required value={stepOneData.agencyEmail} onChange={(event) => setStepOneData({ ...stepOneData, agencyEmail: event.target.value })} /></label>
              <label>Agency Website <span className="required-marker">*</span><input type="url" required value={stepOneData.agencyWebsite} onChange={(event) => setStepOneData({ ...stepOneData, agencyWebsite: event.target.value })} /></label>
              <label>Submit Completed W-9 Form <span className="required-marker">*</span><input type="file" required accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(event) => setStepOneData({ ...stepOneData, w9File: event.target.files?.[0] ?? null })} /></label>
            </div>
            <h3>Agency Physical Address</h3>
            <div className="form-grid two-col">
              <label>Street Address 1 <span className="required-marker">*</span><input type="text" required value={stepOneData.physicalAddress1} onChange={(event) => setStepOneData({ ...stepOneData, physicalAddress1: event.target.value })} /></label>
              <label>Street Address 2<input type="text" value={stepOneData.physicalAddress2} onChange={(event) => setStepOneData({ ...stepOneData, physicalAddress2: event.target.value })} /></label>
              <label>City <span className="required-marker">*</span><input type="text" required value={stepOneData.physicalCity} onChange={(event) => setStepOneData({ ...stepOneData, physicalCity: event.target.value })} /></label>
              <label>State <span className="required-marker">*</span><select required value={stepOneData.physicalState} onChange={(event) => setStepOneData({ ...stepOneData, physicalState: event.target.value })}><option value="">Select State</option>{stateOptions.map((stateCode) => <option key={`physical-${stateCode}`} value={stateCode}>{stateCode}</option>)}</select></label>
              <label>ZIP <span className="required-marker">*</span><input type="text" required value={stepOneData.physicalZip} onChange={(event) => setStepOneData({ ...stepOneData, physicalZip: event.target.value })} /></label>
            </div>
            <h3>Agency Mailing Address</h3>
            <div className="form-grid two-col">
              <label>Street Address 1 <span className="required-marker">*</span><input type="text" required value={stepOneData.mailingAddress1} onChange={(event) => setStepOneData({ ...stepOneData, mailingAddress1: event.target.value })} /></label>
              <label>Street Address 2<input type="text" value={stepOneData.mailingAddress2} onChange={(event) => setStepOneData({ ...stepOneData, mailingAddress2: event.target.value })} /></label>
              <label>City <span className="required-marker">*</span><input type="text" required value={stepOneData.mailingCity} onChange={(event) => setStepOneData({ ...stepOneData, mailingCity: event.target.value })} /></label>
              <label>State <span className="required-marker">*</span><select required value={stepOneData.mailingState} onChange={(event) => setStepOneData({ ...stepOneData, mailingState: event.target.value })}><option value="">Select State</option>{stateOptions.map((stateCode) => <option key={`mailing-${stateCode}`} value={stateCode}>{stateCode}</option>)}</select></label>
              <label>ZIP <span className="required-marker">*</span><input type="text" required value={stepOneData.mailingZip} onChange={(event) => setStepOneData({ ...stepOneData, mailingZip: event.target.value })} /></label>
            </div>
            {saveNotice ? <p className="save-notice">{saveNotice}</p> : null}
            <div className="form-actions"><button type="button" className="dev-button" onClick={goToNextStepDev}>Dev: Next</button><button type="submit" className="cta" disabled={isSaving}>{isSaving ? "Saving..." : "Next"}</button></div>
          </form>
        ) : null}

        {currentStep === 1 ? (
          <form className="appointment-form" onSubmit={handleStepTwoSubmit}>
            <h2>Section 2: Policy Information</h2>
            <div className="form-grid two-col">
              <label>Retailer % <span className="required-marker">*</span><input type="number" required min={0} max={100} step="0.01" value={stepTwoData.retailerPercent} onChange={(event) => setStepTwoData({ ...stepTwoData, retailerPercent: event.target.value })} /></label>
              <label>Wholesale % <span className="required-marker">*</span><input type="number" required min={0} max={100} step="0.01" value={stepTwoData.wholesalePercent} onChange={(event) => setStepTwoData({ ...stepTwoData, wholesalePercent: event.target.value })} /></label>
              <label>Owner First Name <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerFirstName} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerFirstName: event.target.value })} /></label>
              <label>Owner Last Name <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerLastName} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerLastName: event.target.value })} /></label>
              <label>Owner License Number <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerLicenseNumber} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerLicenseNumber: event.target.value })} /></label>
            </div>
            <h3>Owner Address</h3>
            <div className="form-grid two-col">
              <label>Street Address 1 <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerAddress1} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerAddress1: event.target.value })} /></label>
              <label>Street Address 2<input type="text" value={stepTwoData.ownerAddress2} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerAddress2: event.target.value })} /></label>
              <label>City <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerCity} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerCity: event.target.value })} /></label>
              <label>State <span className="required-marker">*</span><select required value={stepTwoData.ownerState} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerState: event.target.value })}><option value="">Select State</option>{stateOptions.map((stateCode) => <option key={`owner-${stateCode}`} value={stateCode}>{stateCode}</option>)}</select></label>
              <label>ZIP <span className="required-marker">*</span><input type="text" required value={stepTwoData.ownerZip} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerZip: event.target.value })} /></label>
              <label>Owner Cell Phone <span className="required-marker">*</span><input type="tel" required value={stepTwoData.ownerCellPhone} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerCellPhone: event.target.value })} /></label>
              <label>Owner Email <span className="required-marker">*</span><input type="email" required value={stepTwoData.ownerEmail} onChange={(event) => setStepTwoData({ ...stepTwoData, ownerEmail: event.target.value })} /></label>
            </div>
            <h3>E&amp;O Policy Information</h3>
            <div className="form-grid two-col">
              <label>Insurance Company Name <span className="required-marker">*</span><input type="text" required value={stepTwoData.eoInsuranceCompanyName} onChange={(event) => setStepTwoData({ ...stepTwoData, eoInsuranceCompanyName: event.target.value })} /></label>
              <label>Policy # <span className="required-marker">*</span><input type="text" required value={stepTwoData.eoPolicyNumber} onChange={(event) => setStepTwoData({ ...stepTwoData, eoPolicyNumber: event.target.value })} /></label>
              <label>Policy Limits <span className="required-marker">*</span><input type="text" required value={stepTwoData.eoPolicyLimits} onChange={(event) => setStepTwoData({ ...stepTwoData, eoPolicyLimits: event.target.value })} /></label>
              <label>Deductible <span className="required-marker">*</span><input type="text" required value={stepTwoData.eoDeductible} onChange={(event) => setStepTwoData({ ...stepTwoData, eoDeductible: event.target.value })} /></label>
              <label>Effective Date <span className="required-marker">*</span><input type="date" required value={stepTwoData.eoEffectiveDate} onChange={(event) => setStepTwoData({ ...stepTwoData, eoEffectiveDate: event.target.value })} /></label>
              <label>Expiration Date <span className="required-marker">*</span><input type="date" required value={stepTwoData.eoExpirationDate} onChange={(event) => setStepTwoData({ ...stepTwoData, eoExpirationDate: event.target.value })} /></label>
              <label>Upload Declaration Page <span className="required-marker">*</span><input type="file" required accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(event) => setStepTwoData({ ...stepTwoData, eoDeclarationFile: event.target.files?.[0] ?? null })} /></label>
              <label>Number of Licensed Agents <span className="required-marker">*</span><input type="number" min={0} required value={stepTwoData.licensedAgentsCount} onChange={(event) => setStepTwoData({ ...stepTwoData, licensedAgentsCount: event.target.value })} /></label>
              <label>Number of Unlicensed Representatives <span className="required-marker">*</span><input type="number" min={0} required value={stepTwoData.unlicensedRepresentativesCount} onChange={(event) => setStepTwoData({ ...stepTwoData, unlicensedRepresentativesCount: event.target.value })} /></label>
            </div>
            {saveNotice ? <p className="save-notice">{saveNotice}</p> : null}
            <div className="form-actions"><button type="button" className="dev-button" onClick={goToNextStepDev}>Dev: Next</button><button type="button" className="secondary" onClick={() => setCurrentStep(0)}>Previous</button><button type="submit" className="cta" disabled={isSaving}>{isSaving ? "Saving..." : "Next"}</button></div>
          </form>
        ) : null}
        {currentStep === 2 ? (
          <form className="appointment-form" onSubmit={handleStepThreeSubmit}>
            <h2>Section 3: State Licensed</h2>
            {stepThreeData.stateLicenses.map((license, index) => (
              <div key={license.id} className="license-card">
                <h3>State License {index + 1}</h3>
                <div className="form-grid two-col">
                  <label>License Number <span className="required-marker">*</span><input type="text" required value={license.licenseNumber} onChange={(event) => updateStateLicense(license.id, "licenseNumber", event.target.value)} /></label>
                  <label>State <span className="required-marker">*</span><select required value={license.state} onChange={(event) => updateStateLicense(license.id, "state", event.target.value)}><option value="">Select State</option>{stateOptions.map((stateCode) => <option key={`license-${license.id}-${stateCode}`} value={stateCode}>{stateCode}</option>)}</select></label>
                  <label>Date Issued <span className="required-marker">*</span><input type="date" required value={license.dateIssued} onChange={(event) => updateStateLicense(license.id, "dateIssued", event.target.value)} /></label>
                  <label>Upload License <span className="required-marker">*</span><input type="file" required accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(event) => updateStateLicense(license.id, "licenseFile", event.target.files?.[0] ?? null)} /></label>
                </div>
                {stepThreeData.stateLicenses.length > 1 ? <button type="button" className="secondary remove-license" onClick={() => removeStateLicense(license.id)}>Remove This State License</button> : null}
              </div>
            ))}
            <button type="button" className="secondary add-license" onClick={addStateLicense}>Add Another State Licensed</button>
            <div className="form-grid two-col top-gap">
              <label>Years of Experience Insuring Commercial Auto <span className="required-marker">*</span><input type="number" min={0} required value={stepThreeData.yearsExperienceCommercialAuto} onChange={(event) => setStepThreeData({ ...stepThreeData, yearsExperienceCommercialAuto: event.target.value })} /></label>
              <label>Executive's First Year Property and Casualty Licensed <span className="required-marker">*</span><input type="number" min={1900} max={2100} required value={stepThreeData.executiveFirstYearPropertyCasualtyLicensed} onChange={(event) => setStepThreeData({ ...stepThreeData, executiveFirstYearPropertyCasualtyLicensed: event.target.value })} /></label>
              <label>Current Commercial Auto Book of Business <span className="required-marker">*</span><input type="text" required value={stepThreeData.currentCommercialAutoBookOfBusiness} onChange={(event) => setStepThreeData({ ...stepThreeData, currentCommercialAutoBookOfBusiness: event.target.value })} /></label>
              <label>Total Property Casualty Book Premium <span className="required-marker">*</span><input type="text" required value={stepThreeData.totalPropertyCasualtyBookPremium} onChange={(event) => setStepThreeData({ ...stepThreeData, totalPropertyCasualtyBookPremium: event.target.value })} /></label>
              <label>Languages Spoken <span className="required-marker">*</span><input type="text" required value={stepThreeData.languagesSpoken} onChange={(event) => setStepThreeData({ ...stepThreeData, languagesSpoken: event.target.value })} /></label>
            </div>
            {saveNotice ? <p className="save-notice">{saveNotice}</p> : null}
            <div className="form-actions"><button type="button" className="dev-button" onClick={goToNextStepDev}>Dev: Next</button><button type="button" className="secondary" onClick={() => setCurrentStep(1)}>Previous</button><button type="submit" className="cta" disabled={isSaving}>{isSaving ? "Saving..." : "Next"}</button></div>
          </form>
        ) : null}

        {currentStep === 3 ? (
          <form className="appointment-form" onSubmit={handleStepFourSubmit}>
            <h2>Section 4: Additional</h2>
            <label>Is the Agency part of an Alliance, a Cluster, or an Aggregator? <span className="required-marker">*</span>
              <div className="choice-row">
                <label className="inline-choice"><input type="radio" name="alliance" checked={stepFourData.isPartOfAllianceClusterAggregator === "yes"} onChange={() => updateYesNoAnswer("isPartOfAllianceClusterAggregator", "yes")} />Yes</label>
                <label className="inline-choice"><input type="radio" name="alliance" checked={stepFourData.isPartOfAllianceClusterAggregator === "no"} onChange={() => updateYesNoAnswer("isPartOfAllianceClusterAggregator", "no")} />No</label>
              </div>
            </label>
            {stepFourData.isPartOfAllianceClusterAggregator === "yes" ? <label>Please tell us more <span className="required-marker">*</span><textarea required value={stepFourData.allianceDetails} onChange={(event) => setStepFourData({ ...stepFourData, allianceDetails: event.target.value })} /></label> : null}

            <h3>Top 5 Carriers for Commercial Auto</h3>
            {stepFourData.topCarriers.map((carrier, index) => (
              <div key={carrier.id} className="license-card">
                <h3>Carrier {index + 1}</h3>
                <div className="form-grid three-col">
                  <label>Company Name <span className="required-marker">*</span><input type="text" required value={carrier.companyName} onChange={(event) => updateCarrier(carrier.id, "companyName", event.target.value)} /></label>
                  <label>Loss Ratio, % <span className="required-marker">*</span><input type="number" step="0.01" required value={carrier.lossRatioPercent} onChange={(event) => updateCarrier(carrier.id, "lossRatioPercent", event.target.value)} /></label>
                  <label>Premium, $ <span className="required-marker">*</span><input type="number" step="0.01" min={0} required value={carrier.premium} onChange={(event) => updateCarrier(carrier.id, "premium", event.target.value)} /></label>
                </div>
                {stepFourData.topCarriers.length > 2 ? <button type="button" className="secondary remove-license" onClick={() => removeCarrier(carrier.id)}>Remove Carrier</button> : null}
              </div>
            ))}
            <button type="button" className="secondary add-license" onClick={addCarrier}>Add Carrier</button>

            <label className="top-gap">Please click here to upload current full year Agency Production and Loss Ratio Reports <span className="required-marker">*</span><input type="file" required accept=".pdf,.xlsx,.xls,.csv,.doc,.docx" onChange={(event) => setStepFourData({ ...stepFourData, productionLossReportFile: event.target.files?.[0] ?? null })} /></label>

            <label className="top-gap">Have you or any of your employees, managers, shareholders, executives or subsidiaries ever had an insurance license revoked, suspended or placed in administrative supervision by any state or federal entity? If yes, explain: <span className="required-marker">*</span>
              <div className="choice-row">
                <label className="inline-choice"><input type="radio" name="license-revoked" checked={stepFourData.licenseRevokedAnswer === "yes"} onChange={() => updateYesNoAnswer("licenseRevokedAnswer", "yes")} />Yes</label>
                <label className="inline-choice"><input type="radio" name="license-revoked" checked={stepFourData.licenseRevokedAnswer === "no"} onChange={() => updateYesNoAnswer("licenseRevokedAnswer", "no")} />No</label>
              </div>
            </label>
            {stepFourData.licenseRevokedAnswer === "yes" ? <label>Explanation <span className="required-marker">*</span><textarea required value={stepFourData.licenseRevokedExplanation} onChange={(event) => setStepFourData({ ...stepFourData, licenseRevokedExplanation: event.target.value })} /></label> : null}

            <label className="top-gap">Have you or any of your employees, managers, shareholders, executives or subsidiaries ever had been convicted or plead guilty or plead Nolo Contendere to any crimes? If yes, explain: <span className="required-marker">*</span>
              <div className="choice-row">
                <label className="inline-choice"><input type="radio" name="convicted" checked={stepFourData.convictedAnswer === "yes"} onChange={() => updateYesNoAnswer("convictedAnswer", "yes")} />Yes</label>
                <label className="inline-choice"><input type="radio" name="convicted" checked={stepFourData.convictedAnswer === "no"} onChange={() => updateYesNoAnswer("convictedAnswer", "no")} />No</label>
              </div>
            </label>
            {stepFourData.convictedAnswer === "yes" ? <label>Explanation <span className="required-marker">*</span><textarea required value={stepFourData.convictedExplanation} onChange={(event) => setStepFourData({ ...stepFourData, convictedExplanation: event.target.value })} /></label> : null}
            <label className="top-gap">Do your or any of your employees, managers, shareholders, executives or subsidiaries are charged have any criminal or administrative charges pending? If yes, explain: <span className="required-marker">*</span>
              <div className="choice-row">
                <label className="inline-choice"><input type="radio" name="pending" checked={stepFourData.pendingChargesAnswer === "yes"} onChange={() => updateYesNoAnswer("pendingChargesAnswer", "yes")} />Yes</label>
                <label className="inline-choice"><input type="radio" name="pending" checked={stepFourData.pendingChargesAnswer === "no"} onChange={() => updateYesNoAnswer("pendingChargesAnswer", "no")} />No</label>
              </div>
            </label>
            {stepFourData.pendingChargesAnswer === "yes" ? <label>Explanation <span className="required-marker">*</span><textarea required value={stepFourData.pendingChargesExplanation} onChange={(event) => setStepFourData({ ...stepFourData, pendingChargesExplanation: event.target.value })} /></label> : null}

            <label className="top-gap">Have you or any of your employees, managers, shareholders, executives or subsidiaries ever had appointment with any insurance company revoked and/or terminated for any reason? If yes, explain: <span className="required-marker">*</span>
              <div className="choice-row">
                <label className="inline-choice"><input type="radio" name="appointment-revoked" checked={stepFourData.appointmentRevokedAnswer === "yes"} onChange={() => updateYesNoAnswer("appointmentRevokedAnswer", "yes")} />Yes</label>
                <label className="inline-choice"><input type="radio" name="appointment-revoked" checked={stepFourData.appointmentRevokedAnswer === "no"} onChange={() => updateYesNoAnswer("appointmentRevokedAnswer", "no")} />No</label>
              </div>
            </label>
            {stepFourData.appointmentRevokedAnswer === "yes" ? <label>Explanation <span className="required-marker">*</span><textarea required value={stepFourData.appointmentRevokedExplanation} onChange={(event) => setStepFourData({ ...stepFourData, appointmentRevokedExplanation: event.target.value })} /></label> : null}

            <label className="top-gap">How did you hear about us? <span className="required-marker">*</span>
              <select required value={stepFourData.hearAboutUs} onChange={(event) => setStepFourData({ ...stepFourData, hearAboutUs: event.target.value })}>
                <option value="">Select one</option>
                {hearAboutUsOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            {saveNotice ? <p className="save-notice">{saveNotice}</p> : null}
            <div className="form-actions"><button type="button" className="dev-button" onClick={goToNextStepDev}>Dev: Next</button><button type="button" className="secondary" onClick={() => setCurrentStep(2)}>Previous</button><button type="submit" className="cta" disabled={isSaving}>{isSaving ? "Saving..." : "Next"}</button></div>
          </form>
        ) : null}

        {currentStep === 4 ? (
          <form className="appointment-form" onSubmit={handleStepFiveSubmit}>
            <h2>{sectionTitles[currentStep]}</h2>
            <p>Filling out this application does not guarantee an appointment, sole discretion rests with the management of the Company. Please allow up to 30 days for application processing. If your application was rejected, you can reapply no sooner than in one year.</p>
            <div className="form-grid two-col">
              <label>Requestor First Name <span className="required-marker">*</span><input type="text" required value={stepFiveData.requestorFirstName} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorFirstName: event.target.value })} /></label>
              <label>Requestor Last Name <span className="required-marker">*</span><input type="text" required value={stepFiveData.requestorLastName} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorLastName: event.target.value })} /></label>
              <label>Requestor Email <span className="required-marker">*</span><input type="email" required value={stepFiveData.requestorEmail} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorEmail: event.target.value })} /></label>
              <label>Requestor Email Repeat <span className="required-marker">*</span><input type="email" required value={stepFiveData.requestorEmailRepeat} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorEmailRepeat: event.target.value })} /></label>
              <label>Requestor Phone <span className="required-marker">*</span><input type="tel" required placeholder="+1 (___) ____ ___" value={stepFiveData.requestorPhone} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorPhone: event.target.value })} /></label>
              <label>Ext<input type="text" value={stepFiveData.requestorPhoneExt} onChange={(event) => setStepFiveData({ ...stepFiveData, requestorPhoneExt: event.target.value })} /></label>
            </div>
            <div className="checkbox-row top-gap"><input type="checkbox" checked={stepFiveData.authorizedToSign} onChange={(event) => setStepFiveData({ ...stepFiveData, authorizedToSign: event.target.checked })} /><span>Authorized to sign <span className="required-marker">*</span></span></div>
            {saveNotice ? <p className="save-notice">{saveNotice}</p> : null}
            <div className="form-actions"><button type="button" className="dev-button" onClick={goToNextStepDev}>Dev: Next</button><button type="button" className="secondary" onClick={() => setCurrentStep(3)}>Previous</button><button type="submit" className="cta">Submit</button></div>
          </form>
        ) : null}
      </section>
    </main>
  );
}
