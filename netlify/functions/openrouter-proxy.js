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
