import React, { useState } from "react";
import TextEditor from "../texteditor/textEditor";
import Questions from "../question/questions";
import axios from "axios";
import "./interview.css";
import { useEffect } from "react";
import Video from "../videocall/video";
import { useLocation, useParams } from "react-router-dom";
import headers from "../config.js";
import { useAuth } from "../auth/authContext";
import socket from "../socket";
import { useInterviewLogger } from "../utils/useInterviewLogger";
require("dotenv").config();

export default function InterviewPage() {
  const location = useLocation();
  const { id: interviewID } = useParams();
  const { state: authState } = useAuth();
  const { constraints } = location.state || {
    constraints: { video: true, audio: true },
  };
  const [questions, setquestions] = useState([]);
  const [hostName, setHostName] = useState("Host");
  const [candidateName, setCandidateName] = useState("Candidate");
  const [hostId, setHostId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("Participant");
  const [currentUserName, setCurrentUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const header = headers();

  // Initialize logger
  const logger = useInterviewLogger(interviewID, currentUserName);

  console.log("[INTERVIEW PAGE] Rendering with interviewID:", interviewID);

  // Fetch interview details
  useEffect(() => {
    if (header !== undefined && interviewID) {
      console.log("[INTERVIEW PAGE] Fetching interview data...");
      axios
        .post(
          "http://localhost:3001/interview/findfilter",
          { interviewID: interviewID },
          header
        )
        .then((res) => {
          console.log("[INTERVIEW PAGE] Interview data received:", res.data);
          if (res.status === 200 && res.data.data && res.data.data.length > 0) {
            const interview = res.data.data[0];
            setHostName(interview.hostname || "Host");
            setCandidateName(interview.candidatename || "Candidate");
            setHostId(interview.idOfHost || null);
            setParticipantId(interview.idOfParticipant || null);

            // Determine current user's role. Prefer the canonical server-side profile
            // so we compare authoritative id/username values (avoids stale localStorage shapes).
            if (authState.user) {
              (async () => {
                try {
                  let profileUsername = authState.user.username;
                  let profileId =
                    authState.user.id || authState.user._id || null;

                  // Try to fetch canonical profile from backend
                  if (header) {
                    const profileRes = await axios.get(
                      "http://localhost:3001/user/profile",
                      header
                    );
                    const profileData =
                      (profileRes.data && profileRes.data.data) ||
                      profileRes.data ||
                      null;
                    if (profileData) {
                      // profileData may be the object or an array; handle both
                      const p = Array.isArray(profileData)
                        ? profileData[0]
                        : profileData;
                      profileUsername = p.username || p.name || profileUsername;
                      profileId = p._id || p.id || profileId;
                    }
                  }

                  const currentUsername = profileUsername;
                  const currentUserId = profileId;
                  setCurrentUserName(currentUsername);

                  // Prefer ID-based check if possible
                  if (
                    currentUserId &&
                    interview.idOfHost &&
                    String(currentUserId) === String(interview.idOfHost)
                  ) {
                    setCurrentUserRole("Host");
                  } else if (
                    currentUserId &&
                    interview.idOfParticipant &&
                    String(currentUserId) === String(interview.idOfParticipant)
                  ) {
                    setCurrentUserRole("Candidate");
                  } else if (currentUsername === interview.hostname) {
                    setCurrentUserRole("Host");
                  } else if (currentUsername === interview.candidatename) {
                    setCurrentUserRole("Candidate");
                  } else {
                    setCurrentUserRole("Observer");
                  }

                  console.log(
                    "[INTERVIEW PAGE] Current user:",
                    currentUsername,
                    "Role:",
                    currentUserId &&
                      interview.idOfHost &&
                      String(currentUserId) === String(interview.idOfHost)
                      ? "Host"
                      : currentUsername === interview.hostname
                      ? "Host"
                      : "Candidate"
                  );
                } catch (err) {
                  console.warn(
                    "[INTERVIEW PAGE] Could not fetch canonical profile, falling back to local authState:",
                    err.message || err
                  );
                  // Fallback to previously used logic
                  const currentUsername = authState.user.username;
                  const currentUserId =
                    authState.user.id || authState.user._id || null;
                  setCurrentUserName(currentUsername);

                  if (
                    currentUserId &&
                    interview.idOfHost &&
                    String(currentUserId) === String(interview.idOfHost)
                  ) {
                    setCurrentUserRole("Host");
                  } else if (
                    currentUserId &&
                    interview.idOfParticipant &&
                    String(currentUserId) === String(interview.idOfParticipant)
                  ) {
                    setCurrentUserRole("Candidate");
                  } else if (currentUsername === interview.hostname) {
                    setCurrentUserRole("Host");
                  } else if (currentUsername === interview.candidatename) {
                    setCurrentUserRole("Candidate");
                  } else {
                    setCurrentUserRole("Observer");
                  }
                }
              })();
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("[INTERVIEW PAGE] Error fetching interview data:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [interviewID, header, authState.user]);

  // Log user joining the interview
  useEffect(() => {
    if (currentUserName && interviewID && logger) {
      logger.logJoin();
    }
  }, [currentUserName, interviewID, logger]);

  // Log user leaving (cleanup)
  useEffect(() => {
    return () => {
      if (currentUserName && interviewID && logger) {
        logger.logLeave();
      }
    };
  }, [currentUserName, interviewID, logger]);

  // Listen for room-level UI toggles from host
  useEffect(() => {
    if (!socket) return;
    const onToggleEditor = (data) => {
      if (data && typeof data.enabled === "boolean") {
        setShowEditor(data.enabled);
      }
    };
    const onToggleQuestions = (data) => {
      if (data && typeof data.enabled === "boolean") {
        setShowQuestions(data.enabled);
      }
    };
    socket.on("toggle-editor", onToggleEditor);
    socket.on("toggle-questions", onToggleQuestions);
    return () => {
      socket.off("toggle-editor", onToggleEditor);
      socket.off("toggle-questions", onToggleQuestions);
    };
  }, []);

  // Fetch questions
  useEffect(() => {
    if (header !== undefined) {
      console.log("[INTERVIEW PAGE] Fetching questions...");
      axios
        .get("http://localhost:3001/question/get", header)
        .then((res) => {
          console.log("[INTERVIEW PAGE] Questions received:", res.data);
          setquestions(res.data.data || []);
        })
        .catch((err) => {
          console.error("[INTERVIEW PAGE] Error fetching questions:", err);
          setquestions([]);
        });
    }
  }, [header]);

  console.log("[INTERVIEW PAGE] Current state:", {
    hostName,
    candidateName,
    currentUserRole,
    questionsCount: questions?.length,
    participantId,
    loading,
  });

  const handleQuestionsUpdate = (updatedQuestions) => {
    setquestions(updatedQuestions);
    // Save questions to database
    if (logger && logger.saveFinalQuestions) {
      logger.saveFinalQuestions(updatedQuestions);
    }
  };

  if (loading) {
    return (
      <div className="interview-container">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  // Determine host by role first (computed earlier), fall back to ID or username checks
  const authUserId =
    (authState.user && (authState.user.id || authState.user._id)) || null;
  const idMatch =
    authUserId && hostId ? String(authUserId) === String(hostId) : false;
  const nameMatch =
    currentUserName && hostName ? currentUserName === hostName : false;
  const isHost = currentUserRole === "Host" || idMatch || nameMatch;

  // When candidate is viewing and the questions panel is hidden,
  // expand the video area to occupy the right column (both rows) so video isn't cramped.
  const videoExpandRight = !isHost && !showQuestions;

  return (
    <div className="interview-container">
      {/* Dev debug overlay removed */}
      {/* Control Panel - Only visible to Host */}
      {isHost && (
        <div className="control-panel">
          <div className="host-settings">
            <button
              className="settings-btn"
              aria-label="Open settings"
              onClick={() => setShowSettings((s) => !s)}
            >
              ⚙️
            </button>

            {showSettings && (
              <div className="settings-menu">
                <div className="settings-item">
                  <label>Show Code Editor</label>
                  <div
                    className={`toggle-switch ${showEditor ? "toggle-on" : ""}`}
                    onClick={() => {
                      const newVal = !showEditor;
                      setShowEditor(newVal);
                      // emit to room so participants update their view
                      if (socket && interviewID) {
                        socket.emit("toggle-editor", {
                          roomId: interviewID,
                          enabled: newVal,
                        });
                      }
                    }}
                    role="switch"
                    aria-checked={showEditor}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>
                <div className="settings-item">
                  <label>Show Questions (private)</label>
                  <div
                    className={`toggle-switch ${
                      showQuestions ? "toggle-on" : ""
                    }`}
                    onClick={() => {
                      const newVal = !showQuestions;
                      setShowQuestions(newVal);
                      if (socket && interviewID) {
                        socket.emit("toggle-questions", {
                          roomId: interviewID,
                          enabled: newVal,
                        });
                      }
                    }}
                    role="switch"
                    aria-checked={showQuestions}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Interview Content */}
      {/* Floating bottom settings removed: settings are available only in the top control-panel */}
      <div
        className={`container ${
          !showEditor && !showQuestions ? "video-only" : ""
        } ${videoExpandRight ? "video-expand-right" : ""}`}
      >
        {showEditor && (
          <div className="TextArea">
            <TextEditor />
          </div>
        )}
        {showQuestions && isHost && (
          <div className="Questions">
            <Questions
              questions={questions}
              isHost={isHost}
              onQuestionsUpdate={handleQuestionsUpdate}
              logger={logger}
            />
          </div>
        )}
        <div className="VideoCall">
          <Video
            constraints={constraints}
            hostName={hostName}
            candidateName={candidateName}
            currentUserName={currentUserName}
            authUserName={authState.user && authState.user.username}
            authUserId={authUserId}
            hostId={hostId}
            participantId={participantId}
            logger={logger}
          />
        </div>
      </div>
    </div>
  );
}
