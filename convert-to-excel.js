const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

try {
  // Determine JSON file location
  let jsonFile = path.join(process.cwd(), 'test-results.json');

  // Preview folder from env or default
  const previewsRoot = process.env.PREVIEW_DIR || path.join(process.cwd(), 'previews');

  // Check if JSON exists in PREVIEW_DIR as fallback
  if (!fs.existsSync(jsonFile) && process.env.PREVIEW_DIR) {
    const altPath = path.join(process.cwd(), process.env.PREVIEW_DIR, 'test-results.json');
    if (fs.existsSync(altPath)) {
      jsonFile = altPath;
    }
  }

  if (!fs.existsSync(jsonFile)) {
    console.warn('⚠ test-results.json not found in root or PREVIEW_DIR. Excel will be empty.');
  }

  // Read JSON if it exists, otherwise empty data
  const data = fs.existsSync(jsonFile) ? JSON.parse(fs.readFileSync(jsonFile, 'utf-8')) : { suites: [] };
  const rows = [];

  // Helper: find preview files for a test
  function findPreviews(testName) {
    const links = [];
    if (!fs.existsSync(previewsRoot)) return [];

    const walk = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath);
        } else if (file.includes(testName)) {
          // relative path for Excel hyperlink
          const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
          links.push(relativePath);
        }
      });
    };

    walk(previewsRoot);
    return links;
  }

  // Iterate safely through suites/specs/tests
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

  // Create Excel workbook
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

  // Save Excel file at workflow root
  const excelFile = path.join(process.cwd(), 'Playwright_Test_Report.xlsx');
  XLSX.writeFile(workbook, excelFile);

  console.log(`✅ Excel report generated: ${excelFile}`);
  console.log('File exists:', fs.existsSync(excelFile));

} catch (err) {
  console.error('❌ Excel generation failed:', err);
  console.log('⚠ Continuing workflow despite Excel failure');
}
