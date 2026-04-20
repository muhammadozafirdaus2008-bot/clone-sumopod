const N8N_WEBHOOK_URL = "http://n8n.43.134.70.47.sslip.io/webhook/deploy-service";

export async function deployN8nService(
  serviceName: string,
  template: string,
  cost: number,
  token: string
) {
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        serviceName,
        template,
        cost,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to deploy service");
    }

    return await res.json();
  } catch (err) {
    console.error("Deploy error:", err);
    throw err;
  }
}