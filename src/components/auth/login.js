import React from "react";
import { useAuth } from "./authContext";
import axios from "axios";
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
      .post("http://localhost:3001/login", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        if ((res.status === 200 || res.status === 201) && res.data.token) {
          dispatch({
            type: "LOGIN",
            payload: {
              token: res.data.token,
              user: res.data.user || data.email,
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
      <form onSubmit={handleFormSubmit} className="login-form">
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
  );
};
export default Login;
