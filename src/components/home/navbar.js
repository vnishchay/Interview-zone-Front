import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import IzIcon from "../icons/iz-icon.svg";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { headers, API_BASE } from "../config";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  const [notifications, setNotifications] = useState({
    interviewRequests: 0,
    connectionRequests: 0,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (state.isAuthenticated) {
      const header = headers();
      if (header !== undefined) {
        axios
          .get(`${API_BASE}/user/profile`, header)
          .then((res) => {
            if (!mounted) return;
            if (res.status === 200 && res.data.user) {
              setNotifications({
                interviewRequests: res.data.user.interviewRequest?.length || 0,
                connectionRequests:
                  res.data.user.connectionRequests?.length || 0,
              });
            }
          })
          .catch(() => {
            /* silent */
          });
      }
    }
    return () => {
      mounted = false;
    };
  }, [state.isAuthenticated]);
  const totalCount =
    (notifications.interviewRequests || 0) +
    (notifications.connectionRequests || 0);

  const toggleDropdown = () => setDropdownOpen((s) => !s);

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        dropdownOpen &&
        notifBtnRef.current &&
        !notifBtnRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dropdownOpen]);

  return (
    <div className="nav">
      <div className="nav-header">
        <div className="nav-title">
          <img src={IzIcon} alt="Interview Zone" className="brand-icon" />
        </div>
      </div>
      <div className="nav-btn"></div>

      {/* keep dropdown anchored to nav-links (rightmost) */}
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

        {/* single right-most notification bell */}
        {state.isAuthenticated && (
          <div className="notif-container">
            <button
              ref={notifBtnRef}
              className="nav-quick-notif"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={toggleDropdown}
              aria-label="Open notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="bell-icon"
              >
                <path
                  d="M12 22c1.1 0 1.99-.9 1.99-2H10c0 1.1.9 2 2 2z"
                  fill="#fff"
                />
                <path
                  d="M18.29 16.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-.29.29A1 1 0 006 18h12a1 1 0 00.29-1.71z"
                  fill="#fff"
                />
              </svg>
              {totalCount > 0 && (
                <span className="nav-notif-count" aria-hidden>
                  {totalCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="notif-dropdown" ref={dropdownRef} role="menu">
                <div className="notif-item">
                  <div className="notif-label">Interview Requests</div>
                  <div className="notif-value">
                    {notifications.interviewRequests}
                  </div>
                </div>
                <div className="notif-item">
                  <div className="notif-label">Connection Requests</div>
                  <div className="notif-value">
                    {notifications.connectionRequests}
                  </div>
                </div>
                <div className="notif-actions">
                  <Link to="/activity" className="notif-seeall">
                    View Activity
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
