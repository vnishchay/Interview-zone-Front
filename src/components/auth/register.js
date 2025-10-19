import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import "./login.css";
import { API_BASE } from "../config";

export default function Register() {
  const history = useHistory();
  const { register, handleSubmit, reset } = useForm();
  const [username, setusername] = useState("");
  const [isfinal, setisfinal] = useState(false);
  const [isdone, setisdone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const signup = (formData) => {
    setErrorMessage("");
    setSuccessMessage("");
    // include any selected tags with the signup payload
    const payload = { ...formData, tags: selectedTags };
    axios
      .post(`${API_BASE}/signup`, payload)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setisdone(true);
          setSuccessMessage("Signup successful! Redirecting to home...");
          reset();
          setTimeout(() => {
            history.push("/");
          }, 1200);
        } else {
          setErrorMessage("Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message || error.message || "Signup failed."
        );
      });
  };

  // tags state and load available categories
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOpen, setTagsOpen] = useState(false);

  useEffect(() => {
    // fetch public tags (convenience endpoint) for interview categories
    axios
      .get(`${API_BASE}/tags`)
      .then((res) => {
        if (res.status === 200 && res.data && res.data.data) {
          setCategories(res.data.data);
        } else if (res.status === 200 && Array.isArray(res.data)) {
          // fallback if controller returns array directly
          setCategories(res.data);
        }
      })
      .catch(() => {
        // ignore failures; categories are optional
      });
  }, []);

  const toggleTag = (key) => {
    setSelectedTags((prev) => {
      if (prev.includes(key)) return prev.filter((t) => t !== key);
      return [...prev, key];
    });
  };

  useEffect(() => {
    if (username !== "") {
      setCheckingUsername(true);
      axios
        .post(`${API_BASE}/verifyusername`, { username: username })
        .then((res) => {
          if (res.data.status === "success") {
            setisfinal(true);
          } else {
            setisfinal(false);
          }
        })
        .catch(() => setisfinal(false))
        .finally(() => setCheckingUsername(false));
    }
  }, [username]);

  return (
    <div className="login-container">
      <div className="login-panel">
        <div className="marketing">
          <div className="marketing-illustration" aria-hidden="true">
            <svg
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6b73ff" />
                  <stop offset="100%" stopColor="#9b59ff" />
                </linearGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width="600"
                height="400"
                rx="16"
                fill="url(#g1)"
                opacity="0.12"
              />
              <g transform="translate(40,30)">
                <circle cx="120" cy="90" r="70" fill="#fff" opacity="0.06" />
                <rect
                  x="220"
                  y="40"
                  rx="8"
                  ry="8"
                  width="260"
                  height="220"
                  fill="#fff"
                  opacity="0.06"
                />
                <circle cx="380" cy="180" r="32" fill="#fff" opacity="0.08" />
              </g>
            </svg>
          </div>
          <h1 className="sr-only">Interview Zone</h1>
          <p className="marketing-lead sr-only">Create an account</p>
          <p className="marketing-copy sr-only">
            Join Interview Zone to host and participate in live interviews with
            a collaborative code editor, video, and chat — all in one place.
          </p>
        </div>

        {!isdone ? (
          <form onSubmit={handleSubmit(signup)} className="register-form right">
            <h2>Sign Up</h2>
            <label htmlFor="username">
              Username
              <div
                className={`username-field ${
                  isfinal ? "valid" : username ? "invalid" : ""
                }`}
              >
                <input
                  type="text"
                  {...register("username", { required: true })}
                  id="username"
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
                {username && (
                  <span className="username-status">
                    {checkingUsername
                      ? "Checking..."
                      : isfinal
                      ? "✓ Available"
                      : "✗ Not available"}
                  </span>
                )}
              </div>
            </label>
            <label htmlFor="name">
              Full Name
              <input type="text" {...register("name")} id="name" />
            </label>
            <label htmlFor="country">
              Country
              <input type="text" {...register("country")} id="country" />
            </label>
            <label htmlFor="email">
              Email Address
              <input
                type="email"
                {...register("email", { required: true })}
                id="email"
                required
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                {...register("password", { required: true })}
                id="password"
                required
              />
            </label>
            {/* Tag selection - dropdown with checkboxes (predefined categories only, max 5) */}
            <div style={{ marginTop: 12, position: "relative" }}>
              <label
                htmlFor="tag-dropdown"
                style={{ display: "block", marginBottom: 6 }}
              >
                Interview Tags (optional)
              </label>
              <button
                id="tag-dropdown"
                type="button"
                onClick={() => setTagsOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={tagsOpen}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                Select tags
                <span style={{ marginLeft: 8, color: "#aaa", fontSize: 13 }}>
                  {selectedTags.length} selected
                </span>
              </button>

              {tagsOpen && (
                <div
                  role="listbox"
                  aria-label="Interview tags"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: 260,
                    maxHeight: 220,
                    overflow: "auto",
                    background: "#0f1724",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    padding: 10,
                    zIndex: 40,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  }}
                >
                  {categories && categories.length > 0 ? (
                    categories.map((c) => {
                      const isSelected = selectedTags.includes(c.key);
                      const disabled = !isSelected && selectedTags.length >= 5;
                      return (
                        <label
                          key={c.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 8px",
                            borderRadius: 6,
                            cursor: disabled ? "not-allowed" : "pointer",
                            color: disabled ? "#6b7280" : "#e5e7eb",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={disabled}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedTags((prev) => {
                                if (checked) {
                                  if (prev.includes(c.key)) return prev;
                                  if (prev.length >= 5) return prev;
                                  return [...prev, c.key];
                                }
                                return prev.filter((t) => t !== c.key);
                              });
                            }}
                          />
                          <span style={{ flex: 1 }}>{c.label}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div style={{ color: "#999" }}>No tags available</div>
                  )}
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <small style={{ color: "#9ca3af" }}>
                      {selectedTags.length} selected (max 5)
                    </small>
                    <button
                      type="button"
                      onClick={() => setTagsOpen(false)}
                      style={{
                        background: "transparent",
                        color: "#9ca3af",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            {errorMessage && <span className="form-error">{errorMessage}</span>}
            <button type="submit">Sign Up</button>
            <Link to="/">Already Registered? Login here</Link>
          </form>
        ) : (
          <div className="register-form success-message right">
            <h2>✓ Signup Complete!</h2>
            <p className="success-text">{successMessage}</p>
            <button onClick={() => history.push("/")}>Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
