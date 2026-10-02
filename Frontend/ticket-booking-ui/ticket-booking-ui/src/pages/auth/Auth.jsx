import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./auth.css";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("User");

  return (
    <div className="auth-bg">

      <div className="auth-card">

        {/* 🔄 LOGIN / REGISTER */}
        <div className="toggle-group">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {/* 🔥 ROLE SWITCH */}
        <div className="toggle-group mb-3">
          <button
            className={role === "User" ? "active" : ""}
            onClick={() => setRole("User")}
          >
            User
          </button>

          <button
            className={role === "Admin" ? "active" : ""}
            onClick={() => setRole("Admin")}
          >
            Admin
          </button>
        </div>

        {/* 🔽 CHILD COMPONENT */}
        {tab === "login"
          ? <Login role={role} />
          : <Register role={role} />
        }

      </div>
    </div>
  );
}