import { useState } from "react";
import api from "../../services/api";

export default function Register({ role }) {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    profilePictureFile: null
  });

  const [preview, setPreview] = useState("");

  // 📸 IMAGE HANDLER
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm(prev => ({
      ...prev,
      profilePictureFile: file
    }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🚀 REGISTER
  const register = async () => {
    try {
      const formData = new FormData();

      formData.append("FullName", form.fullName);
      formData.append("Email", form.email);
      formData.append("Password", form.password);
      formData.append("Role", role);
      formData.append("RegisteredBy", "Self");

      if (form.profilePictureFile) {
        formData.append("ProfilePicture", form.profilePictureFile);
      }

      await api.post("/auth/register", formData);

      alert(`${role} Registered Successfully 🎉`);

      // ✅ RESET FORM AFTER SUCCESS
      setForm({
        fullName: "",
        email: "",
        password: "",
        profilePictureFile: null
      });

      setPreview("");

    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div>

      <h3 className="text-center mb-3">{role} Register</h3>

      {/* PROFILE IMAGE */}
      <div className="text-center mb-3">
        <img
          src={preview || "https://i.pravatar.cc/100"}
          alt="profile"
          className="rounded-circle mb-2"
          width="90"
          height="90"
          style={{ objectFit: "cover" }}
        />

        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImage}
        />
      </div>

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

      <button
        className="btn btn-success w-100"
        onClick={register}
      >
        Register as {role}
      </button>

    </div>
  );
}