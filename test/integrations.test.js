import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { aiConfiguration, verifyStripeSignature } from '../lib/integrations.js';

test('AI configuration fails closed without a key', () => {
  const config = aiConfiguration({ AI_API_URL: '', AI_MODEL: '' });
  assert.equal(config.configured, false);
  assert.equal(config.url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(config.model, 'gpt-4o-mini');
});

test('Stripe signatures accept valid payloads and reject tampering', () => {
  const secret = 'whsec_test';
  const raw = JSON.stringify({ id: 'evt_test' });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  const header = `t=${timestamp},v1=${signature}`;
  assert.equal(verifyStripeSignature(raw, header, secret), true);
  assert.equal(verifyStripeSignature(`${raw}x`, header, secret), false);
  assert.equal(verifyStripeSignature(raw, header, 'wrong'), false);
});

test('authentication and protected module routes remain present', async () => {
  const source = await readFile(new URL('../server.js', import.meta.url), 'utf8');
  assert.match(source, /\/api\/auth\/register/);
  assert.match(source, /\/api\/auth\/login/);
  assert.match(source, /requireUser\(req, res\)/);
  assert.match(source, /WHERE user_id=\$1 AND collection=\$2/);
});
