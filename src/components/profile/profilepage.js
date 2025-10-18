import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { headers, API_BASE } from "../config";
import "./profilepage.css";
import { CustomButton } from "../userCards/profileCards";
import { useAuth } from "../auth/authContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { state } = useAuth();
  const [data, setData] = useState();
  const [isHost, setIsHost] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);
  const [editError, setEditError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    country: "",
  });
  // Determine if this is the logged-in user's own profile
  const isOwnProfile =
    (!id && state.user) ||
    (data &&
      data.user &&
      state.user &&
      data.user.username === state.user.username);

  useEffect(() => {
    const header = headers();
    if (header !== undefined && id === undefined) {
      axios
        .get(`${API_BASE}/user/profile`, header)
        .then((res) => {
          if (res.status === 200) {
            const payload =
              res.data && res.data.user ? res.data.user : res.data;
            setData(res.data);
            if (payload) {
              setIsHost(!!payload.ishost);
              setIsCandidate(!!payload.iscandidate);
              setEditForm({
                name: payload.name || "",
                email: payload.email || "",
                country: payload.country || "",
              });
            }
          }
        })
        .catch((err) => {
          console.warn("Could not fetch profile:", err?.message || err);
        });
    } else {
      if (header !== undefined) {
        axios
          .post(
            `${API_BASE}/user/findSingleProfileWithFilter`,
            { username: id },
            header
          )
          .then((res) => {
            if (res.status === 200) {
              setData(res.data);
              if (res.data && res.data.user) {
                setIsHost(!!res.data.user.ishost);
                setIsCandidate(!!res.data.user.iscandidate);
                setEditForm({
                  name: res.data.user.name || "",
                  email: res.data.user.email || "",
                  country: res.data.user.country || "",
                });
              }
            }
          });
      }
    }
  }, [id, state.user]);

  // Update roles (only for own profile)
  const handleRoleChange = (role, value) => {
    setEditError("");
    if (!isOwnProfile) return;
    const update = {};
    if (role === "host") {
      setIsHost(value);
      update.ishost = value;
    }
    if (role === "candidate") {
      setIsCandidate(value);
      update.iscandidate = value;
    }
    const header = headers();
    if (header !== undefined) {
      axios
        .put(`${API_BASE}/user/profile`, update, header)
        .then((res) => {
          if (res.status !== 200) {
            setEditError("Failed to update role");
          }
        })
        .catch(() => setEditError("Failed to update role"));
    }
  };

  // Handle profile information edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditError("");
    const header = headers();
    if (header !== undefined) {
      axios
        .put(`${API_BASE}/user/profile`, editForm, header)
        .then((res) => {
          if (res.status === 200) {
            setData(res.data);
            setIsEditing(false);
            // Refresh the data
            axios.get(`${API_BASE}/user/profile`, header).then((response) => {
              if (response.status === 200) {
                setData(response.data);
              }
            });
          } else {
            setEditError("Failed to update profile");
          }
        })
        .catch((error) => {
          setEditError(
            error.response?.data?.message || "Failed to update profile"
          );
        });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const getInitials = (name, username) => {
    if (name && name.trim().length >= 2) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (username && username.length >= 2) {
      return username.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  return (
    <div className="profile-page">
      {data && data.user && (
        <div className="content-profile-page">
          <div className="profile-user-page">
            {/* Avatar with Initials */}
            <div className="img-user-profile">
              <div className="avatar-initials">
                {getInitials(data.user.name, data.user.username)}
              </div>
            </div>

            {/* Username */}
            <div className="user-profile-data">
              <h1>@{data.user.username}</h1>
            </div>

            {/* User Details */}
            <div className="user-details-section">
              {!isEditing ? (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">
                      {data.user.name || "Not set"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{data.user.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Country:</span>
                    <span className="detail-value">
                      {data.user.country || "Not set"}
                    </span>
                  </div>
                </>
              ) : (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: data.user.name || "",
                          email: data.user.email || "",
                          country: data.user.country || "",
                        });
                        setEditError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  {editError && <div className="form-error">{editError}</div>}
                </form>
              )}
            </div>

            {/* Edit Button (only for own profile) */}
            {isOwnProfile && !isEditing && (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}

            {/* Roles */}
            <div className="roles-display">
              <span className="detail-label">Roles: </span>
              <span>
                {isHost && <span className="role-badge">Interviewer</span>}
                {isCandidate && <span className="role-badge">Candidate</span>}
                {!isHost && !isCandidate && (
                  <span className="role-badge-none">None</span>
                )}
              </span>
            </div>

            {/* Role Toggles (only for own profile) */}
            {isOwnProfile && (
              <div className="edit-roles-section">
                <label>
                  <input
                    type="checkbox"
                    checked={isHost}
                    onChange={(e) => handleRoleChange("host", e.target.checked)}
                  />
                  <span>I want to host interviews</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={isCandidate}
                    onChange={(e) =>
                      handleRoleChange("candidate", e.target.checked)
                    }
                  />
                  <span>I want to be a candidate</span>
                </label>
                {editError && !isEditing && (
                  <div className="form-error">{editError}</div>
                )}
              </div>
            )}

            {/* Connection/Interview Request Buttons (only for other users' profiles) */}
            {!isOwnProfile && data.user._id && (
              <div className="profile-actions">
                <CustomButton id={data.user._id} type={3} />
                <CustomButton id={data.user._id} type={1} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
