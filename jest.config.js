module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/client/__tests__/**/*.test.ts", "<rootDir>/client/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/.cache",
    "<rootDir>/node_modules",
    "<rootDir>/server_dist",
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/.cache",
  ],
  haste: {
    defaultPlatform: "ios",
    platforms: ["android", "ios", "native", "web"],
    enableSymlinks: false,
    forceNodeFilesystemAPI: true,
    retainAllFiles: false,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "client/lib/**/*.{ts,tsx}",
    "client/hooks/**/*.{ts,tsx}",
    "client/types/**/*.{ts,tsx}",
    "!client/**/*.d.ts",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/.cache",
    "<rootDir>/node_modules",
  ],
  testEnvironment: "node",
};
