import React from "react";
import { FaCog } from "react-icons/fa"; // Run: npm install react-icons

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const containerStyle = {
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  };

  return (
    <div className="container" style={containerStyle}>
      {user.role === "Admin" ? (
        <div className="card p-5 shadow border-0">
          <h2 className="text-primary mb-3">Hi, Admin! 👋</h2>
          <p className="lead text-muted">Please Configure Settings for the System!</p>
          <div className="mt-4">
            <button className="btn btn-outline-primary px-4 me-2">Global Config</button>
            <button className="btn btn-outline-dark px-4">System Logs</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {/* Continuously Rolling Gear Icon */}
          <div className="rolling-gear mb-4">
            <FaCog size={100} color="#0d6efd" />
          </div>
          
          <h4 className="text-dark fw-bold">To Change Settings for Your Account,</h4>
          <h4 className="text-primary fw-bold">Please Contact Admin.</h4>
        </div>
      )}

      <style>{`
        .rolling-gear {
          animation: spin 4s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}