import React from "react";
import { useAuth } from "./authContext";
import axios from "axios";
import { API_BASE } from "../config";
import { Link, useHistory } from "react-router-dom";
import "./login.css";

export const Login = () => {
  const { dispatch } = useAuth();
  const history = useHistory();
  const [data, setData] = React.useState({
    email: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  });

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
      errorMessage: null,
    });
  };

  const validate = () => {
    if (!data.email || !data.password) {
      setData((d) => ({
        ...d,
        errorMessage: "Email and password are required.",
      }));
      return false;
    }
    // Simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      setData((d) => ({ ...d, errorMessage: "Enter a valid email address." }));
      return false;
    }
    return true;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setData((d) => ({ ...d, isSubmitting: true, errorMessage: null }));
    axios
      .post(`${API_BASE}/login`, {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        if ((res.status === 200 || res.status === 201) && res.data.token) {
          // Ensure we always dispatch a user object with a username field
          const userPayload =
            res.data.user && typeof res.data.user === "object"
              ? res.data.user
              : { username: res.data.user || data.email };

          dispatch({
            type: "LOGIN",
            payload: {
              token: res.data.token,
              user: userPayload,
            },
          });
          history.push("/");
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((error) => {
        setData((d) => ({
          ...d,
          isSubmitting: false,
          errorMessage:
            error.response?.data?.message || error.message || "Login failed.",
        }));
      });
  };

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
          <p className="marketing-lead sr-only">Your interview, reimagined.</p>
          <p className="marketing-copy sr-only">
            Practice, pair-program, and host live interviews with built-in
            coding, video, and chat. Fast setup, low friction — focus on the
            conversation.
          </p>
          <ul className="marketing-features sr-only">
            <li>Live video & screen sharing</li>
            <li>Collaborative code editor</li>
            <li>Session recording & notes</li>
          </ul>
        </div>

        <form onSubmit={handleFormSubmit} className="login-form right">
          <h1>Login</h1>
          <label htmlFor="email">
            Email Address
            <input
              type="email"
              value={data.email}
              onChange={handleInputChange}
              name="email"
              id="email"
              autoComplete="email"
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              value={data.password}
              onChange={handleInputChange}
              name="password"
              id="password"
              autoComplete="current-password"
              required
            />
          </label>
          {data.errorMessage && (
            <span className="form-error" style={{ color: "red" }}>
              {data.errorMessage}
            </span>
          )}
          <button type="submit" disabled={data.isSubmitting}>
            {data.isSubmitting ? "Loading..." : "Login"}
          </button>
          <div style={{ marginTop: 10 }}>
            <Link to={"/register"}>Don't have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
