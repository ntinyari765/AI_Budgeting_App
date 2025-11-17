import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: "var(--purple)",
      padding: "1rem",
      color: "white"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Finance Tracker</h2>

        <div>
          {!user && (
            <>
              <Link to="/" style={{ marginRight: "1rem" }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
              <button
                onClick={logout}
                style={{
                  background: "var(--purple-light)",
                  border: "none",
                  padding: "0.4rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
