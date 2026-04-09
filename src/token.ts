export interface Env {
  HMAC_SECRET: string;
  MAUTIC_BASE_URL: string;
  MAUTIC_USERNAME: string;
  MAUTIC_PASSWORD: string;
}

function base64ToBytes(b64input: string): Uint8Array {
  // Accept both standard base64 (with = padding, +, /) and base64url (-, _)
  const b64 = b64input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyAndExtract(
  token: string,
  secret: string,
): Promise<string | null> {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return null;

  const payloadB64 = token.substring(0, dotIndex);
  const receivedHmac = token.substring(dotIndex + 1).toLowerCase();

  let contactId: string;
  try {
    const decoded = base64ToBytes(payloadB64);
    contactId = new TextDecoder().decode(decoded);
  } catch {
    return null;
  }

  if (!/^\d+$/.test(contactId)) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(contactId),
  );

  const expectedHmac = bytesToHex(new Uint8Array(signature));

  if (!timingSafeEqual(expectedHmac, receivedHmac)) return null;

  return contactId;
}
