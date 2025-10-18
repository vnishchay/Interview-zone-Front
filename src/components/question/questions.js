import React, { useState } from "react";
import "./questions.css";
import QuestionWidget from "./questionwidget";

export default function Questions({
  questions,
  isHost,
  onQuestionsUpdate,
  logger,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  const handleQuestionSelect = (questionId) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleRemoveSelected = () => {
    const count = selectedQuestions.size;
    const updatedQuestions = questions.filter(
      (q) => !selectedQuestions.has(q._id || q.id)
    );
    onQuestionsUpdate(updatedQuestions);
    setSelectedQuestions(new Set());

    // Log the deletion
    if (logger && logger.logQuestionDelete) {
      logger.logQuestionDelete(count);
    }
  };

  const handleAddQuestion = () => {
    setShowAddForm(true);
  };

  return (
    <div className="questions-container">
      <div className="questions-header">
        <div className="header-left">
          <h3>Interview Questions</h3>
          <span className="questions-count">
            {questions?.length || 0} Questions
          </span>
        </div>
        {isHost && (
          <div className="header-actions">
            {selectedQuestions.size > 0 && (
              <button className="btn-remove" onClick={handleRemoveSelected}>
                🗑️ Remove ({selectedQuestions.size})
              </button>
            )}
            <button className="btn-add" onClick={handleAddQuestion}>
              ➕ Add Question
            </button>
          </div>
        )}
      </div>

      <div className="questions-list">
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <QuestionWidget
              key={question.id || index}
              question={question}
              index={index + 1}
              isHost={isHost}
              isSelected={selectedQuestions.has(question.id)}
              onSelect={() => handleQuestionSelect(question.id)}
              onUpdate={(updated) => {
                const updatedQuestions = questions.map((q) =>
                  q.id === updated.id ? updated : q
                );
                onQuestionsUpdate(updatedQuestions);

                // Log the edit
                if (logger && logger.logQuestionEdit) {
                  logger.logQuestionEdit(updated);
                }
              }}
            />
          ))
        ) : (
          <div className="no-questions">
            <p>No questions available</p>
            {isHost && (
              <button className="btn-add-first" onClick={handleAddQuestion}>
                ➕ Add Your First Question
              </button>
            )}
          </div>
        )}
      </div>

      {showAddForm && (
        <QuestionFormModal
          onClose={() => setShowAddForm(false)}
          onAdd={(newQuestion) => {
            onQuestionsUpdate([...questions, newQuestion]);
            setShowAddForm(false);

            // Log the addition
            if (logger && logger.logQuestionAdd) {
              logger.logQuestionAdd(newQuestion);
            }
          }}
        />
      )}
    </div>
  );
}

function QuestionFormModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    questionTitle: "",
    questionExample: "",
    questionOutput: "",
    questionLevel: "0",
    questionCategory: "General",
    bestSolution: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    onAdd(newQuestion);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Question</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label>Question Title *</label>
            <input
              type="text"
              required
              value={formData.questionTitle}
              onChange={(e) =>
                setFormData({ ...formData, questionTitle: e.target.value })
              }
              placeholder="Enter the question..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                value={formData.questionLevel}
                onChange={(e) =>
                  setFormData({ ...formData, questionLevel: e.target.value })
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
                value={formData.questionCategory}
                onChange={(e) =>
                  setFormData({ ...formData, questionCategory: e.target.value })
                }
                placeholder="e.g., Arrays, Strings..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Example</label>
            <textarea
              rows="3"
              value={formData.questionExample}
              onChange={(e) =>
                setFormData({ ...formData, questionExample: e.target.value })
              }
              placeholder="Provide an example..."
            />
          </div>

          <div className="form-group">
            <label>Expected Output</label>
            <textarea
              rows="2"
              value={formData.questionOutput}
              onChange={(e) =>
                setFormData({ ...formData, questionOutput: e.target.value })
              }
              placeholder="Expected output or explanation..."
            />
          </div>

          <div className="form-group">
            <label>Solution (Optional)</label>
            <textarea
              rows="5"
              value={formData.bestSolution}
              onChange={(e) =>
                setFormData({ ...formData, bestSolution: e.target.value })
              }
              placeholder="Provide the best solution..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
