import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <div className="nav">
      <div className="nav-header">
        <div className="nav-title"></div>
      </div>
      <div className="nav-btn"></div>

      <div className="nav-links">
        <Link to={"/"}>Home</Link>
        <Link to={"/find-host"}>Explore</Link>
        {state.isAuthenticated && <Link to={"/activity"}>Activity</Link>}
        {state.isAuthenticated && <Link to={"/profile"}>Profile</Link>}

        {!state.isAuthenticated && <Link to={"/login"}>Login</Link>}
        {!state.isAuthenticated && <Link to={"/register"}>Signup</Link>}

        {state.isAuthenticated && (
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        )}

        <a
          href="//github.com/codernishchay/interview-zone"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </div>
    </div>
  );
};

export default Navbar;
