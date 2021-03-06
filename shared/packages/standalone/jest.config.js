/* eslint-env node */
module.exports = require("@batch/common-config/jest-common")
    .createConfig("ui-standalone", require("./tsconfig"), {testEnvironment: "jsdom"});
