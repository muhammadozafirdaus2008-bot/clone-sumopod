const API_URL = "https://n8n-n8n001.0qhmrn.easypanel.host/webhook";

export const apiFetch = async (endpoint: string, body: any, token?: string) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  return res.json();
};