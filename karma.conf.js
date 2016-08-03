const argv = require('yargs').argv;

module.exports = config => {
  const options = {
    frameworks: ['jasmine'],

    files: ['karma.entry.js'],

    preprocessors: {
      'karma.entry.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.config'),

    webpackServer: {
      noInfo: true
    },

    reporters: ['dots'],

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false,

    browsers: ['Chrome']
  };

  if (argv.coverage) {
    options.reporters.push('coverage');
    options.coverageReporter = {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        {type: 'lcov'}
      ]
    };
  }

  config.set(options);
};
