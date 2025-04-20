export default async (req) => {
  const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;

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
};
