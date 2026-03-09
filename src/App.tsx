import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppointedPage from "./pages/AppointedPage";
import LossRunsPage from "./pages/LossRunsPage";
import ClaimsPage from "./pages/ClaimsPage";

export default function App(): JSX.Element {
  const logoSrc = `${import.meta.env.BASE_URL}mhc2.png`;

  return (
    <div className="app-root">
      <header className="top-bar">
        <NavLink to="/" aria-label="Home" className="home-logo-link">
          <img src={logoSrc} alt="MHCMGA Home" className="home-logo" />
        </NavLink>

        <nav className="top-nav-links" aria-label="Main navigation">
          <NavLink
            to="/loss-runs"
            className={({ isActive }) => `top-nav-link ${isActive ? "active" : ""}`}
          >
            Loss Runs
          </NavLink>
          <NavLink
            to="/claims"
            className={({ isActive }) => `top-nav-link ${isActive ? "active" : ""}`}
          >
            Claims
          </NavLink>
        </nav>

        <NavLink to="/appointed" className="get-appointed-button">
          Get Appointed
        </NavLink>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loss-runs" element={<LossRunsPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/appointed" element={<AppointedPage />} />
      </Routes>
    </div>
  );
}
