const fetch = require("node-fetch");

const callAI = async (prompt) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "TaskFlow",
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: prompt }],
      }),
    },
  );

  const data = await response.json();
  console.log("OpenRouter response:", JSON.stringify(data, null, 2));

  if (!data.choices || data.choices.length === 0) {
    throw new Error(data.error?.message || "No response from AI");
  }

  return data.choices[0].message.content.trim();
};

// POST /api/ai/generate — generate description + subtasks for a task title
const generateTaskDetails = async (req, res) => {
  try {
    const { title, priority = "medium" } = req.body;

    if (!title || title.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Task title must be at least 3 characters." });
    }

    const prompt = `You are a productivity assistant. Given a task title, generate:
1. A clear, concise description (2-3 sentences max)
2. 3-5 actionable subtasks to complete it

Task Title: "${title}"
Priority: ${priority}

Respond ONLY with valid JSON in this exact format:
{
  "description": "...",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"]
}

No explanation. No markdown. Just the JSON object.`;

    const raw = await callAI(prompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid AI response format");
      parsed = JSON.parse(match[0]);
    }

    res.json({
      description: parsed.description || "",
      subtasks: (parsed.subtasks || []).map((t) => ({
        title: t,
        completed: false,
      })),
    });
  } catch (err) {
    console.error("AI generation error:", err.message);
    res
      .status(500)
      .json({ message: "AI generation failed. Please try again." });
  }
};

// POST /api/ai/summarize — summarize all tasks into a productivity overview
const summarizeTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || tasks.length === 0) {
      return res
        .status(400)
        .json({ message: "No tasks provided for summary." });
    }

    const taskList = tasks
      .map((t) => `- [${t.status}] ${t.title} (priority: ${t.priority})`)
      .join("\n");

    const prompt = `You are a productivity coach. Analyze these tasks and give a short, encouraging summary (3-4 sentences) about the user's workload, what they should focus on first, and a motivational tip.

Tasks:
${taskList}

Respond with plain text only. No JSON. No markdown. Be concise and encouraging.`;

    const summary = await callAI(prompt);
    res.json({ summary });
  } catch (err) {
    console.error("AI summarize error:", err.message);
    res
      .status(500)
      .json({ message: "Summary generation failed. Please try again." });
  }
};

module.exports = { generateTaskDetails, summarizeTasks };
