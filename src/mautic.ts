import type { Env } from './token';

export async function addToDnc(
  contactId: string,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${env.MAUTIC_BASE_URL}/api/contacts/${contactId}/dnc/sms/add`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(env.MAUTIC_USERNAME + ':' + env.MAUTIC_PASSWORD)}`,
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
