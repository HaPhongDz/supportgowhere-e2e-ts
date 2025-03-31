module.exports = {
    default: `--require-module ts-node/register --require ./src/step-definitions/**/*.ts --require ./hooks/**/*.ts --format json:reports/cucumber-report.json --format summary ./src/features/**/*.feature`
  };
  