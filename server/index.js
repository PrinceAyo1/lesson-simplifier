const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const OpenAI = require("openai");
const supabase = require("./config/supabase");

const app = express();
const PORT = process.env.PORT || 5000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, subject, difficulty } = req.body;

    if (!prompt || !subject || !difficulty) {
      return res.status(400).json({
        error: "Prompt, subject, and difficulty are required.",
      });
    }

    const systemPrompt = `
You are Lesson Simplifier, an AI assistant for FE teachers, Functional Skills teachers, adult learning tutors, ALS staff, and trainee teachers in the UK.

Your job is to simplify teaching content for learners at the requested level.

Rules:
- Use plain English
- Be step-by-step
- Keep the tone supportive and teacher-friendly
- Use UK-relevant real-life examples
- Match the requested subject and difficulty
- Return exactly 3 mini tasks
- Make the explanation usable in class immediately
- Do not include markdown
- Return valid JSON only

Required JSON shape:
{
  "simpleExplanation": ["string", "string", "string"],
  "examples": ["string", "string", "string"],
  "miniTasks": [
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ]
}
`;

    const userPrompt = `
Teaching request: ${prompt}
Subject: ${subject}
Difficulty: ${difficulty}

Generate:
1. A very simple explanation
2. Real-life examples relevant to UK learners
3. Three mini practice tasks with answers
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const parsed = JSON.parse(content);

    return res.json(parsed);
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      error: "Failed to generate lesson content.",
    });
  }
});

app.post("/api/lessons", async (req, res) => {
  try {
    const {
      userId,
      prompt,
      subject,
      difficulty,
      simpleExplanation,
      examples,
      miniTasks,
    } = req.body;

    if (
      !userId ||
      !prompt ||
      !subject ||
      !difficulty ||
      !simpleExplanation ||
      !examples ||
      !miniTasks
    ) {
      return res.status(400).json({
        error: "Missing required lesson fields.",
      });
    }

    const { data, error } = await supabase
      .from("lessons")
      .insert([
        {
          user_id: userId,
          prompt,
          subject,
          difficulty,
          simple_explanation: simpleExplanation,
          examples,
          mini_tasks: miniTasks,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase save error:", error);
      return res.status(500).json({
        error: "Failed to save lesson.",
      });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Save lesson error:", error);
    return res.status(500).json({
      error: "Something went wrong while saving the lesson.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
