const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Ensure the reports directory exists
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Configure HTML reporter options
const options = {
    theme: 'bootstrap',
    jsonFile: path.join(process.cwd(), 'reports', 'cucumber-report.json'),
    output: path.join(process.cwd(), 'reports', 'cucumber-report.html'),
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        'App Version': 'SupportGoWhere E2E Tests',
        'Test Environment': process.env.TEST_ENV || 'Local',
        'Browser': 'Multiple',
        'Platform': process.platform,
        'Execution Date': new Date().toISOString(),
        'Project': 'SupportGoWhere'
    }
};

try {
    reporter.generate(options);
    console.log(`🔶 HTML Report generated at: ${options.output}`);
    
    // Open the report automatically on Windows
    if (process.platform === 'win32') {
        const { exec } = require('child_process');
        exec(`start ${options.output}`);
    }
} catch (err) {
    console.error('Error generating report:', err);
} 