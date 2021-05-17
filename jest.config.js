module.exports = {
  //automock: true,
  testEnvironment: "<rootDir>/__tests__/_setup/TestEnviroment.js",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  testPathIgnorePatterns: [
    "/_helper/*",
    "/_setup/*",
    "/_simulations/*",
    "/test.js",
    "/src/*"
  ],
  globalSetup: "<rootDir>/__tests__/_setup/setup-globals.js",
}