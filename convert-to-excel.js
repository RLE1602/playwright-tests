const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

try {
  let jsonFile = path.join(process.cwd(), 'test-results.json');
  const previewsRoot = process.env.PREVIEW_DIR || path.join(process.cwd(), 'previews');

  if (!fs.existsSync(jsonFile) && process.env.PREVIEW_DIR) {
    const altPath = path.join(process.cwd(), process.env.PREVIEW_DIR, 'test-results.json');
    if (fs.existsSync(altPath)) {
      jsonFile = altPath;
    }
  }

  if (!fs.existsSync(jsonFile)) {
    console.warn('⚠ test-results.json not found. Excel will be empty.');
  }

  const data = fs.existsSync(jsonFile)
    ? JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
    : { suites: [] };

  const rows = [];

  // 🔥 Find latest screenshot across previews folder
  function findLatestFailedScreenshot() {
    if (!fs.existsSync(previewsRoot)) return [];

    let screenshots = [];

    const walk = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (/^test-finished-\d+\.png$/.test(file)) {
          const retryNumber = parseInt(file.match(/\d+/)[0], 10);

          screenshots.push({
            path: path.relative(process.cwd(), fullPath).replace(/\\/g, "/"),
            retry: retryNumber,
            time: stat.mtimeMs
          });
        }
      });
    };

    walk(previewsRoot);

    if (screenshots.length === 0) return [];

    // Pick most recently modified screenshot
    screenshots.sort((a, b) => b.time - a.time);

    return [screenshots[0].path];
  }

  data.suites?.forEach((suite) => {
    suite.specs?.forEach((spec) => {
      spec.tests?.forEach((test) => {

        const result = test.results?.[test.results.length - 1] || {};
        const failureLocation = result.error?.location;

        const testTitle = spec?.title ?? test?.title ?? 'Unknown_Test';
        const specTitle = spec.title || testTitle;

        const durationMin = result.duration
          ? (result.duration / 60000).toFixed(2)
          : '0.00';

        // Only failed tests get screenshot
        const previews = result.status === 'failed'
          ? findLatestFailedScreenshot()
          : [];

        const mediaPath = previews.length ? previews[0] : '-';

        rows.push({
          Suite: suite.title || 'Root Suite',
          'Test Case ID': testTitle.replace(/\s+/g, '_'),
          'Test Case Name': specTitle,
          'Step Number': failureLocation?.line ?? '-',
          Status: result.status || 'unknown',
          'Failed Step Description': result.error?.message || '-',
          'Duration (min)': durationMin,
          Retry: result.retry || 0,
          Browser: test.projectName || 'unknown',
          'Media Link': mediaPath,
          'Execution Date': result.startTime
            ? new Date(result.startTime).toISOString().split('T')[0]
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

  // 🔥 Make Media Link clickable ONLY for failed tests
  rows.forEach((row, index) => {
    if (row['Status'] === 'failed' && row['Media Link'] !== '-') {
      const cellAddress = `J${index + 2}`;
      worksheet[cellAddress] = {
        t: 's',
        v: 'View Screenshot',
        l: { Target: row['Media Link'] }
      };
    }
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

  const excelFile = path.join(process.cwd(), 'Playwright_Test_Report.xlsx');
  XLSX.writeFile(workbook, excelFile);

  console.log(`✅ Excel report generated: ${excelFile}`);
  console.log('Previews folder exists:', fs.existsSync(previewsRoot));

} catch (err) {
  console.error('❌ Excel generation failed:', err);
  console.log('⚠ Continuing workflow despite Excel failure');
}
