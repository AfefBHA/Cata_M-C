const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    setupNodeEvents(on, config) {
      // implementm node event listeners here
    },
    env: {
      // https://github.com/bahmutov/cypress-slow-down
      commandDelay: 500,
    }
  },
});
