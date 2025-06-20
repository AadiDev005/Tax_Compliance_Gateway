const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'integration/**/*.spec.js',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720
  }
});
