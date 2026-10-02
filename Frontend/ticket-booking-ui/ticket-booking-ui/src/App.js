import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Layout from "./components/Layout";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AddUser from "./pages/admin/AddUser";
import UsersList from "./pages/admin/UsersList";
import MovieSchedule from "./pages/admin/MovieSchedule";

// User Pages
import MovieList from "./pages/user/MovieList";
import SeatSelection from "./pages/user/SeatSelection";
import PaymentRecords from "./pages/user/PaymentRecords";

// 🔐 UPDATED Protected Route (NO TOKEN)
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public */}
        <Route path="/" element={<Auth />} />

        {/* 🔐 COMMON */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute role="Admin">
              <Layout><AddUser /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="Admin">
              <Layout><UsersList /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute role="Admin">
              <Layout><MovieSchedule /></Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}

        <Route
          path="/user/movies"
          element={
            <ProtectedRoute role="User">
              <Layout><MovieList /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/seats/:id"
          element={
            <ProtectedRoute role="User">
              <Layout><SeatSelection /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/payments"
          element={
            <ProtectedRoute role="User">
              <Layout><PaymentRecords /></Layout>
            </ProtectedRoute>
          }
        />

        {/* 🔁 Default */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}