import React, { useState } from "react";
import { v4 } from "uuid";
import { useAuth } from "../auth/authContext";
import { useHistory } from "react-router-dom";
import "./_home.css";
import "./home.css";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Login from "../auth/login";
import axios from "axios";
import { headers, API_BASE } from "../config";

export const create = (history) => {
  const header = headers();
  const id = v4();
  try {
    if (header !== undefined) {
      axios
        .post(`${API_BASE}/interview/create`, { interviewID: id }, header)
        .then((res) => {
          console.log(res);
          if (res.statusText === "OK") {
            // axios.put('http://localhost:3001/')
            history.push(`/setup/${id}`);
          }
        });
    }
  } catch (err) {
    console.log("Can't Create an Interview" + err);
  }
};

export default function Home() {
  const { state } = useAuth();
  const history = useHistory();
  const [url, seturl] = useState();
  const [notifications, setNotifications] = useState({
    interviewRequests: 0,
    connectionRequests: 0,
  });

  // Fetch notifications on mount
  React.useEffect(() => {
    if (state.isAuthenticated) {
      const header = headers();
      if (header !== undefined) {
        axios
          .get(`${API_BASE}/user/profile`, header)
          .then((res) => {
            if (res.status === 200 && res.data.user) {
              const interviewReqCount =
                res.data.user.interviewRequest?.length || 0;
              const connectionReqCount =
                res.data.user.connectionRequests?.length || 0;
              setNotifications({
                interviewRequests: interviewReqCount,
                connectionRequests: connectionReqCount,
              });
            }
          })
          .catch((err) => {
            console.error("Error fetching notifications:", err);
          });
      }
    }
  }, [state.isAuthenticated]);

  const find = () => {
    const header = headers();
    const id = url.split("/");
    console.log(id[id.length - 1]);
    if (header !== undefined) {
      axios
        .post(
          `${API_BASE}/interview/findfilter`,
          { interviewID: id[id.length - 1] },
          header
        )
        .then((res) => {
          if (res.statusText === "OK") {
            console.log(res);
            if (res.data.data && res.data.data.length > 0) {
              const id = res.data.data[0].id;
              axios
                .post(
                  `${API_BASE}/interview/update/${id}`,
                  { idOfParticipant: "update" },
                  header
                )
                .then((res) => {
                  history.push("/setup/" + id);
                });
            }
          }
        });
    }
  };
  return (
    <div className="home-wrapper">
      {state.isAuthenticated ? (
        <>
          <Navbar></Navbar>

          {/* Notifications Section */}
          {(notifications.interviewRequests > 0 ||
            notifications.connectionRequests > 0) && (
            <div className="notifications-banner">
              <div className="notifications-content">
                <h3>📬 You have new notifications!</h3>
                <div className="notification-items">
                  {notifications.interviewRequests > 0 && (
                    <Link to="/activity" className="notification-link">
                      <div className="notification-badge">
                        <span className="badge-count">
                          {notifications.interviewRequests}
                        </span>
                        <span className="badge-text">
                          Interview Request
                          {notifications.interviewRequests > 1 ? "s" : ""}
                        </span>
                      </div>
                    </Link>
                  )}
                  {notifications.connectionRequests > 0 && (
                    <Link to="/activity" className="notification-link">
                      <div className="notification-badge">
                        <span className="badge-count">
                          {notifications.connectionRequests}
                        </span>
                        <span className="badge-text">
                          Connection Request
                          {notifications.connectionRequests > 1 ? "s" : ""}
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
                <Link to="/activity">
                  <button className="view-activity-btn">View Activity</button>
                </Link>
              </div>
            </div>
          )}

          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Master Your Interview Skills</h1>
              <p className="hero-subtitle">
                Practice, prepare, and excel with real-time mock interviews
              </p>
            </div>
          </section>

          <section className="c-section">
            <h2 className="c-section__title">
              <span>Start Your Journey </span>
            </h2>
            <ul className="c-services">
              <div className="c-services__item feature-card">
                <div className="card-icon">📚</div>
                <h3>Practice & Prepare</h3>
                <p>
                  Enhance your skills with structured interview practice
                  sessions. Get ready for technical interviews with our
                  comprehensive platform.
                </p>
              </div>

              <div className="c-services__item action-card">
                <div className="card-icon">🎯</div>
                <h3>Find an Interviewer</h3>
                <p>
                  Connect with experienced interviewers who can help you
                  prepare.
                </p>
                <Link to="/find-host">
                  <button className="raise primary-btn">
                    Browse Interviewers
                  </button>
                </Link>
              </div>

              <div className="c-services__item action-card">
                <div className="card-icon">🚀</div>
                <h3>Create Interview Session</h3>
                <p>Host your own interview session and help others practice.</p>
                <button
                  className="raise primary-btn"
                  onClick={() => create(history)}
                >
                  Create Now
                </button>
              </div>

              <div className="c-services__item join-card">
                <div className="card-icon">🔗</div>
                <h3>Join with Link</h3>
                <p className="join-description">
                  Have an interview link? Join instantly
                </p>
                <div className="inputWithButton">
                  <div className="item">
                    <input
                      className="searchInpt"
                      type="text"
                      placeholder="Paste interview link here..."
                      onChange={(e) => seturl(e.target.value)}
                    />
                  </div>
                  <div className="item">
                    <button className="btnSearch btnAqua" onClick={find}>
                      <i className="icon">
                        <svg
                          width="14"
                          height="9"
                          viewBox="0 0 14 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 3.76172H10.6172L7.94531 1.05469L9 0L13.5 4.5L9 9L7.94531 7.94531L10.6172 5.23828H0V3.76172Z"
                            fill="white"
                          />
                        </svg>
                      </i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="c-services__item feature-card">
                <div className="card-icon">💬</div>
                <h3>Real-time Collaboration</h3>
                <p>
                  Experience live coding interviews with video chat, code
                  editor, and instant feedback features.
                </p>
              </div>

              <div className="c-services__item action-card">
                <div className="card-icon">👥</div>
                <h3>Be an Interviewer</h3>
                <p>
                  Share your expertise and conduct interviews for aspiring
                  candidates.
                </p>
                <Link to="/find-candidate">
                  <button className="raise primary-btn">Get Started</button>
                </Link>
              </div>
            </ul>

            <div className="features-footer">
              <h3>Why Choose Interview Zone?</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <p>Realistic interview experience</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <p>Collaborative code editor</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <p>Video & chat support</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <p>Community-driven learning</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <Login></Login>
      )}
    </div>
  );
}
