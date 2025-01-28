module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.ts$": ["ts-jest",{}],
  },
  modulePathIgnorePatterns: ['<rootDir>/demo']
};