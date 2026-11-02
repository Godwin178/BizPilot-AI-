import { createHmac, timingSafeEqual } from 'node:crypto';

export const DEFAULT_AI_URL = 'https://api.openai.com/v1/chat/completions';
export function aiConfiguration(env = process.env) {
  return { configured: Boolean(env.AI_API_KEY), url: env.AI_API_URL || DEFAULT_AI_URL, model: env.AI_MODEL || 'gpt-4o-mini' };
}
export function verifyStripeSignature(raw, header, secret, now = Date.now()) {
  if (!secret || !header) return false;
  const parts = header.split(',').map(item => item.trim());
  const timestamp = parts.find(item => item.startsWith('t='))?.slice(2);
  const provided = parts.find(item => item.startsWith('v1='))?.slice(3);
  if (!timestamp || !provided || Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  if (!/^[0-9a-f]+$/i.test(provided) || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
}
