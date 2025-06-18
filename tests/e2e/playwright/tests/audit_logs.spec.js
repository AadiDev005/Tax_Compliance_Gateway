const { test, expect } = require('@playwright/test');

test('Audit Logs Endpoint', async ({ request }) => {
  const response = await request.get('http://localhost:8081/audit-logs');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data).toBeInstanceOf(Array);
  expect(body.data.length).toBeGreaterThan(0);
});
