import { useState } from "react";
import "./GeneratorPage.css";

const mockLesson = {
  simpleExplanation: [
    "A percentage means an amount out of 100.",
    "50% means 50 out of 100.",
    "You can also think of 50% as one half.",
    "To find a percentage, you work out that part of the total.",
  ],
  examples: [
    "If a £10 item has 20% off, 20% of £10 is £2, so the new price is £8.",
    "If you score 8 out of 10 in a quiz, that is 80%.",
    "If half the class is present, that means 50% of the class is there.",
  ],
  miniTasks: [
    { question: "What is 10% of 50?", answer: "5" },
    { question: "What is 25% of 40?", answer: "10" },
    { question: "What is 50% of 18?", answer: "9" },
  ],
};

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
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("Maths");
  const [difficulty, setDifficulty] = useState("Level 1");
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

      if (!response.ok) {
        throw new Error("Failed to generate lesson");
      }

      const data = await response.json();

      setLesson(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="generator-page">
      <div className="generator-container">
        <section className="generator-header">
          <p className="generator-eyebrow">Lesson Generator</p>
          <h1>Simplify a topic for your learners</h1>
          <p className="generator-subtext">
            Enter a teaching request and generate a simple explanation,
            classroom-ready examples, and mini tasks in seconds.
          </p>
        </section>

        <section className="generator-input-card">
          <label className="input-label" htmlFor="lesson-prompt">
            What would you like to teach?
          </label>

          <textarea
            id="lesson-prompt"
            className="generator-textarea"
            placeholder="e.g. Teach percentages to a weak Level 1 student"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="5"
          />

          <p
            className="example-prompt"
            onClick={() =>
              setPrompt("Teach percentages to a weak Level 1 student")
            }
          >
            Try: "Teach percentages to a weak Level 1 student"
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
                : "Simplify Lesson"}
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
                <button className="secondary-action-btn">Copy</button>
                <button className="secondary-action-btn">Save</button>
                <button className="secondary-action-btn">Export PDF</button>
              </div>
            </div>

            <div className="output-grid">
              <OutputCard title="Simple Explanation">
                <ul className="output-list">
                  {lesson.simpleExplanation.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </OutputCard>

              <OutputCard title="Examples">
                <ul className="output-list">
                  {lesson.examples.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </OutputCard>

              <OutputCard title="Mini Tasks">
                <div className="tasks-list">
                  {lesson.miniTasks.map((task, index) => (
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
  );
}
