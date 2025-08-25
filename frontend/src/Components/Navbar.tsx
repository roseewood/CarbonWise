import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (path: string) => (pathname === path ? "active" : "");

  return (
    <nav
      style={{
        width: "100%",
        background: "var(--bg)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.75rem 1rem", // only small breathing room
        }}
      >
        {/* Logo (flush left) */}
        <NavLink
          to="/"
          className="row"
          aria-label="CarbonWise Home"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <img
            src="/CarbonWise-Logo.png"
            alt="CarbonWise"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
            }}
          />
          <strong
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "var(--brand)" }}>C</span>
            <span style={{ color: "var(--muted)" }}>arbon</span>
            <span style={{ color: "var(--brand)" }}>W</span>
            <span style={{ color: "var(--muted)" }}>ise</span>
          </strong>
        </NavLink>

        {/* Navigation Links (flush right) */}
        <div style={{ display: "flex", gap: "2rem" }}>
          <NavLink className={isActive("/")} to="/">
            Home
          </NavLink>
          <NavLink className={isActive("/calculator")} to="/calculator">
            Calculator
          </NavLink>
          <NavLink className={isActive("/coach")} to="/coach">
            AI Coach
          </NavLink>
          <NavLink className={isActive("/account")} to="/account">
            Account
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
