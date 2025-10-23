import React, { useState } from "react";
import { v4 } from "uuid";
import { useAuth } from "../auth/authContext";
import { useHistory } from "react-router-dom";
import "./_home.css";
import "./home.css";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import axios from "axios";
import { headers, API_BASE } from "../config";

export const create = (history) => {
  const header = headers();
  const id = v4();
  try {
    if (!header) {
      // Not authenticated - redirect to login
      history.push("/login");
      return;
    }
    axios
      .post(`${API_BASE}/interview/create`, { interviewID: id }, header)
      .then((res) => {
        if (res.statusText === "OK") {
          history.push(`/setup/${id}`);
        }
      });
  } catch (err) {
    // error creating interview (silenced)
  }
};

export default function Home() {
  const { state } = useAuth();
  const history = useHistory();
  const [url, seturl] = useState();

  const find = () => {
    const header = headers();
    const id = url.split("/");
    if (!header) {
      // Not authenticated - send user to login before trying to join
      history.push("/login");
      return;
    }
    // Try to find the interview and join
    axios
      .post(
        `${API_BASE}/interview/findfilter`,
        { interviewID: id[id.length - 1] },
        header
      )
      .then((res) => {
        if (res.statusText === "OK") {
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
      })
      .catch(() => {
        // ignore errors here
      });
  };
  return (
    <div className="home-wrapper">
      <Navbar />

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
              Enhance your skills with structured interview practice sessions.
              Get ready for technical interviews with our comprehensive
              platform.
            </p>
          </div>

          <div className="c-services__item action-card">
            <div className="card-icon">🎯</div>
            <h3>Find an Interviewer</h3>
            <p>
              Connect with experienced interviewers who can help you prepare.
            </p>
            <Link to="/find-host">
              <button className="raise primary-btn">Browse Interviewers</button>
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
              Experience live coding interviews with video chat, code editor,
              and instant feedback features.
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
    </div>
  );
}
