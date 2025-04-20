export default async (req, context) => {
  const OPENROUTER_API_KEY = "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";

  const body = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
