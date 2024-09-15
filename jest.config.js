module.exports = {
    reporters: [
      "default",
      ["jest-html-reporter", {
        pageTitle: "Test Report",
        outputPath: "test-report.html", // Path where the report will be saved
        includeFailureMsg: true,
        includeSuiteFailure: true,
        sort: "status"
      }]
    ]
  };
  