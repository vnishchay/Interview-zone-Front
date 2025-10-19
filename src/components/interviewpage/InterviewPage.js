import React, { useState, useMemo, useEffect, useRef } from "react";
import TextEditor from "../texteditor/textEditor";
import Questions from "../question/questions";
import axios from "axios";
import "./interview.css";

import Video from "../videocall/video";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { headers, API_BASE } from "../config";
import { useAuth } from "../auth/authContext";
import socket from "../socket";
import { useInterviewLogger } from "../utils/useInterviewLogger";

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
  const [interviewDocId, setInterviewDocId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("Participant");
  const [currentUserName, setCurrentUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Stable header: derive from token so effects depending on headers don't rerun every render
  const token = (authState && authState.token) || localStorage.getItem("token");
  const header = useMemo(() => {
    try {
      if (typeof headers === "function") return headers();
      if (headers && typeof headers === "object" && headers.headers)
        return headers;
    } catch (e) {
      console.warn("[INTERVIEW PAGE] Could not resolve headers():", e);
    }
    return undefined;
  }, [token]);
  const fetchedInterviewRef = useRef(false);
  const fetchedQuestionsRef = useRef(false);

  // Determine host by role first (computed earlier), fall back to ID or username checks
  const authUserId =
    (authState.user && (authState.user.id || authState.user._id)) || null;
  const idMatch =
    authUserId && hostId ? String(authUserId) === String(hostId) : false;
  const nameMatch =
    currentUserName && hostName ? currentUserName === hostName : false;
  const isHost = currentUserRole === "Host" || idMatch || nameMatch;

  // Initialize logger and pick stable callbacks
  const logger = useInterviewLogger(interviewID, currentUserName);
  const { logJoin, logLeave } = logger || {};
  const history = useHistory();
  const leftRef = useRef(false);

  // debug render info removed

  // Fetch interview details
  useEffect(() => {
    if (fetchedInterviewRef.current) return;
    if (header !== undefined && interviewID) {
      fetchedInterviewRef.current = true;
      // debug: fetching interview data (silenced)
      axios
        .post(
          `${API_BASE}/interview/findfilter`,
          { interviewID: interviewID },
          header
        )
        .then((res) => {
          // debug: interview data received (silenced)
          if (res.status === 200 && res.data.data && res.data.data.length > 0) {
            const interview = res.data.data[0];
            setInterviewDocId(interview._id || interview.id || null);
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
                      `${API_BASE}/user/profile`,
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

                  // debug: current user role resolved (silenced)
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
  }, [interviewID, token, authState.user]);

  // Log user joining the interview
  useEffect(() => {
    if (currentUserName && interviewID && typeof logJoin === "function") {
      logJoin();
    }
  }, [currentUserName, interviewID, logJoin]);

  // Log user leaving (cleanup)
  useEffect(() => {
    return () => {
      // If the leave action was already triggered via the Leave button,
      // don't call logLeave again here to avoid duplicate records.
      if (leftRef.current) return;
      if (currentUserName && interviewID && typeof logLeave === "function") {
        try {
          logLeave();
        } catch (e) {
          /* swallow */
        }
      }
    };
  }, [currentUserName, interviewID, logLeave]);

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
        // Questions are host-private. Only apply incoming question-toggle events
        // if this client is the host. Other participants should ignore this so
        // their screen doesn't get distorted when interviewer opens/hides questions.
        if (isHost) {
          setShowQuestions(data.enabled);
        }
      }
    };
    socket.on("toggle-editor", onToggleEditor);
    socket.on("toggle-questions", onToggleQuestions);
    return () => {
      socket.off("toggle-editor", onToggleEditor);
      socket.off("toggle-questions", onToggleQuestions);
    };
  }, [isHost]);

  // Fetch questions
  useEffect(() => {
    if (fetchedQuestionsRef.current) return;
    if (header !== undefined) {
      fetchedQuestionsRef.current = true;
      // debug: fetching questions (silenced)
      axios
        .get(`${API_BASE}/question/get`, header)
        .then((res) => {
          // debug: questions received (silenced)
          setquestions(res.data.data || []);
        })
        .catch((err) => {
          console.error("[INTERVIEW PAGE] Error fetching questions:", err);
          setquestions([]);
        });
    }
  }, [token]);

  // debug: current state (silenced)

  const handleQuestionsUpdate = (updatedQuestions) => {
    setquestions(updatedQuestions);
    // Save questions to database
    if (logger && logger.saveFinalQuestions) {
      logger.saveFinalQuestions(updatedQuestions);
    }
  };

  // Host-only: end the interview (mark endTime and archive)
  const handleEndInterview = async () => {
    if (!interviewDocId) {
      return alert("Cannot determine interview document id");
    }
    if (!header) {
      return alert("You must be authenticated to end the interview");
    }
    try {
      const payload = { endTime: new Date().toISOString(), archived: true };
      await axios.patch(
        `${API_BASE}/interview/update/${interviewDocId}`,
        payload,
        header
      );
      // After ending, navigate to home (host left) so session is over locally.
      history.push("/");
    } catch (err) {
      console.error("[INTERVIEW PAGE] Error ending interview:", err);
      alert("Failed to end interview. Please try again.");
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

  // When the questions panel is hidden, expand the video area to occupy the right column
  // (both rows) so video isn't cramped. Applies to both host and candidate.
  const videoExpandRight = !showQuestions;

  return (
    <div className="interview-container">
      {/* Dev debug overlay removed */}
      {/* Leave button moved into control panel to sit adjacent to settings */}

      {/* Control Panel - visible to Host and Candidate */}
      {(isHost || currentUserRole === "Candidate") && (
        <div className="control-panel">
          <div className="host-settings">
            {isHost && (
              <>
                <button
                  className="settings-btn"
                  aria-label="Open settings"
                  onClick={() => setShowSettings((s) => !s)}
                >
                  ⚙️
                </button>
              </>
            )}

            {isHost && (
              <button
                className="end-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to end this interview? This will archive the session."
                    )
                  ) {
                    handleEndInterview();
                  }
                }}
              >
                End Interview
              </button>
            )}

            <button
              className="leave-btn"
              onClick={() => {
                // Prevent duplicate leave actions
                if (leftRef.current) return;
                leftRef.current = true;
                try {
                  if (typeof logLeave === "function") logLeave();
                } catch (e) {}
                // Notify server/peers that this user is leaving the room.
                // Emitting a leave event lets the Video component and server
                // handle remote 'user-left' cleanup without forcibly tearing
                // down the socket which can cause odd reinitialization behavior
                try {
                  if (
                    socket &&
                    typeof socket.emit === "function" &&
                    interviewID
                  ) {
                    socket.emit("leave-room", { roomId: interviewID });
                  }
                  // Also dispatch a local event so the Video component (same page)
                  // can perform immediate cleanup without waiting for any server
                  // acknowledgement or broadcast.
                  try {
                    window.dispatchEvent(
                      new CustomEvent("local-leave", {
                        detail: { roomId: interviewID },
                      })
                    );
                  } catch (e) {
                    /* swallow */
                  }
                } catch (e) {
                  /* swallow */
                }
                // Give a short moment for cleanup in child components (media tracks etc.)
                setTimeout(() => history.push("/"), 120);
              }}
            >
              Leave
            </button>

            {isHost && showSettings && (
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
