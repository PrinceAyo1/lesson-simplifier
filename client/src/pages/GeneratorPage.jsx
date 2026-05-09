import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import AppHeader from "../components/AppHeader";
import "./GeneratorPage.css";

export default function GeneratorPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("Maths");
  const [difficulty, setDifficulty] = useState("Level 1");

  const [lesson, setLesson] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);
  };

  const handleGenerateLesson = async () => {
    try {
      if (!prompt.trim()) return;

      setIsLoading(true);

      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          subject,
          difficulty,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Generation failed");
      }

      setLesson(result);
    } catch (error) {
      console.error(error);

      showMessage("error", "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (!lesson) return;

      const formattedLesson = `
TOPIC:
${prompt}

SUBJECT:
${subject}

LEVEL:
${difficulty}

SIMPLE EXPLANATION:
${lesson.simpleExplanation.join("\n")}

WORKED EXAMPLES:
${lesson.workedExamples
  .map(
    (example, index) =>
      `${index + 1}. ${example.question}\n` +
      `${example.steps
        .map((step, stepIndex) => `   ${stepIndex + 1}. ${step}`)
        .join("\n")}\n` +
      `Answer: ${example.answer}`,
  )
  .join("\n\n")}

MINI TASKS:
${lesson.miniTasks
  .map(
    (task, index) => `${index + 1}. ${task.question}\nAnswer: ${task.answer}`,
  )
  .join("\n\n")}
`;

      await navigator.clipboard.writeText(formattedLesson);

      showMessage("success", "Lesson copied to clipboard");
    } catch (error) {
      console.error(error);

      showMessage("error", "Copy failed. Please try again.");
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (!lesson) return;

      setIsSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        showMessage("error", "Please log in to save lessons.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          prompt,
          subject,
          difficulty,
          simpleExplanation: lesson.simpleExplanation,
          workedExamples: lesson.workedExamples,
          miniTasks: lesson.miniTasks,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save lesson");
      }

      showMessage("success", "Lesson saved");
    } catch (error) {
      console.error(error);

      showMessage("error", error.message || "Could not save lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AppHeader />

      <main className="generator-page">
        <div className="generator-container">
          <section className="generator-header">
            <p className="generator-eyebrow">Topic Simplifier</p>

            <h1>Make a difficult topic easier to understand</h1>

            <p className="generator-subtext">
              Enter a topic or question and generate a simple explanation,
              practical examples, and mini tasks in seconds.
            </p>
          </section>

          {message.text && (
            <div className={`app-message app-message--${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="generator-top-actions">
            <button
              className="secondary-action-btn"
              onClick={() => navigate("/app/saved")}
            >
              View Saved Lessons
            </button>
          </div>

          <section className="generator-input-card">
            <div className="input-group">
              <label className="input-label" htmlFor="lesson-prompt">
                What would you like help with?
              </label>

              <textarea
                id="lesson-prompt"
                className="lesson-textarea"
                placeholder="e.g. Explain percentages for a Level 1 learner"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="generator-controls">
              <div className="input-group">
                <label className="input-label">Subject</label>

                <select
                  className="generator-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option>Maths</option>
                  <option>English</option>
                  <option>General explanation</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Difficulty</label>

                <select
                  className="generator-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Entry Level</option>
                  <option>Level 1</option>
                  <option>Level 2</option>
                  <option>GCSE Foundation Tier</option>
                  <option>GCSE Higher Tier</option>
                </select>
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateLesson}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading
                ? "Simplifying..."
                : !prompt.trim()
                  ? "Enter a topic first"
                  : "Simplify Topic"}
            </button>
          </section>

          {lesson && (
            <section className="output-section">
              <div className="output-actions">
                <button className="secondary-action-btn" onClick={handleCopy}>
                  Copy
                </button>

                <button
                  className="secondary-action-btn"
                  onClick={handleSaveLesson}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="output-grid">
                <article className="output-section-card">
                  <h2>Simple Explanation</h2>

                  <ul className="output-list">
                    {lesson.simpleExplanation?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="output-section-card">
                  <h2>Worked Examples</h2>

                  <div className="worked-examples-list">
                    {lesson.workedExamples?.map((example, index) => (
                      <div key={index} className="worked-example-item">
                        <p className="worked-example-question">
                          <strong>Question:</strong> {example.question}
                        </p>

                        <div className="worked-example-steps">
                          <strong>Working:</strong>

                          <ul className="output-list">
                            {example.steps?.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        <p className="worked-example-answer">
                          <strong>Answer:</strong> {example.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="output-section-card">
                  <h2>Mini Tasks</h2>

                  <div className="mini-task-list">
                    {lesson.miniTasks?.map((task, index) => (
                      <div key={index} className="mini-task-item">
                        <p>
                          <strong>Question:</strong> {task.question}
                        </p>

                        <details>
                          <summary>Show Answer</summary>

                          <p>{task.answer}</p>
                        </details>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
