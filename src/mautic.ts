import type { Env } from './token';

export async function getAccessToken(env: Env): Promise<string> {
  const url = `${env.MAUTIC_BASE_URL}/oauth/v2/token`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.MAUTIC_CLIENT_ID,
      client_secret: env.MAUTIC_CLIENT_SECRET,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Mautic OAuth failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function addToDnc(
  contactId: string,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAccessToken(env);

    const url = `${env.MAUTIC_BASE_URL}/api/contacts/${contactId}/dnc/sms/add`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: 1 }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Mautic API error: ${response.status} - ${text}` };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
