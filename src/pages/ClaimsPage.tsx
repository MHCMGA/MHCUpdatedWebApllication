export default function ClaimsPage(): JSX.Element {
  return (
    <main className="page-shell">
      <section className="title-block">
        <p className="eyebrow">Claims</p>
        <h1 className="home-title">How to Report a Claim</h1>
        <p className="tagline">Use the carrier contacts below to report new claims.</p>
      </section>

      <section className="claims-grid">
        <article className="panel claim-card">
          <h2>Southwind &amp; Commodore</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:newclaim@dominionclaims.com">newclaim@dominionclaims.com</a>
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:+19843046175">1(984)-304-6175</a>
          </p>
        </article>

        <article className="panel claim-card">
          <h2>Bulldog</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:liabilitynewclaims@cbcsclaims.com">
              liabilitynewclaims@cbcsclaims.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:+18664571553">1(866)-457-1553</a>
          </p>
        </article>
      </section>
    </main>
  );
}
