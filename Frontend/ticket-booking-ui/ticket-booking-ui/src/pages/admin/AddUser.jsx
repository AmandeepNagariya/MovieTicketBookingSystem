import { useState } from "react";
import api from "../../services/api";

export default function AddUser() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    profilePictureFile: null
  });

  const [preview, setPreview] = useState("");

  // 📸 IMAGE PREVIEW
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm(prev => ({ ...prev, profilePictureFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🚀 SUBMIT
  const submit = async () => {
  const formData = new FormData();

  formData.append("FullName", form.fullName);
  formData.append("Email", form.email);
  formData.append("Password", form.password);
  formData.append("Role", "User");
  formData.append("RegisteredBy", "Admin");

  if (form.profilePictureFile) {
    formData.append("ProfilePicture", form.profilePictureFile);
  }

  await api.post("/auth/register", formData);

  alert("User Added Successfully 🎉");
};

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>

      <div
        className="card shadow p-4"
        style={{ width: 420, borderRadius: 15 }}
      >

        {/* TITLE */}
        <h4 className="text-center mb-3">Add Ticket Buyer</h4>

        {/* 📸 PROFILE IMAGE */}
        <div className="text-center mb-3">

          <img
            src={preview || "https://i.pravatar.cc/100"}
            className="rounded-circle mb-2"
            width="90"
            height="90"
            alt="profile"
          />

          <input
            type="file"
            className="form-control"
            onChange={handleImage}
          />
        </div>

        {/* 🧾 FORM */}
        <input
          className="form-control mb-2"
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {/* BUTTON */}
        <button
          className="btn btn-success w-100"
          onClick={submit}
        >
          Add User
        </button>

      </div>

    </div>
  );
}