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
You are Lesson Simplifier, an AI assistant that helps learners, teachers, tutors, parents, and support staff understand difficult topics more easily.

Your job is to simplify topics for the requested level.

Rules:
- Use plain English
- Be step-by-step
- Keep the tone supportive and easy to follow
- Use UK-relevant real-life examples where useful
- Match the requested subject and learning level exactly. For Maths, distinguish clearly between Functional Skills, GCSE, A Level, and University level.
- Return exactly 3 mini tasks
- Do not include markdown
- Return valid JSON only

Important:
- If the subject is Maths or the topic involves calculations, you must include proper worked examples with clear step-by-step working out.
- Do not give answer-only maths examples.
- For calculation topics, show the method clearly before the final answer.
- For non-calculation topics, still return workedExamples, but make them simple guided examples.

Required JSON shape:
{
  "simpleExplanation": ["string", "string", "string"],
  "workedExamples": [
    {
      "question": "string",
      "steps": ["string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "steps": ["string", "string", "string"],
      "answer": "string"
    }
  ],
  "miniTasks": [
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ]
}
`;

    const userPrompt = `
Topic/request: ${prompt}
Subject: ${subject}
Learning level: ${difficulty}

Generate:
1. A very simple explanation in plain English
2. Two worked examples
   - If the topic is calculation-based, include full working out step by step
   - If the topic is not calculation-based, include guided examples with clear steps
3. Three mini practice tasks with answers

Make the output easy to use for learning, revision, teaching, or support at home.
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

    const safeResponse = {
      simpleExplanation: parsed.simpleExplanation || [],
      workedExamples: parsed.workedExamples || [],
      miniTasks: parsed.miniTasks || [],
    };

    return res.json(safeResponse);
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
      workedExamples,
      miniTasks,
    } = req.body;

    if (
      !userId ||
      !prompt ||
      !subject ||
      !difficulty ||
      !simpleExplanation ||
      !workedExamples ||
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
          worked_examples: workedExamples,
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
app.get("/api/lessons/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch lessons error:", error);
      return res.status(500).json({
        error: "Failed to fetch lessons.",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Get lessons route error:", error);
    return res.status(500).json({
      error: "Something went wrong while fetching lessons.",
    });
  }
});

app.delete("/api/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) {
      console.error("Delete lesson error:", error);
      return res.status(500).json({
        error: "Failed to delete lesson.",
      });
    }

    return res.json({ message: "Lesson deleted successfully." });
  } catch (error) {
    console.error("Delete route error:", error);
    return res.status(500).json({
      error: "Something went wrong while deleting the lesson.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
