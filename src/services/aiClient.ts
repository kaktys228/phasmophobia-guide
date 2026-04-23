export async function identifyGhost(description: string): Promise<string | null> {
  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return null;
  }

  const response = await fetch('/api/ai-identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: trimmedDescription,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { result?: string; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || 'Не удалось выполнить AI-поиск.');
  }

  return payload?.result ?? null;
}
