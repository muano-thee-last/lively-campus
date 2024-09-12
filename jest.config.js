// jest.config.js
module.exports = {
    reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test-results',
        outputName: 'jest-junit.xml',
      }],
    ],
    // You can include additional Jest configuration here if needed
  };
  