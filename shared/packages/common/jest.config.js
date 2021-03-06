/* eslint-env node */
module.exports = require("@batch/common-config/jest-common")
    .createConfig("ui-common", require("./tsconfig"), {testEnvironment: "jsdom"});
