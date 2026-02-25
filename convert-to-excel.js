const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths
const jsonFile = path.join(__dirname, 'test-results.json');
const previewsRoot = path.join(__dirname, 'previews');

if (!fs.existsSync(jsonFile)) {
  console.error('❌ test-results.json not found. Make sure Playwright ran with JSON reporter.');
  process.exit(1);
}

// Read JSON test results
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
const rows = [];

// Helper: find preview files for a test
function findPreviews(testName) {
  const links = [];
  if (!fs.existsSync(previewsRoot)) return '';

  const walk = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.includes(testName)) {
        const relativePath = path.relative(__dirname, fullPath);
        links.push(relativePath);
      }
    });
  };

  walk(previewsRoot);
  return links;
}

// Iterate through suites/specs/tests
data.suites.forEach((suite) => {
  suite.specs.forEach((spec) => {
    spec.tests.forEach((test) => {
      const result = test.results[0];

      // Duration in minutes
      const durationMin = (result.duration || 0) / 60000;

      // Failed step description
      const failedStep = result.status === 'failed' && result.error ? result.error.message : '-';

      // Media links
      const previews = findPreviews(test.title);
      const mediaLinks = previews.length
        ? previews.map(p => `HYPERLINK("${p.replace(/\\/g, "/")}", "View Media")`).join(', ')
        : '-';

      rows.push({
        Suite: suite.title || 'Root Suite',
        'Test Case ID': test.title.replace(/\s+/g, '_'), // optional: create unique ID
        'Test Case Name': spec.title || test.title,
        'Step Number': test.step || '-', // optional: if you have step info
        Status: result.status,
        'Failed Step Description': failedStep,
        'Duration (min)': durationMin.toFixed(2),
        Retry: result.retry || 0,
        Browser: test.projectName,
        'Media Link': mediaLinks,
        'Execution Date': new Date(result.startTime).toISOString().split('T')[0],
      });
    });
  });
});

// Create Excel workbook
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(rows, { header: [
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
] });

// Append sheet
XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

// Save Excel file
const excelFile = path.join(__dirname, 'Playwright_Test_Report.xlsx');
XLSX.writeFile(workbook, excelFile);

console.log(`✅ Enhanced Excel report generated: ${excelFile}`);
