const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/generate", (req, res) => {
  const { prompt, subject, difficulty } = req.body;

  if (!prompt || !subject || !difficulty) {
    return res.status(400).json({
      error: "Prompt, subject, and difficulty are required.",
    });
  }

  res.json({
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
    meta: {
      prompt,
      subject,
      difficulty,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
