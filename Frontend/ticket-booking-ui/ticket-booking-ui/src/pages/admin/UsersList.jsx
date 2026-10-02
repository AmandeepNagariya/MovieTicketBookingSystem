import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔥 FIX
    if (!user) {
      nav("/");
      return;
    }

    fetchUsers(user.id);
  }, []);

  const fetchUsers = async (adminId) => {
    try {
      const res = await api.get(`/admin/users?adminId=${adminId}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const impersonate = async (id) => {
    try {
      const res = await api.post(`/admin/impersonate/${id}`);

      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/user/movies";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>User List</h2>

      <table className="table table-striped mt-3 shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => impersonate(u.id)}
                >
                  Impersonate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}