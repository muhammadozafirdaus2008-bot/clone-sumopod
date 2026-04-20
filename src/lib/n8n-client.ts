const N8N_WEBHOOK_URL = "https://n8n.ghozali.biz.id/webhook/deploy-service";

export async function deployN8nService(
  serviceName: string,
  template: string,
  cost: number,
  token: string
) {
  console.log("CALLING N8N:", {
    serviceName,
    template,
    cost,
    token,
  });

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 penting
    },
    body: JSON.stringify({
      serviceName,
      template,
      cost,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Deploy failed");
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}