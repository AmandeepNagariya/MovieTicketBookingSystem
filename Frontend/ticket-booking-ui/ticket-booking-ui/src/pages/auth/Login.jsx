import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.role !== role) {
        alert(`You are not registered as ${role}`);
        return;
      }

      // ✅ STORE USER ONLY
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ REDIRECT
      role === "Admin"
        ? nav("/admin/dashboard")
        : nav("/user/movies");

    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div>
      <h3 className="text-center mb-3">{role} Login</h3>

      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="btn btn-dark w-100" onClick={login}>
        Login
      </button>
    </div>
  );
}