const { test, expect } = require('@playwright/test');

test('Tax Rules Endpoint', async ({ request }) => {
  const response = await request.get('http://localhost:8080/tax-rules');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data).toHaveLength(5);
  expect(body.meta.total).toBe(5);
});
