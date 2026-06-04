import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AppHeader from "../components/AppHeader";
import "./SavedLessonsPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SavedLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        setError("Please log in to view saved topics.");
        setLessons([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/lessons/${user.id}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch lessons");
      }

      setLessons(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load saved topics.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this saved lesson?",
      );

      if (!confirmed) return;

      const response = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete lesson");
      }

      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(null);
      }

      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
      showMessage("success", "Lesson deleted");
    } catch (err) {
      console.error(err);
      showMessage("error", err.message || "Could not delete lesson.");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <>
      <AppHeader />

      <main className="saved-lessons-page">
        <div className="saved-lessons-container">
          <section className="saved-lessons-header">
            <p className="saved-lessons-eyebrow">Saved Topics</p>
            <h1>Your saved topics and revision support</h1>
            <p className="saved-lessons-subtext">
              Revisit saved explanations, worked examples, and mini tasks
              anytime.
            </p>
          </section>

          {message.text && (
            <div className={`app-message app-message--${message.type}`}>
              {message.text}
            </div>
          )}

          {loading && (
            <p className="saved-state-message">Loading saved topics...</p>
          )}

          {!loading && error && (
            <div className="saved-state-card">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && lessons.length === 0 && (
            <div className="saved-state-card">
              <h2>No saved topics yet</h2>
              <p>
                Generate a topic, then save it to build your own revision
                library.
              </p>
            </div>
          )}

          {!loading && !error && lessons.length > 0 && (
            <div className="saved-lessons-layout">
              <section className="saved-lessons-list">
                {lessons.map((lesson) => (
                  <article
                    key={lesson.id}
                    className={`saved-lesson-card ${
                      selectedLesson?.id === lesson.id
                        ? "saved-lesson-card--active"
                        : ""
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="saved-lesson-card__top">
                      <h3>{lesson.prompt}</h3>

                      <button
                        className="delete-lesson-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(lesson.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="saved-lesson-meta">
                      <span>{lesson.subject}</span>
                      <span>{lesson.difficulty}</span>
                    </div>

                    <p className="saved-lesson-date">
                      Saved {formatDate(lesson.created_at)}
                    </p>
                  </article>
                ))}
              </section>

              <section className="saved-lesson-detail">
                {selectedLesson ? (
                  <>
                    <div className="saved-detail-card">
                      <h2>{selectedLesson.prompt}</h2>

                      <div className="saved-lesson-meta saved-lesson-meta--detail">
                        <span>{selectedLesson.subject}</span>
                        <span>{selectedLesson.difficulty}</span>
                        <span>{formatDate(selectedLesson.created_at)}</span>
                      </div>
                    </div>

                    <div className="saved-detail-card">
                      <h3>Simple Explanation</h3>
                      <ul className="saved-detail-list">
                        {(selectedLesson.simple_explanation || []).map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="saved-detail-card">
                      <h3>Worked Examples</h3>

                      <div className="saved-worked-examples">
                        {(selectedLesson.worked_examples || []).map(
                          (example, index) => (
                            <div key={index} className="saved-worked-example">
                              <p>
                                <strong>Question:</strong> {example.question}
                              </p>

                              <div>
                                <strong>Working:</strong>
                                <ul className="saved-detail-list">
                                  {(example.steps || []).map(
                                    (step, stepIndex) => (
                                      <li key={stepIndex}>{step}</li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              <p>
                                <strong>Answer:</strong> {example.answer}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="saved-detail-card">
                      <h3>Mini Tasks</h3>

                      <div className="saved-mini-tasks">
                        {(selectedLesson.mini_tasks || []).map(
                          (task, index) => (
                            <div key={index} className="saved-mini-task">
                              <p>
                                <strong>Question:</strong> {task.question}
                              </p>
                              <p>
                                <strong>Answer:</strong> {task.answer}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="saved-state-card">
                    <h2>Select a saved lesson</h2>
                    <p>
                      Choose a lesson from the list to view the full
                      explanation, worked examples, and mini tasks.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
