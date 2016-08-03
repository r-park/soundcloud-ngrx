require('core-js/es6/array');
require('core-js/es6/map');
require('core-js/es6/set');
require('core-js/es6/string');
require('core-js/es6/symbol');
require('core-js/es7/reflect');
require('core-js/fn/array/includes');
require('core-js/fn/object/assign');
require('zone.js/dist/zone');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('ts-helpers');


Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;


// Specify platform and application providers
var browser = require('@angular/platform-browser-dynamic/testing');
var testing = require('@angular/core/testing');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);


// Load source files
var context = require.context('./src', true, /\.ts/);

var exclude = [
  './main.ts',
  './polyfill.ts',
  './vendor.ts'
];

context.keys().forEach(function(key) {
  if (exclude.indexOf(key) === -1) context(key);
});
