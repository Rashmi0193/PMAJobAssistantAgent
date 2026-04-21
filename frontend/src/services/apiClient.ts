type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function postJson<TResponse>(path: string, body: Json): Promise<TResponse> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as TResponse;
}

