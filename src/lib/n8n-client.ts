export async function deployN8nService(
  serviceName: string,
  template: string,
  cost: number,
  token: string
) {
  const res = await fetch("https://n8n.ghozali.biz.id/webhook/Deploy-Service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: serviceName,   // sesuai body request
      template,
      cost,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Deploy gagal (${res.status}): ${errText}`);
  }

  return true;
}