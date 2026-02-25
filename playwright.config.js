const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths
const jsonFile = path.join(process.cwd(), 'test-results.json');
const previewsRoot = process.env.PREVIEW_DIR || path.join(process.cwd(), 'previews');

try {

  if (!fs.existsSync(jsonFile)) {
    console.warn('⚠ test-results.json not found. Creating empty Excel report.');
  }

  const data = fs.existsSync(jsonFile)
    ? JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
    : { suites: [] };

  const rows = [];

  // Helper: find preview files
  function findPreviews(testName) {
    const links = [];
    if (!fs.existsSync(previewsRoot)) return [];

    const walk = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath);
        } else if (file.includes(testName)) {
          const relativePath = path
            .relative(process.cwd(), fullPath)
            .replace(/\\/g, "/");
          links.push(relativePath);
        }
      });
    };

    walk(previewsRoot);
    return links;
  }

  // Safe iteration through Playwright JSON
  data.suites?.forEach((suite) => {
    suite.specs?.forEach((spec) => {
      spec.tests?.forEach((test) => {

        const result = test.results?.[0] || {};

        const testTitle = test.title || 'Unknown_Test';
        const specTitle = spec.title || testTitle;

        const durationMin = (result.duration || 0) / 60000;

        const failedStep =
          result.status === 'failed' && result.error
            ? result.error.message || 'Error occurred'
            : '-';

        const previews = findPreviews(testTitle);
        const mediaLinks = previews.length
          ? previews.map(p => `HYPERLINK("${p}", "View Media")`).join(', ')
          : '-';

        rows.push({
          Suite: suite.title || 'Root Suite',
          'Test Case ID': testTitle.replace(/\s+/g, '_'),
          'Test Case Name': specTitle,
          'Step Number': test.step || '-',
          Status: result.status || 'unknown',
          'Failed Step Description': failedStep,
          'Duration (min)': durationMin.toFixed(2),
          Retry: result.retry || 0,
          Browser: test.projectName || 'unknown',
          'Media Link': mediaLinks,
          'Execution Date': result.startTime
            ? new Date(result.startTime).toISOString().split('T')[0]
            : '-',
        });

      });
    });
  });

  // If no rows, still create one empty row
  if (rows.length === 0) {
    rows.push({
      Suite: '-',
      'Test Case ID': '-',
      'Test Case Name': 'No tests found',
      'Step Number': '-',
      Status: '-',
      'Failed Step Description': '-',
      'Duration (min)': '-',
      Retry: '-',
      Browser: '-',
      'Media Link': '-',
      'Execution Date': '-',
    });
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

  // Save Excel in workflow root (matches YAML)
  const excelFile = path.join(process.cwd(), 'Playwright_Test_Report.xlsx');
  XLSX.writeFile(workbook, excelFile);

  console.log(`✅ Excel report generated: ${excelFile}`);
  console.log('File exists:', fs.existsSync(excelFile));

} catch (err) {
  console.error('⚠ Excel generation error (workflow will continue):', err.message);
}
