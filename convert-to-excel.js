// convert-to-excel.js
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Path to Playwright JSON reporter output
const jsonFile = path.join(__dirname, 'test-results.json');

// Path to previews folder (screenshots/videos)
const previewsRoot = path.join(__dirname, 'previews');

if (!fs.existsSync(jsonFile)) {
  console.error('❌ test-results.json not found. Make sure Playwright ran with JSON reporter.');
  process.exit(1);
}

// Read JSON test results
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
const rows = [];

// Helper function: find preview files for a test
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
  return links.join(', ');
}

// Iterate through suites/specs/tests
data.suites.forEach((suite) => {
  suite.specs.forEach((spec) => {
    spec.tests.forEach((test) => {
      const result = test.results[0];
      rows.push({
        Suite: suite.title || 'Root Suite',
        TestName: spec.title || test.title,
        Status: result.status,
        Duration_ms: result.duration,
        Retry: result.retry,
        Browser: test.projectName,
        Previews: findPreviews(test.title), // relative paths to screenshots/videos
      });
    });
  });
});

// Create Excel workbook
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(rows);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

// Save Excel file
const excelFile = path.join(__dirname, 'Playwright_Test_Report.xlsx');
XLSX.writeFile(workbook, excelFile);

console.log(`✅ Excel report generated: ${excelFile}`);
