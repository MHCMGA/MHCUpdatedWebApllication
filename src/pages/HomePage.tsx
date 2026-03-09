import { useMemo, useState } from "react";
import StateCoverageMap from "../features/stateCoverage/StateCoverageMap";

type FocusArea = {
  id: string;
  title: string;
  detail: string;
};

const focusAreas: FocusArea[] = [
  {
    id: "underwriting",
    title: "Specialized Underwriting",
    detail:
      "We focus on trucking risk profiles with practical underwriting standards built around real fleet operations."
  },
  {
    id: "speed",
    title: "Fast Response Time",
    detail:
      "Retail agents get responsive communication and timely quoting so they can keep business moving."
  },
  {
    id: "partnership",
    title: "Agent Partnership",
    detail:
      "Our team works side-by-side with independent agents to build long-term trucking insurance solutions."
  }
];

export default function HomePage(): JSX.Element {
  const [activeArea, setActiveArea] = useState<FocusArea>(focusAreas[0]);
  const [showMission, setShowMission] = useState(false);

  const tagline = useMemo(() => {
    return showMission
      ? "Built to support agents and protect trucking businesses on the road."
      : "A general managing agency dedicated to trucking insurance.";
  }, [showMission]);

  return (
    <main className="page-shell">
      <section className="title-block">
        <p className="eyebrow">Trucking Insurance Experts</p>
        <h1 className="home-title">MHCMGA</h1>
        <p className="tagline">{tagline}</p>
      </section>

      <section className="content-grid">
        <article className="panel hero-panel">
          <h2>General Managing Agency for Trucking Insurance</h2>
          <p>
            MHCMGA partners with agents and brokers to deliver focused trucking insurance solutions. We
            combine industry knowledge, practical underwriting, and service-driven support for fleets,
            owner-operators, and commercial transport accounts.
          </p>
          <button className="cta" onClick={() => setShowMission((current) => !current)}>
            {showMission ? "Hide Our Mission" : "Show Our Mission"}
          </button>
          {showMission && (
            <p className="mission-text">
              Our mission is to make trucking insurance placement smarter, faster, and more dependable for
              agency partners and their insureds.
            </p>
          )}
        </article>

        <article className="panel focus-panel">
          <h3>What We Bring</h3>
          <div className="chip-row">
            {focusAreas.map((area) => (
              <button
                key={area.id}
                className={`chip ${activeArea.id === area.id ? "active" : ""}`}
                onClick={() => setActiveArea(area)}
              >
                {area.title}
              </button>
            ))}
          </div>
          <p className="focus-detail">{activeArea.detail}</p>
        </article>
      </section>

      <StateCoverageMap />

      <section className="panel about-section" aria-labelledby="about-heading">
        <div className="about-copy">
          <h2 id="about-heading">About MHC Managing General Agency, LLC</h2>
          <p className="about-description">
            Reach out to our office for underwriting and agency support.
          </p>
          <p className="about-contact-line">
            <strong>Phone:</strong>{" "}
            <a href="tel:+18037662652" className="about-link">
              803-766-2652
            </a>
          </p>
          <p className="about-contact-line">
            <strong>Address:</strong>
          </p>
          <address className="about-address">
            MHC Managing General Agency, LLC
            <br />
            1325 Park St. Suite 200
            <br />
            Columbia, SC 29201
            <br />
            United States
          </address>
          <p className="about-copyright">
            Copyright ©2021- MHC Managing General Agency, LLC. All Rights Reserved
          </p>
        </div>

        <div className="about-map-wrap">
          <iframe
            className="about-map"
            title="Map of MHC Managing General Agency, LLC"
            src="https://maps.google.com/maps?q=1325%20Park%20St.%20Suite%20200%2C%20Columbia%2C%20SC%2029201&t=&z=15&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
