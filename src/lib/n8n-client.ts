export async function deployN8nService(
  serviceName: string,
  template: string,
  cost: number,
  token: string
) {
  const res = await fetch("https://clone-sumopod-backend-production.up.railway.app/instances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: serviceName,
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