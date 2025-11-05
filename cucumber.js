export default {
  paths: ['features/**/*.feature'],
  require: ['features/steps/**/*.ts'],
  format: ['progress', 'html:cucumber-report.html'],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true
}
