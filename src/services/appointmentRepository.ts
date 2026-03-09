import type {
  StepOneFormData,
  StepOneStoredDraft,
  StepTwoFormData,
  StepTwoStoredDraft,
  StepThreeFormData,
  StepThreeStoredDraft,
  StepFourFormData,
  StepFourStoredDraft
} from "../types/appointment";

export interface AppointmentRepository {
  saveStepOneDraft(data: StepOneFormData): Promise<void>;
  saveStepTwoDraft(data: StepTwoFormData): Promise<void>;
  saveStepThreeDraft(data: StepThreeFormData): Promise<void>;
  saveStepFourDraft(data: StepFourFormData): Promise<void>;
}

class LocalAppointmentRepository implements AppointmentRepository {
  async saveStepOneDraft(data: StepOneFormData): Promise<void> {
    const payload: StepOneStoredDraft = {
      ...data,
      w9FileName: data.w9File?.name ?? ""
    };

    localStorage.setItem("mhcmga_step_one_draft", JSON.stringify(payload));
  }

  async saveStepTwoDraft(data: StepTwoFormData): Promise<void> {
    const payload: StepTwoStoredDraft = {
      ...data,
      eoDeclarationFileName: data.eoDeclarationFile?.name ?? ""
    };

    localStorage.setItem("mhcmga_step_two_draft", JSON.stringify(payload));
  }

  async saveStepThreeDraft(data: StepThreeFormData): Promise<void> {
    const payload: StepThreeStoredDraft = {
      ...data,
      stateLicenses: data.stateLicenses.map((entry) => ({
        id: entry.id,
        licenseNumber: entry.licenseNumber,
        state: entry.state,
        dateIssued: entry.dateIssued,
        licenseFileName: entry.licenseFile?.name ?? ""
      }))
    };

    localStorage.setItem("mhcmga_step_three_draft", JSON.stringify(payload));
  }

  async saveStepFourDraft(data: StepFourFormData): Promise<void> {
    const payload: StepFourStoredDraft = {
      ...data,
      topCarriers: data.topCarriers.map((entry) => ({
        id: entry.id,
        companyName: entry.companyName,
        lossRatioPercent: entry.lossRatioPercent,
        premium: entry.premium
      })),
      productionLossReportFileName: data.productionLossReportFile?.name ?? ""
    };

    localStorage.setItem("mhcmga_step_four_draft", JSON.stringify(payload));
  }
}

// Swap this with a Google Cloud implementation later (Cloud Run/Firebase/Firestore API endpoint).
export const appointmentRepository: AppointmentRepository = new LocalAppointmentRepository();
