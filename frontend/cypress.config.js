const { defineConfig } = require("cypress");


module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
    supportFile: 'cypress/support/component.js',
  },
});
