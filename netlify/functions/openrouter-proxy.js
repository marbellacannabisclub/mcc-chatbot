const fs = require("fs");
const path = require("path");

const handler = async (event, context) => {
  try {
    // Debug logging
    console.log("Environment variables:", {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? "Present" : "Missing",
      NODE_ENV: process.env.NODE_ENV
    });

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      throw new Error("Missing API key");
    }

    const promptPath = path.join(__dirname, "buddy-prompt.txt");
    console.log("Prompt path:", promptPath);
    
    if (!fs.existsSync(promptPath)) {
      console.error("Buddy prompt file not found at:", promptPath);
      throw new Error("Buddy prompt file not found");
    }

    const systemPrompt = fs.readFileSync(promptPath, "utf-8");
    console.log("System prompt loaded successfully");

    // Log the raw event
    console.log("Event:", {
      httpMethod: event.httpMethod,
      headers: event.headers,
      body: event.body
    });

    let body;
    try {
      // In Netlify Functions, the body is already a string
      body = JSON.parse(event.body);
      console.log("Parsed request body:", body);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      console.error("Request body type:", typeof event.body);
      console.error("Request body content:", event.body);
      throw new Error(`Invalid request body format: ${parseError.message}`);
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      console.error("Invalid messages array:", body.messages);
      throw new Error("Invalid request: messages array is required");
    }

    const fullBody = {
      ...body,
      messages: [
        { role: "system", content: systemPrompt },
        ...body.messages.filter(msg => msg.role !== "system")
      ]
    };

    console.log("Sending to OpenRouter:", {
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        "Authorization": "Bearer [REDACTED]",
        "Content-Type": "application/json"
      },
      body: fullBody
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fullBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenRouter response status:", response.status);
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Buddy function error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      })
    };
  }
};

exports.handler = handler;
