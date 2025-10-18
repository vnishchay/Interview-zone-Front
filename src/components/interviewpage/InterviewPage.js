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
  const [currentUserRole, setCurrentUserRole] = useState("Participant");
  const [currentUserName, setCurrentUserName] = useState("");
  const [loading, setLoading] = useState(true);
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

            // Determine current user's role
            if (authState.user) {
              const currentUsername = authState.user.username;
              setCurrentUserName(currentUsername);

              if (currentUsername === interview.hostname) {
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
                currentUsername === interview.hostname ? "Host" : "Candidate"
              );
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

  const isHost = currentUserName === hostName;

  return (
    <div className="interview-container">
      {/* Main Interview Content */}
      <div className="container">
        <div className="TextArea">
          <TextEditor />
        </div>
        <div className="Questions">
          <Questions
            questions={questions}
            isHost={isHost}
            onQuestionsUpdate={handleQuestionsUpdate}
            logger={logger}
          />
        </div>
        <div className="VideoCall">
          <Video
            constraints={constraints}
            hostName={hostName}
            candidateName={candidateName}
            currentUserName={currentUserName}
            logger={logger}
          />
        </div>
      </div>
    </div>
  );
}
