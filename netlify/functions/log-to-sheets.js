export default async (req) => {
  try {
    const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;

    if (!SHEETS_WEBHOOK_URL) {
      throw new Error("Missing SHEETS_WEBHOOK_URL environment variable");
    }

    const { userMessage, buddyReply, sessionId } = await req.json();

    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userMessage, buddyReply, sessionId })
    });

    const result = await res.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
