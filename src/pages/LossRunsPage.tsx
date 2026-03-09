import { FormEvent, useState } from "react";

type RequestorType = "insured" | "agent" | "";

type LossRunsFormData = {
  requestorType: RequestorType;
  email: string;
  insuredName: string;
  dotNumber: string;
  policyNumber: string;
  effectiveDate: string;
  expirationDate: string;
};

const initialFormData: LossRunsFormData = {
  requestorType: "",
  email: "",
  insuredName: "",
  dotNumber: "",
  policyNumber: "",
  effectiveDate: "",
  expirationDate: ""
};

export default function LossRunsPage(): JSX.Element {
  const [formData, setFormData] = useState<LossRunsFormData>(initialFormData);
  const [submitNotice, setSubmitNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitNotice("Loss runs request submitted.");
    setFormData(initialFormData);
  };

  return (
    <main className="page-shell">
      <section className="title-block">
        <p className="eyebrow">Service Request</p>
        <h1 className="home-title">Loss Runs</h1>
        <p className="tagline">Submit a loss runs request and our team will follow up.</p>
      </section>

      <section className="panel appointed-panel">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet, velit ac mollis
          ullamcorper, tortor neque faucibus est, sed bibendum erat justo et velit. Integer finibus
          tincidunt sem, eu ullamcorper nisi cursus sed. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Sed tristique, magna non vulputate tempus, nibh nisl
          luctus neque, non gravida nisl sem sed mauris.
        </p>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-grid two-col">
            <label>
              I am the <span className="required-marker">*</span>
              <select
                required
                value={formData.requestorType}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    requestorType: event.target.value as RequestorType
                  })
                }
              >
                <option value="">Select one</option>
                <option value="insured">Insured</option>
                <option value="agent">Agent</option>
              </select>
            </label>

            <label>
              Email <span className="required-marker">*</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
            </label>

            <label>
              Insured&apos;s Name <span className="required-marker">*</span>
              <input
                type="text"
                required
                value={formData.insuredName}
                onChange={(event) => setFormData({ ...formData, insuredName: event.target.value })}
              />
            </label>

            <label>
              DOT# <span className="required-marker">*</span>
              <input
                type="text"
                required
                value={formData.dotNumber}
                onChange={(event) => setFormData({ ...formData, dotNumber: event.target.value })}
              />
            </label>

            <label>
              Policy# <span className="required-marker">*</span>
              <input
                type="text"
                required
                value={formData.policyNumber}
                onChange={(event) => setFormData({ ...formData, policyNumber: event.target.value })}
              />
            </label>

            <label>
              Effective Date
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(event) => setFormData({ ...formData, effectiveDate: event.target.value })}
              />
            </label>

            <label>
              Expiration Date
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(event) => setFormData({ ...formData, expirationDate: event.target.value })}
              />
            </label>
          </div>

          {submitNotice ? <p className="save-notice">{submitNotice}</p> : null}

          <div className="form-actions">
            <button type="submit" className="cta">
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
