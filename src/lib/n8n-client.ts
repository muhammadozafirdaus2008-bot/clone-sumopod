const N8N_WEBHOOK_URL = "https://n8n.ghozali.biz.id/webhook/deploy-service";

export function deployN8nService(serviceName: string) {
  fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceName,
    }),
  });
}