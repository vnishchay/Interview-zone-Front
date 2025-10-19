import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import "./register.css";
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
    axios
      .post(`${API_BASE}/signup`, formData)
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
    <div className="register-container">
      {!isdone ? (
        <form onSubmit={handleSubmit(signup)} className="register-form">
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
          {errorMessage && <span className="form-error">{errorMessage}</span>}
          <button type="submit">Sign Up</button>
          <Link to={"/"}>Already Registered? Login here</Link>
        </form>
      ) : (
        <div className="register-form success-message">
          <h2>✓ Signup Complete!</h2>
          <p className="success-text">{successMessage}</p>
          <button onClick={() => history.push("/")}>Go to Login</button>
        </div>
      )}
    </div>
  );
}
