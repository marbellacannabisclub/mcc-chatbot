import { readFileSync } from "fs";
import path from "path";

export default async (req, context) => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      throw new Error("Missing API key");
    }

    const promptPath = path.join(__dirname, "buddy-prompt.txt");
    const systemPrompt = readFileSync(promptPath, "utf-8");

    const body = await req.json();

    const fullBody = {
      ...body,
      messages: [
        { role: "system", content: systemPrompt },
        ...body.messages.filter(msg => msg.role !== "system")
      ]
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fullBody)
    });

    const data = await response.json();

    // Debug: Log response in case it helps
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Buddy function error:", err);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      details: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
