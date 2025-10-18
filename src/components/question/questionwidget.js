import React, { useState } from "react";
import "./questionWidget.css";

export default function QuestionWidget({
  question,
  index,
  isHost,
  isSelected,
  onSelect,
  onUpdate,
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(question);

  // Map level numbers to readable text
  const getLevelText = (level) => {
    const levels = {
      "0": "Easy",
      "1": "Medium",
      "2": "Hard",
      "3": "Expert",
    };
    return levels[level] || "Unknown";
  };

  // Decode category if it's hex encoded
  const decodeCategory = (category) => {
    if (!category) return "General";
    try {
      // Check if it's hex encoded
      if (/^[0-9a-f]+$/i.test(category)) {
        const decoded = category
          .match(/.{1,2}/g)
          ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
          .join("");
        return decoded || category;
      }
      return category;
    } catch (e) {
      return category;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(question);
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(question);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="question-card editing">
        <div className="edit-form">
          <div className="form-header">
            <h4>✏️ Edit Question {index}</h4>
            <div className="form-actions-inline">
              <button className="btn-save" onClick={handleSave}>
                💾 Save
              </button>
              <button className="btn-cancel-edit" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Question Title</label>
            <input
              type="text"
              value={editData.questionTitle}
              onChange={(e) =>
                setEditData({ ...editData, questionTitle: e.target.value })
              }
            />
          </div>

          <div className="form-row-inline">
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={editData.questionLevel}
                onChange={(e) =>
                  setEditData({ ...editData, questionLevel: e.target.value })
                }
              >
                <option value="0">Easy</option>
                <option value="1">Medium</option>
                <option value="2">Hard</option>
                <option value="3">Expert</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={decodeCategory(editData.questionCategory)}
                onChange={(e) =>
                  setEditData({ ...editData, questionCategory: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Example</label>
            <textarea
              rows="2"
              value={editData.questionExample}
              onChange={(e) =>
                setEditData({ ...editData, questionExample: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Expected Output</label>
            <textarea
              rows="2"
              value={editData.questionOutput?.replace(/"/g, "") || ""}
              onChange={(e) =>
                setEditData({ ...editData, questionOutput: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Solution</label>
            <textarea
              rows="3"
              value={editData.bestSolution?.replace(/"/g, "") || ""}
              onChange={(e) =>
                setEditData({ ...editData, bestSolution: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`question-card ${isSelected ? "selected" : ""}`}>
      {isHost && (
        <div className="question-selector">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="question-checkbox"
          />
        </div>
      )}

      <div className="question-header">
        <div className="question-header-left">
          <span className="question-number">Q{index}</span>
          <div className="question-meta">
            <span
              className={`difficulty-badge ${getLevelText(
                question.questionLevel
              ).toLowerCase()}`}
            >
              {getLevelText(question.questionLevel)}
            </span>
            <span className="category-badge">
              {decodeCategory(question.questionCategory)}
            </span>
          </div>
        </div>
        {isHost && !isSelected && (
          <button
            className="btn-edit"
            onClick={handleEdit}
            title="Edit question"
          >
            ✏️
          </button>
        )}
      </div>

      <div className="question-content">
        <h4 className="question-title">{question.questionTitle}</h4>

        {question.questionExample && (
          <div className="question-section">
            <label>📝 Example:</label>
            <p>{question.questionExample}</p>
          </div>
        )}

        {question.questionOutput && question.questionOutput !== '""' && (
          <div className="question-section">
            <label>✅ Expected Output:</label>
            <p>{question.questionOutput.replace(/"/g, "")}</p>
          </div>
        )}

        {question.bestSolution && question.bestSolution !== '""' && (
          <div className="question-section solution-section">
            <button
              className="solution-toggle"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "🔽 Hide Solution" : "▶️ Show Solution"}
            </button>
            {showSolution && (
              <div className="solution-content">
                <pre>{question.bestSolution.replace(/"/g, "")}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// bestSolution: "\"\""
// createdAt: "2022-02-09T17:24:24.724Z"
// id: "6203f8c8f9787376e44a7eeb"
// questionCategory: "496e74726f64756374696f6e"
// questionExample: "Just tell about yourself"
// questionLevel: "0"
// questionOutput: "\"This is all about your intro\" "
// questionTitle: "Tell me about yourself"
// updatedAt:
