const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    searchKeyword: "Honda",
    authToken: "mock-token-123",
    baseAppUrl: "https://example.cypress.io"
  },

  e2e: {
    setupNodeEvents(on, config) {
      return config
    },
  },
});