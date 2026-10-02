import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isActive = (path) =>
    location.pathname === path ? "bg-primary text-white" : "";

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: 220, height: "100vh" }}
    >
      <h5 className="mb-4 text-center">🎬 Menu</h5>

      {user?.role === "Admin" ? (
        <>
          <div
            className={`p-2 rounded mb-2 ${isActive("/admin/dashboard")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/admin/dashboard")}
          >
            Dashboard
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/admin/add-user")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/admin/add-user")}
          >
            Add User
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/admin/users")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/admin/users")}
          >
            Users List
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/admin/movies")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/admin/movies")}
          >
            Movie Schedule
          </div>
        </>
      ) : (
        <>
          <div
            className={`p-2 rounded mb-2 ${isActive("/user/movies")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/user/movies")}
          >
            Movies
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/user/payments")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/user/payments")}
          >
            Payment Records
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/profile")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/profile")}
          >
            Profile
          </div>

          <div
            className={`p-2 rounded mb-2 ${isActive("/settings")}`}
            style={{ cursor: "pointer" }}
            onClick={() => nav("/settings")}
          >
            Settings
          </div>
        </>
      )}
    </div>
  );
}