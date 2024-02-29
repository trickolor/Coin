module.exports = {
  transform: {
    '\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|scss)$": 'identity-obj-proxy'
  }
};
