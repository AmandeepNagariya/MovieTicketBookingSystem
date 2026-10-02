import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    nav("/");
    window.location.reload();
  };

  // 🔥 IMPORTANT: Check your .NET port here (7191 or 7123)
  const API_BASE = "https://localhost:7191"; 

  const imageUrl = user?.profilePicture
    ? `${API_BASE}${user.profilePicture}`
    : "https://i.pravatar.cc/100";

  return (
    <div className="position-relative" ref={dropdownRef}>
      <img
        src={imageUrl}
        className="rounded-circle border border-2 border-white shadow-sm"
        width="42"
        height="42"
        alt="User Profile"
        style={{ cursor: "pointer", objectFit: "cover" }}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          className="position-absolute shadow-lg rounded mt-2 border"
          style={{ right: 0, top: 50, width: 200, backgroundColor: "#fff", zIndex: 9999 }}
        >
          <div className="px-3 py-2 bg-light border-bottom">
             {/* Removed hardcoded "Test User" */}
             <div className="fw-bold text-dark small">{user?.fullName || "Guest"}</div>
             <div className="text-muted" style={{ fontSize: '11px' }}>{user?.role || "User"}</div>
          </div>

          <div className="dropdown-item-custom" onClick={() => { nav("/profile"); setOpen(false); }}>
            Profile
          </div>

          <div className="dropdown-item-custom" onClick={() => { nav("/settings"); setOpen(false); }}>
            Settings
          </div>

          <div className="dropdown-item-custom text-danger fw-bold border-top" onClick={logout}>
            Logout
          </div>
        </div>
      )}

      <style>{`
        .dropdown-item-custom { padding: 10px 15px; cursor: pointer; color: #333; font-size: 14px; }
        .dropdown-item-custom:hover { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
}