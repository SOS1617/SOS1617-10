exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-loadData.js','T02-addData.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};