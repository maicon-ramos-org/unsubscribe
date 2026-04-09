import type { Env } from './token';

export async function addToDnc(
  contactId: string,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  try {
    const baseUrl = env.MAUTIC_BASE_URL?.replace(/\/+$/, '');
    const url = `${baseUrl}/api/contacts/${contactId}/dnc/sms/add`;
    console.log('Mautic DNC add URL:', url);
    console.log('Mautic user configured:', !!env.MAUTIC_USERNAME);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(env.MAUTIC_USERNAME + ':' + env.MAUTIC_PASSWORD)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: 1, comments: 'Não receber mensagem de Whatsapp' }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log('Mautic API error:', response.status, text);
      return { success: false, error: `Mautic API error: ${response.status} - ${text}` };
    }

    console.log('Mautic DNC add success for contact:', contactId);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.log('Mautic fetch error:', message);
    return { success: false, error: message };
  }
}

export async function removeFromDnc(
  contactId: string,
  env: Env,
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${env.MAUTIC_BASE_URL}/api/contacts/${contactId}/dnc/sms/remove`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(env.MAUTIC_USERNAME + ':' + env.MAUTIC_PASSWORD)}`,
        'Content-Type': 'application/json',
      },
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
