function extractTests(suite, rows) {
  if (suite.specs) {
    suite.specs.forEach((spec) => {
      spec.tests?.forEach((test) => {
        const results = test.results || [];
        const finalResult = results[results.length - 1] || {};
        const retryCount = results.length - 1;

        const failedStep =
          finalResult.status === 'failed' && finalResult.errors?.length
            ? stripAnsi(finalResult.errors[0].message)
            : '-';

        const attachments = finalResult.attachments || [];
        const mediaLinks = attachments.length
          ? attachments
              .filter(a => a.path)
              .map(a => `HYPERLINK("${a.path}", "${a.name}")`)
              .join(', ')
          : '-';

        const durationMin = (finalResult.duration || 0) / 60000;

        rows.push({
          Suite: suite.title || 'Root Suite',
          'Test Case ID': test.title.replace(/\s+/g, '_'),
          'Test Case Name': spec.title || test.title,
          'Step Number': '-',
          Status: finalResult.status || 'unknown',
          'Failed Step Description': failedStep,
          'Duration (min)': durationMin.toFixed(2),
          Retry: retryCount,
          Browser: test.projectName || 'unknown',
          'Media Link': mediaLinks,
          'Execution Date': finalResult.startTime
            ? new Date(finalResult.startTime).toISOString().split('T')[0]
            : '-',
        });
      });
    });
  }

  // recursively check nested suites
  suite.suites?.forEach(childSuite => extractTests(childSuite, rows));
}

data.suites?.forEach(suite => extractTests(suite, rows));
