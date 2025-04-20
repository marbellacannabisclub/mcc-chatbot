import { readFileSync } from "fs";
import path from "path";

export default async (req, context) => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
