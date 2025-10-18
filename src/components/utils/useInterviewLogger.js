import { useCallback } from "react";
import axios from "axios";
import headers from "../config";

/**
 * Custom hook for logging interview session actions
 * @param {string} interviewID - The interview session ID
 * @param {string} userName - The current user's name
 * @returns {object} - Logger functions
 */
export const useInterviewLogger = (interviewID, userName) => {
  const logAction = useCallback(
    async (action, details = {}) => {
      try {
        if (!interviewID || !userName) {
          console.warn("[LOGGER] Missing interviewID or userName");
          return;
        }

        const header = headers();
        await axios.post(
          "http://localhost:3001/interview/log",
          {
            interviewID,
            action,
            userName,
            details,
          },
          header
        );

        console.log(`[SESSION LOG] ${userName} - ${action}:`, details);
      } catch (error) {
        console.error("[SESSION LOG ERROR]:", error);
      }
    },
    [interviewID, userName]
  );

  const logJoin = useCallback(() => {
    return logAction("join", { timestamp: new Date().toISOString() });
  }, [logAction]);

  const logLeave = useCallback(() => {
    return logAction("leave", { timestamp: new Date().toISOString() });
  }, [logAction]);

  const logVideoToggle = useCallback(
    (enabled) => {
      return logAction("video_toggle", { enabled });
    },
    [logAction]
  );

  const logAudioToggle = useCallback(
    (enabled) => {
      return logAction("audio_toggle", { enabled });
    },
    [logAction]
  );

  const logQuestionAdd = useCallback(
    (question) => {
      return logAction("question_add", {
        questionTitle: question.questionTitle,
        questionLevel: question.questionLevel,
        questionCategory: question.questionCategory,
      });
    },
    [logAction]
  );

  const logQuestionEdit = useCallback(
    (question) => {
      return logAction("question_edit", {
        questionId: question.id,
        questionTitle: question.questionTitle,
      });
    },
    [logAction]
  );

  const logQuestionDelete = useCallback(
    (count) => {
      return logAction("question_delete", { count });
    },
    [logAction]
  );

  const logCodeEdit = useCallback(
    (codeLength) => {
      return logAction("code_edit", { codeLength });
    },
    [logAction]
  );

  const saveCodeSnapshot = useCallback(
    async (code) => {
      try {
        const header = headers();
        await axios.post(
          "http://localhost:3001/interview/code",
          {
            interviewID,
            code,
          },
          header
        );
        console.log("[CODE SNAPSHOT] Saved successfully");
      } catch (error) {
        console.error("[CODE SNAPSHOT ERROR]:", error);
      }
    },
    [interviewID]
  );

  const saveFinalQuestions = useCallback(
    async (questions) => {
      try {
        const header = headers();
        await axios.post(
          "http://localhost:3001/interview/questions",
          {
            interviewID,
            questions,
          },
          header
        );
        console.log("[FINAL QUESTIONS] Saved successfully");
      } catch (error) {
        console.error("[FINAL QUESTIONS ERROR]:", error);
      }
    },
    [interviewID]
  );

  return {
    logJoin,
    logLeave,
    logVideoToggle,
    logAudioToggle,
    logQuestionAdd,
    logQuestionEdit,
    logQuestionDelete,
    logCodeEdit,
    saveCodeSnapshot,
    saveFinalQuestions,
  };
};
