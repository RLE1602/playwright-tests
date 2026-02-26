const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

/**
 * Remove ANSI escape codes from Playwright error messages
 */
function stripAnsi(str) {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

try {
  // Use first CLI argument as folder or fallback to PREVIEW_DIR
  const folder = process.argv[2] || process.env.PREVIEW_DIR || 'test-results';
  const jsonFile = path.join(folder, 'test-results.json');

  console.log('ℹ️ Using folder:', folder);
  console.log('ℹ️ Looking for JSON file:', jsonFile);

  if (!fs.existsSync(jsonFile)) {
    console.warn('⚠ test-results.json not found. Excel will be empty.');
  }

  const data = fs.existsSync(jsonFile) ? JSON.parse(fs.readFileSync(jsonFile, 'utf-8')) : { suites: [] };
  const rows = [];

  data.suites?.forEach((suite) => {
    suite.specs?.forEach((spec) => {
      spec.tests?.forEach((test) => {
        const results = test.results || [];
        const finalResult = results[results.length - 1] || {};
        const retryCount = results.length - 1;

        const failedStep = finalResult.status === 'failed' && finalResult.errors?.length
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
          'Step Number': '-', // Optional: track steps with test.step()
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
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      'Suite',
      'Test Case ID',
      'Test Case Name',
      'Step Number',
      'Status',
      'Failed Step Description',
      'Duration (min)',
      'Retry',
      'Browser',
      'Media Link',
      'Execution Date'
    ]
  });
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

  const excelFile = path.join(folder, 'Playwright_Test_Report.xlsx');
  XLSX.writeFile(workbook, excelFile);

  console.log(`✅ Excel report generated: ${excelFile}`);
  console.log('File exists:', fs.existsSync(excelFile));

} catch (err) {
  console.error('❌ Excel generation failed:', err);
  console.log('⚠ Continuing workflow despite Excel failure');
}
