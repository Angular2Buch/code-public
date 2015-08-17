var config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*.spec.js'],

    onPrepare: function() {
        browser.ignoreSynchronization = true;
    },

    capabilities: {
      'browserName': 'chrome'
    }
};

if (process.env.TRAVIS_BUILD_NUMBER) {

  // see https://github.com/angular/protractor/blob/master/lib/runner.js
  // prtractor grabs driver provider based on type
  // 2) if seleniumAddress is given, use that (so we delete it here)
  delete config.seleniumAddress;

  // 3) if a Sauce Labs account is given, use that
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;

  config.capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
  config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
  config.capabilities.name = 'Angular2Buch';
};


exports.config = config;
