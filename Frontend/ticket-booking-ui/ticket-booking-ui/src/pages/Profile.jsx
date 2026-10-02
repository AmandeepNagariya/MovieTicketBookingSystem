import { useState, useEffect } from "react";
import api from "../services/api";

const API_BASE = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ 
    fullName: user.fullName || "", 
    email: user.email || "" 
  });

  const [previewUrl, setPreviewUrl] = useState(
  user.profilePicture
    ? `${API_BASE}${user.profilePicture}`
    : "https://i.pravatar.cc/100"
);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!user.id) return alert("User ID is missing!");

    try {
      const data = new FormData();
      data.append("FullName", formData.fullName);
      data.append("Email", formData.email);
      
      if (selectedFile) data.append("profileImage", selectedFile);

      // Verify your api service includes the Bearer token in headers!
      const res = await api.put(`/user/${user.id}`, data);

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      alert("Profile updated successfully! ✅");
      window.location.reload();
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed. Ensure you are logged in.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/user/${user.id}`);
      localStorage.clear();
      window.location = "/";
    } catch (err) {
      alert("Error deleting account.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "500px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4 fw-bold">My Profile</h3>
        
        <div className="text-center mb-4">
          <img 
            src={previewUrl} 
            width="130" height="130" 
            className="rounded-circle border border-4 border-primary shadow"
            style={{ objectFit: 'cover' }}
            alt="Profile"
          />
          {isEditing && (
            <div className="mt-2">
              <label className="btn btn-sm btn-dark">
                Change Photo
                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Full Name</label>
          <input 
            className="form-control" 
            disabled={!isEditing} 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Email Address</label>
          <input 
            className="form-control" 
            disabled={!isEditing} 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
        </div>

        {/* Read-Only Fields */}
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label text-muted">Role</label>
            <input className="form-control bg-light" value={user.role || ""} disabled />
          </div>
          <div className="col-6">
            <label className="form-label text-muted">Source</label>
            <input className="form-control bg-light" value={user.registeredBy || ""} disabled />
          </div>
        </div>

        <div className="d-flex gap-2">
          {!isEditing ? (
            <>
              <button className="btn btn-primary flex-grow-1" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
            </>
          ) : (
            <>
              <button className="btn btn-success flex-grow-1" onClick={handleUpdate}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* DELETE MODAL POPUP */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              This will permanently delete your account and booking history.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Keep Profile</button>
              <button className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Confirm Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}