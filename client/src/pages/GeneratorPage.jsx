import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import AppHeader from "../components/AppHeader";
import "./GeneratorPage.css";
import jsPDF from "jspdf";

function OutputCard({ title, children }) {
  return (
    <section className="output-section-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TaskItem({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="task-item">
      <p className="task-question">{question}</p>

      <button
        className="toggle-answer-btn"
        onClick={() => setShowAnswer((prev) => !prev)}
      >
        {showAnswer ? "Hide answer" : "Show answer"}
      </button>

      {showAnswer && (
        <p className="task-answer">
          <strong>Answer:</strong> {answer}
        </p>
      )}
    </div>
  );
}

export default function GeneratorPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("Maths");
  const [difficulty, setDifficulty] = useState("Level 1");
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  const handleGenerate = async () => {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate lesson");
      }

      setLesson(data);
    } catch (error) {
      console.error(error);
      showMessage("error", "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!lesson) return;

    const formattedText = `
Topic Simplifier Output

Request:
${prompt}

Subject: ${subject}
Difficulty: ${difficulty}

Simple Explanation:
${lesson.simpleExplanation?.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Worked Examples:
${lesson.workedExamples
  ?.map(
    (example, index) =>
      `${index + 1}. ${example.question}\n` +
      `${example.steps
        ?.map((step, stepIndex) => `   ${stepIndex + 1}. ${step}`)
        .join("\n")}\n` +
      `Answer: ${example.answer}`,
  )
  .join("\n\n")}

Mini Tasks:
${lesson.miniTasks
  ?.map(
    (task, index) => `${index + 1}. ${task.question}\nAnswer: ${task.answer}`,
  )
  .join("\n\n")}
    `.trim();

    try {
      await navigator.clipboard.writeText(formattedText);
      showMessage("success", "Lesson copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      showMessage("error", "Copy failed. Please try again.");
    }
  };

  const handleExportPDF = () => {
    if (!lesson) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");

      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, margin, y);
        y += 7;
      });
    };

    addText("Topic Simplifier Output", 18, true);
    y += 5;

    addText(`Request: ${prompt}`, 11, true);
    addText(`Subject: ${subject}`);
    addText(`Difficulty: ${difficulty}`);
    y += 5;

    addText("Simple Explanation", 14, true);
    lesson.simpleExplanation?.forEach((item, index) => {
      addText(`${index + 1}. ${item}`);
    });
    y += 5;

    addText("Worked Examples", 14, true);
    lesson.workedExamples?.forEach((example, index) => {
      addText(`${index + 1}. ${example.question}`, 11, true);

      example.steps?.forEach((step, stepIndex) => {
        addText(`   ${stepIndex + 1}. ${step}`);
      });

      addText(`Answer: ${example.answer}`, 11, true);
      y += 4;
    });

    addText("Mini Tasks", 14, true);
    lesson.miniTasks?.forEach((task, index) => {
      addText(`${index + 1}. ${task.question}`);
      addText(`Answer: ${task.answer}`, 11, true);
      y += 3;
    });

    doc.save("topic-simplifier-output.pdf");

    showMessage("success", "PDF exported");
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
            <label className="input-label" htmlFor="lesson-prompt">
              What would you like help with?
            </label>

            <textarea
              id="lesson-prompt"
              className="generator-textarea"
              placeholder="e.g. Explain percentages for a Level 1 learner"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="5"
            />

            <p
              className="example-prompt"
              onClick={() =>
                setPrompt("Explain percentages for a Level 1 learner")
              }
            >
              Try: "Explain percentages for a Level 1 learner"
            </p>

            <div className="generator-controls">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option>Maths</option>
                  <option>English</option>
                  <option>General explanation</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
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
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading
                ? "Simplifying..."
                : !prompt.trim()
                  ? "Enter a topic first"
                  : "Simplify Topic"}
            </button>
          </section>

          <section className="generator-meta">
            <div className="meta-pill">Subject: {subject}</div>
            <div className="meta-pill">Difficulty: {difficulty}</div>
          </section>

          {lesson && (
            <section className="generator-output">
              <div className="output-topbar">
                <h2>Your lesson output</h2>

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

                  <button
                    className="secondary-action-btn"
                    onClick={handleExportPDF}
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="output-grid">
                <OutputCard title="Simple Explanation">
                  <ul className="output-list">
                    {lesson.simpleExplanation?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </OutputCard>

                <OutputCard title="Worked Examples">
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
                </OutputCard>

                <OutputCard title="Mini Tasks">
                  <div className="tasks-list">
                    {lesson.miniTasks?.map((task, index) => (
                      <TaskItem
                        key={index}
                        question={task.question}
                        answer={task.answer}
                      />
                    ))}
                  </div>
                </OutputCard>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
