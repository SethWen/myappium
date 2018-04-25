'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _argparse = require('argparse');

var _packageJson = require('../../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

// eslint-disable-line import/no-unresolved

var args = [[['--shell'], {
  required: false,
  defaultValue: null,
  help: 'Enter REPL mode',
  nargs: 0,
  dest: 'shell'
}], [['--reboot'], {
  defaultValue: false,
  dest: 'reboot',
  action: 'storeTrue',
  required: false,
  help: '(Android-only) reboot emulator after each session and kill it at the end',
  nargs: 0
}], [['--ipa'], {
  required: false,
  defaultValue: null,
  help: '(IOS-only) abs path to compiled .ipa file',
  example: '/abs/path/to/my.ipa',
  dest: 'ipa'
}], [['-a', '--address'], {
  defaultValue: '0.0.0.0',
  required: false,
  example: '0.0.0.0',
  help: 'IP Address to listen on',
  dest: 'address'
}], [['-p', '--port'], {
  defaultValue: 4723,
  required: false,
  type: 'int',
  example: '4723',
  help: 'port to listen on',
  dest: 'port'
}], [['-ca', '--callback-address'], {
  required: false,
  dest: 'callbackAddress',
  defaultValue: null,
  example: '127.0.0.1',
  help: 'callback IP Address (default: same as --address)'
}], [['-cp', '--callback-port'], {
  required: false,
  dest: 'callbackPort',
  defaultValue: null,
  type: 'int',
  example: '4723',
  help: 'callback port (default: same as port)'
}], [['-bp', '--bootstrap-port'], {
  defaultValue: 4724,
  dest: 'bootstrapPort',
  required: false,
  type: 'int',
  example: '4724',
  help: '(Android-only) port to use on device to talk to Appium'
}], [['-r', '--backend-retries'], {
  defaultValue: 3,
  dest: 'backendRetries',
  required: false,
  type: 'int',
  example: '3',
  help: '(iOS-only) How many times to retry launching Instruments ' + 'before saying it crashed or timed out'
}], [['--session-override'], {
  defaultValue: false,
  dest: 'sessionOverride',
  action: 'storeTrue',
  required: false,
  help: 'Enables session override (clobbering)',
  nargs: 0
}], [['-l', '--pre-launch'], {
  defaultValue: false,
  dest: 'launch',
  action: 'storeTrue',
  required: false,
  help: 'Pre-launch the application before allowing the first session ' + '(Requires --app and, for Android, --app-pkg and --app-activity)',
  nargs: 0
}], [['-g', '--log'], {
  defaultValue: null,
  dest: 'log',
  required: false,
  example: '/path/to/appium.log',
  help: 'Also send log output to this file'
}], [['--log-level'], {
  choices: ['info', 'info:debug', 'info:info', 'info:warn', 'info:error', 'warn', 'warn:debug', 'warn:info', 'warn:warn', 'warn:error', 'error', 'error:debug', 'error:info', 'error:warn', 'error:error', 'debug', 'debug:debug', 'debug:info', 'debug:warn', 'debug:error'],
  defaultValue: 'debug',
  dest: 'loglevel',
  required: false,
  example: 'debug',
  help: 'log level; default (console[:file]): debug[:debug]'
}], [['--log-timestamp'], {
  defaultValue: false,
  required: false,
  help: 'Show timestamps in console output',
  nargs: 0,
  action: 'storeTrue',
  dest: 'logTimestamp'
}], [['--local-timezone'], {
  defaultValue: false,
  required: false,
  help: 'Use local timezone for timestamps',
  nargs: 0,
  action: 'storeTrue',
  dest: 'localTimezone'
}], [['--log-no-colors'], {
  defaultValue: false,
  required: false,
  help: 'Do not use colors in console output',
  nargs: 0,
  action: 'storeTrue',
  dest: 'logNoColors'
}], [['-G', '--webhook'], {
  defaultValue: null,
  required: false,
  example: 'localhost:9876',
  dest: 'webhook',
  help: 'Also send log output to this HTTP listener'
}], [['--safari'], {
  defaultValue: false,
  action: 'storeTrue',
  dest: 'safari',
  required: false,
  help: '(IOS-Only) Use the safari app',
  nargs: 0
}], [['--default-device', '-dd'], {
  dest: 'defaultDevice',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: '(IOS-Simulator-only) use the default simulator that instruments ' + 'launches on its own'
}], [['--force-iphone'], {
  defaultValue: false,
  dest: 'forceIphone',
  action: 'storeTrue',
  required: false,
  help: '(IOS-only) Use the iPhone Simulator no matter what the app wants',
  nargs: 0
}], [['--force-ipad'], {
  defaultValue: false,
  dest: 'forceIpad',
  action: 'storeTrue',
  required: false,
  help: '(IOS-only) Use the iPad Simulator no matter what the app wants',
  nargs: 0
}], [['--tracetemplate'], {
  defaultValue: null,
  dest: 'automationTraceTemplatePath',
  required: false,
  example: '/Users/me/Automation.tracetemplate',
  help: '(IOS-only) .tracetemplate file to use with Instruments'
}], [['--instruments'], {
  defaultValue: null,
  dest: 'instrumentsPath',
  require: false,
  example: '/path/to/instruments',
  help: '(IOS-only) path to instruments binary'
}], [['--nodeconfig'], {
  required: false,
  defaultValue: null,
  dest: 'nodeconfig',
  help: 'Configuration JSON file to register appium with selenium grid',
  example: '/abs/path/to/nodeconfig.json'
}], [['-ra', '--robot-address'], {
  defaultValue: '0.0.0.0',
  dest: 'robotAddress',
  required: false,
  example: '0.0.0.0',
  help: 'IP Address of robot'
}], [['-rp', '--robot-port'], {
  defaultValue: -1,
  dest: 'robotPort',
  required: false,
  type: 'int',
  example: '4242',
  help: 'port for robot'
}], [['--selendroid-port'], {
  defaultValue: 8080,
  dest: 'selendroidPort',
  required: false,
  type: 'int',
  example: '8080',
  help: 'Local port used for communication with Selendroid'
}], [['--chromedriver-port'], {
  defaultValue: null,
  dest: 'chromeDriverPort',
  required: false,
  type: 'int',
  example: '9515',
  help: 'Port upon which ChromeDriver will run. If not given, Android driver will pick a random available port.'
}], [['--chromedriver-executable'], {
  defaultValue: null,
  dest: 'chromedriverExecutable',
  required: false,
  help: 'ChromeDriver executable full path'
}], [['--show-config'], {
  defaultValue: false,
  dest: 'showConfig',
  action: 'storeTrue',
  required: false,
  help: 'Show info about the appium server configuration and exit'
}], [['--no-perms-check'], {
  defaultValue: false,
  dest: 'noPermsCheck',
  action: 'storeTrue',
  required: false,
  help: 'Bypass Appium\'s checks to ensure we can read/write necessary files'
}], [['--strict-caps'], {
  defaultValue: false,
  dest: 'enforceStrictCaps',
  action: 'storeTrue',
  required: false,
  help: 'Cause sessions to fail if desired caps are sent in that Appium ' + 'does not recognize as valid for the selected device',
  nargs: 0
}], [['--isolate-sim-device'], {
  defaultValue: false,
  dest: 'isolateSimDevice',
  action: 'storeTrue',
  required: false,
  help: 'Xcode 6 has a bug on some platforms where a certain simulator ' + 'can only be launched without error if all other simulator devices ' + 'are first deleted. This option causes Appium to delete all ' + 'devices other than the one being used by Appium. Note that this ' + 'is a permanent deletion, and you are responsible for using simctl ' + 'or xcode to manage the categories of devices used with Appium.',
  nargs: 0
}], [['--tmp'], {
  defaultValue: null,
  dest: 'tmpDir',
  required: false,
  help: 'Absolute path to directory Appium can use to manage temporary ' + 'files, like built-in iOS apps it needs to move around. On *nix/Mac ' + 'defaults to /tmp, on Windows defaults to C:\\Windows\\Temp'
}], [['--trace-dir'], {
  defaultValue: null,
  dest: 'traceDir',
  required: false,
  help: 'Absolute path to directory Appium use to save ios instruments ' + 'traces, defaults to <tmp dir>/appium-instruments'
}], [['--debug-log-spacing'], {
  dest: 'debugLogSpacing',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: 'Add exaggerated spacing in logs to help with visual inspection'
}], [['--suppress-adb-kill-server'], {
  dest: 'suppressKillServer',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: '(Android-only) If set, prevents Appium from killing the adb server instance',
  nargs: 0
}], [['--async-trace'], {
  dest: 'asyncTrace',
  defaultValue: false,
  required: false,
  action: 'storeTrue',
  help: 'Add long stack traces to log entries. Recommended for debugging only.'
}], [['--webkit-debug-proxy-port'], {
  defaultValue: 27753,
  dest: 'webkitDebugProxyPort',
  required: false,
  type: 'int',
  example: "27753",
  help: '(IOS-only) Local port used for communication with ios-webkit-debug-proxy'
}], [['--webdriveragent-port'], {
  defaultValue: 8100,
  dest: 'wdaLocalPort',
  required: false,
  type: 'int',
  example: "8100",
  help: '(IOS-only, XCUITest-only) Local port used for communication with WebDriverAgent'
}], [['-dc', '--default-capabilities'], {
  dest: 'defaultCapabilities',
  defaultValue: {},
  type: parseDefaultCaps,
  required: false,
  example: '[ \'{"app": "myapp.app", "deviceName": "iPhone Simulator"}\' ' + '| /path/to/caps.json ]',
  help: 'Set the default desired capabilities, which will be set on each ' + 'session unless overridden by received capabilities.'
}]];

var deprecatedArgs = [[['--command-timeout'], {
  defaultValue: 60,
  dest: 'defaultCommandTimeout',
  type: 'int',
  required: false,
  help: '[DEPRECATED] No effect. This used to be the default command ' + 'timeout for the server to use for all sessions (in seconds and ' + 'should be less than 2147483). Use newCommandTimeout cap instead'
}], [['-k', '--keep-artifacts'], {
  defaultValue: false,
  dest: 'keepArtifacts',
  action: 'storeTrue',
  required: false,
  help: '[DEPRECATED] - no effect, trace is now in tmp dir by default and is ' + 'cleared before each run. Please also refer to the --trace-dir flag.',
  nargs: 0
}], [['--platform-name'], {
  dest: 'platformName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'iOS',
  help: '[DEPRECATED] - Name of the mobile platform: iOS, Android, or FirefoxOS'
}], [['--platform-version'], {
  dest: 'platformVersion',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: '7.1',
  help: '[DEPRECATED] - Version of the mobile platform'
}], [['--automation-name'], {
  dest: 'automationName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'Appium',
  help: '[DEPRECATED] - Name of the automation tool: Appium or Selendroid'
}], [['--device-name'], {
  dest: 'deviceName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'iPhone Retina (4-inch), Android Emulator',
  help: '[DEPRECATED] - Name of the mobile device to use'
}], [['--browser-name'], {
  dest: 'browserName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'Safari',
  help: '[DEPRECATED] - Name of the mobile browser: Safari or Chrome'
}], [['--app'], {
  dest: 'app',
  required: false,
  defaultValue: null,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - IOS: abs path to simulator-compiled .app file or the bundle_id of the desired target on device; Android: abs path to .apk file',
  example: '/abs/path/to/my.app'
}], [['-lt', '--launch-timeout'], {
  defaultValue: 90000,
  dest: 'launchTimeout',
  type: 'int',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS-only) how long in ms to wait for Instruments to launch'
}], [['--language'], {
  defaultValue: null,
  dest: 'language',
  required: false,
  example: 'en',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Language for the iOS simulator / Android Emulator'
}], [['--locale'], {
  defaultValue: null,
  dest: 'locale',
  required: false,
  example: 'en_US',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Locale for the iOS simulator / Android Emulator'
}], [['-U', '--udid'], {
  dest: 'udid',
  required: false,
  defaultValue: null,
  example: '1adsf-sdfas-asdf-123sdf',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Unique device identifier of the connected physical device'
}], [['--orientation'], {
  dest: 'orientation',
  defaultValue: null,
  required: false,
  example: 'LANDSCAPE',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) use LANDSCAPE or PORTRAIT to initialize all requests ' + 'to this orientation'
}], [['--no-reset'], {
  defaultValue: false,
  dest: 'noReset',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Do not reset app state between sessions (IOS: do not delete app ' + 'plist files; Android: do not uninstall app before new session)',
  nargs: 0
}], [['--full-reset'], {
  defaultValue: false,
  dest: 'fullReset',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS) Delete the entire simulator folder. (Android) Reset app ' + 'state by uninstalling app instead of clearing app data. On ' + 'Android, this will also remove the app after the session is complete.',
  nargs: 0
}], [['--app-pkg'], {
  dest: 'appPackage',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'com.example.android.myApp',
  help: '[DEPRECATED] - (Android-only) Java package of the Android app you want to run ' + '(e.g., com.example.android.myApp)'
}], [['--app-activity'], {
  dest: 'appActivity',
  defaultValue: null,
  required: false,
  example: 'MainActivity',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Activity name for the Android activity you want ' + 'to launch from your package (e.g., MainActivity)'
}], [['--app-wait-package'], {
  dest: 'appWaitPackage',
  defaultValue: false,
  required: false,
  example: 'com.example.android.myApp',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Package name for the Android activity you want ' + 'to wait for (e.g., com.example.android.myApp)'
}], [['--app-wait-activity'], {
  dest: 'appWaitActivity',
  defaultValue: false,
  required: false,
  example: 'SplashActivity',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Activity name for the Android activity you want ' + 'to wait for (e.g., SplashActivity)'
}], [['--device-ready-timeout'], {
  dest: 'deviceReadyTimeout',
  defaultValue: 5,
  required: false,
  type: 'int',
  example: '5',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Timeout in seconds while waiting for device to become ready'
}], [['--android-coverage'], {
  dest: 'androidCoverage',
  defaultValue: false,
  required: false,
  example: 'com.my.Pkg/com.my.Pkg.instrumentation.MyInstrumentation',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Fully qualified instrumentation class. Passed to -w in ' + 'adb shell am instrument -e coverage true -w '
}], [['--avd'], {
  dest: 'avd',
  defaultValue: null,
  required: false,
  example: '@default',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Name of the avd to launch'
}], [['--avd-args'], {
  dest: 'avdArgs',
  defaultValue: null,
  required: false,
  example: '-no-snapshot-load',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Additional emulator arguments to launch the avd'
}], [['--use-keystore'], {
  defaultValue: false,
  dest: 'useKeystore',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) When set the keystore will be used to sign apks.'
}], [['--keystore-path'], {
  defaultValue: _path2['default'].resolve(process.env.HOME || process.env.USERPROFILE || '', '.android', 'debug.keystore'),
  dest: 'keystorePath',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Path to keystore'
}], [['--keystore-password'], {
  defaultValue: 'android',
  dest: 'keystorePassword',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Password to keystore'
}], [['--key-alias'], {
  defaultValue: 'androiddebugkey',
  dest: 'keyAlias',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Key alias'
}], [['--key-password'], {
  defaultValue: 'android',
  dest: 'keyPassword',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Key password'
}], [['--intent-action'], {
  dest: 'intentAction',
  defaultValue: 'android.intent.action.MAIN',
  required: false,
  example: 'android.intent.action.MAIN',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Intent action which will be used to start activity'
}], [['--intent-category'], {
  dest: 'intentCategory',
  defaultValue: 'android.intent.category.LAUNCHER',
  required: false,
  example: 'android.intent.category.APP_CONTACTS',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Intent category which will be used to start activity'
}], [['--intent-flags'], {
  dest: 'intentFlags',
  defaultValue: '0x10200000',
  required: false,
  example: '0x10200000',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Flags that will be used to start activity'
}], [['--intent-args'], {
  dest: 'optionalIntentArguments',
  defaultValue: null,
  required: false,
  example: '0x10200000',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Additional intent arguments that will be used to ' + 'start activity'
}], [['--dont-stop-app-on-reset'], {
  dest: 'dontStopAppOnReset',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) When included, refrains from stopping the app before restart'
}], [['--calendar-format'], {
  defaultValue: null,
  dest: 'calendarFormat',
  required: false,
  example: 'gregorian',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) calendar format for the iOS simulator'
}], [['--native-instruments-lib'], {
  defaultValue: false,
  dest: 'nativeInstrumentsLib',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) IOS has a weird built-in unavoidable ' + 'delay. We patch this in appium. If you do not want it patched, ' + 'pass in this flag.',
  nargs: 0
}], [['--keep-keychains'], {
  defaultValue: false,
  dest: 'keepKeyChains',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS-only) Whether to keep keychains (Library/Keychains) when reset app between sessions',
  nargs: 0
}], [['--localizable-strings-dir'], {
  required: false,
  dest: 'localizableStringsDir',
  defaultValue: 'en.lproj',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) the relative path of the dir where Localizable.strings file resides ',
  example: 'en.lproj'
}], [['--show-ios-log'], {
  defaultValue: false,
  dest: 'showIOSLog',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) if set, the iOS system log will be written to the console',
  nargs: 0
}], [['--enable-heapdump'], {
  defaultValue: false,
  dest: 'heapdumpEnabled',
  action: 'storeTrue',
  required: false,
  help: 'Enable collection of NodeJS memory heap dumps. This is useful for memory leaks lookup',
  nargs: 0
}], [['--relaxed-security'], {
  defaultValue: false,
  dest: 'relaxedSecurityEnabled',
  action: 'storeTrue',
  required: false,
  help: 'Disable additional security checks, so it is possible to use some advanced features, provided ' + 'by drivers supporting this option. Only enable it if all the ' + 'clients are in the trusted network and it\'s not the case if a client could potentially ' + 'break out of the session sandbox.',
  nargs: 0
}]];

function updateParseArgsForDefaultCapabilities(parser) {
  // here we want to update the parser.parseArgs() function
  // in order to bring together all the args that are actually
  // default caps.
  // once those deprecated args are actually removed, this
  // can also be removed
  parser._parseArgs = parser.parseArgs;
  parser.parseArgs = function (args) {
    var parsedArgs = parser._parseArgs(args);
    parsedArgs.defaultCapabilities = parsedArgs.defaultCapabilities || {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(deprecatedArgs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var argEntry = _step.value;

        var arg = argEntry[1].dest;
        if (argEntry[1].deprecatedFor === '--default-capabilities') {
          if (arg in parsedArgs && parsedArgs[arg] !== argEntry[1].defaultValue) {
            parsedArgs.defaultCapabilities[arg] = parsedArgs[arg];
            // j s h i n t can't handle complex interpolated strings
            var capDict = _defineProperty({}, arg, parsedArgs[arg]);
            argEntry[1].deprecatedFor = '--default-capabilities ' + ('\'' + JSON.stringify(capDict) + '\'');
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return parsedArgs;
  };
}

function parseDefaultCaps(caps) {
  try {
    // use synchronous file access, as `argparse` provides no way of either
    // awaiting or using callbacks. This step happens in startup, in what is
    // effectively command-line code, so nothing is blocked in terms of
    // sessions, so holding up the event loop does not incur the usual
    // drawbacks.
    if (_fs2['default'].statSync(caps).isFile()) {
      caps = _fs2['default'].readFileSync(caps, 'utf8');
    }
  } catch (err) {
    // not a file, or not readable
  }
  caps = JSON.parse(caps);
  if (!_lodash2['default'].isPlainObject(caps)) {
    throw 'Invalid format for default capabilities';
  }
  return caps;
}

function getParser() {
  var parser = new _argparse.ArgumentParser({
    version: _packageJson2['default'].version,
    addHelp: true,
    description: 'A webdriver-compatible server for use with native and hybrid iOS and Android applications.',
    prog: process.argv[1] || 'Appium'
  });
  var allArgs = _lodash2['default'].union(args, deprecatedArgs);
  parser.rawArgs = allArgs;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(allArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var arg = _step2.value;

      parser.addArgument(arg[0], arg[1]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  updateParseArgsForDefaultCapabilities(parser);

  return parser;
}

function getDefaultArgs() {
  var defaults = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(args), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2);

      var arg = _step3$value[1];

      defaults[arg.dest] = arg.defaultValue;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return defaults;
}

exports['default'] = getParser;
exports.getDefaultArgs = getDefaultArgs;
exports.getParser = getParser;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O3NCQUNULFFBQVE7Ozs7d0JBQ1MsVUFBVTs7MkJBQ3RCLG9CQUFvQjs7Ozs7O0FBR3ZDLElBQU0sSUFBSSxHQUFHLENBQ1gsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ1osVUFBUSxFQUFFLEtBQUs7QUFDZixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLE9BQUssRUFBRSxDQUFDO0FBQ1IsTUFBSSxFQUFFLE9BQU87Q0FDZCxDQUFDLEVBRUYsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ2IsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLFFBQVE7QUFDZCxRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSwwRUFBMEU7QUFDaEYsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsVUFBUSxFQUFFLEtBQUs7QUFDZixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsMkNBQTJDO0FBQ2pELFNBQU8sRUFBRSxxQkFBcUI7QUFDOUIsTUFBSSxFQUFFLEtBQUs7Q0FDWixDQUFDLEVBRUYsQ0FBQyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsRUFBRTtBQUNwQixjQUFZLEVBQUUsU0FBUztBQUN2QixVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSxTQUFTO0FBQ2xCLE1BQUksRUFBRSx5QkFBeUI7QUFDL0IsTUFBSSxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxFQUVGLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDakIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsS0FBSztBQUNYLFNBQU8sRUFBRSxNQUFNO0FBQ2YsTUFBSSxFQUFFLG1CQUFtQjtBQUN6QixNQUFJLEVBQUUsTUFBTTtDQUNiLENBQUMsRUFFRixDQUFDLENBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLEVBQUU7QUFDOUIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFNBQU8sRUFBRSxXQUFXO0FBQ3BCLE1BQUksRUFBRSxrREFBa0Q7Q0FDekQsQ0FBQyxFQUVGLENBQUMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsRUFBRTtBQUMzQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxjQUFjO0FBQ3BCLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSxLQUFLO0FBQ1gsU0FBTyxFQUFFLE1BQU07QUFDZixNQUFJLEVBQUUsdUNBQXVDO0NBQzlDLENBQUMsRUFFRixDQUFDLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLEVBQUU7QUFDNUIsY0FBWSxFQUFFLElBQUk7QUFDbEIsTUFBSSxFQUFFLGVBQWU7QUFDckIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsS0FBSztBQUNYLFNBQU8sRUFBRSxNQUFNO0FBQ2YsTUFBSSxFQUFFLHdEQUF3RDtDQUMvRCxDQUFDLEVBRUYsQ0FBQyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxFQUFFO0FBQzVCLGNBQVksRUFBRSxDQUFDO0FBQ2YsTUFBSSxFQUFFLGdCQUFnQjtBQUN0QixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxLQUFLO0FBQ1gsU0FBTyxFQUFFLEdBQUc7QUFDWixNQUFJLEVBQUUsMkRBQTJELEdBQzNELHVDQUF1QztDQUM5QyxDQUFDLEVBRUYsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDdkIsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLGlCQUFpQjtBQUN2QixRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSx1Q0FBdUM7QUFDN0MsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsRUFBRTtBQUN2QixjQUFZLEVBQUUsS0FBSztBQUNuQixNQUFJLEVBQUUsUUFBUTtBQUNkLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLCtEQUErRCxHQUMvRCxpRUFBaUU7QUFDdkUsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRTtBQUNoQixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsS0FBSztBQUNYLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLHFCQUFxQjtBQUM5QixNQUFJLEVBQUUsbUNBQW1DO0NBQzFDLENBQUMsRUFFRixDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEIsU0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFDNUQsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFDNUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQztBQUM1RSxjQUFZLEVBQUUsT0FBTztBQUNyQixNQUFJLEVBQUUsVUFBVTtBQUNoQixVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLE1BQUksRUFBRSxvREFBb0Q7Q0FDM0QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3BCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLG1DQUFtQztBQUN6QyxPQUFLLEVBQUUsQ0FBQztBQUNSLFFBQU0sRUFBRSxXQUFXO0FBQ25CLE1BQUksRUFBRSxjQUFjO0NBQ3JCLENBQUMsRUFFRixDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRTtBQUNyQixjQUFZLEVBQUUsS0FBSztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxtQ0FBbUM7QUFDekMsT0FBSyxFQUFFLENBQUM7QUFDUixRQUFNLEVBQUUsV0FBVztBQUNuQixNQUFJLEVBQUUsZUFBZTtDQUN0QixDQUFDLEVBRUYsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDcEIsY0FBWSxFQUFFLEtBQUs7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUscUNBQXFDO0FBQzNDLE9BQUssRUFBRSxDQUFDO0FBQ1IsUUFBTSxFQUFFLFdBQVc7QUFDbkIsTUFBSSxFQUFFLGFBQWE7Q0FDcEIsQ0FBQyxFQUVGLENBQUMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUU7QUFDcEIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsZ0JBQWdCO0FBQ3pCLE1BQUksRUFBRSxTQUFTO0FBQ2YsTUFBSSxFQUFFLDRDQUE0QztDQUNuRCxDQUFDLEVBRUYsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ2IsY0FBWSxFQUFFLEtBQUs7QUFDbkIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsTUFBSSxFQUFFLFFBQVE7QUFDZCxVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSwrQkFBK0I7QUFDckMsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQzVCLE1BQUksRUFBRSxlQUFlO0FBQ3JCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLGtFQUFrRSxHQUNsRSxxQkFBcUI7Q0FDNUIsQ0FBQyxFQUVGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQ25CLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxhQUFhO0FBQ25CLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLGtFQUFrRTtBQUN4RSxPQUFLLEVBQUUsQ0FBQztDQUNULENBQUMsRUFFRixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDakIsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLFdBQVc7QUFDakIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsZ0VBQWdFO0FBQ3RFLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3BCLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSw2QkFBNkI7QUFDbkMsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsb0NBQW9DO0FBQzdDLE1BQUksRUFBRSx3REFBd0Q7Q0FDL0QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNsQixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLFNBQU8sRUFBRSxLQUFLO0FBQ2QsU0FBTyxFQUFFLHNCQUFzQjtBQUMvQixNQUFJLEVBQUUsdUNBQXVDO0NBQzlDLENBQUMsRUFFRixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDakIsVUFBUSxFQUFFLEtBQUs7QUFDZixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsWUFBWTtBQUNsQixNQUFJLEVBQUUsK0RBQStEO0FBQ3JFLFNBQU8sRUFBRSw4QkFBOEI7Q0FDeEMsQ0FBQyxFQUVGLENBQUMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsRUFBRTtBQUMzQixjQUFZLEVBQUUsU0FBUztBQUN2QixNQUFJLEVBQUUsY0FBYztBQUNwQixVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSxTQUFTO0FBQ2xCLE1BQUksRUFBRSxxQkFBcUI7Q0FDNUIsQ0FBQyxFQUVGLENBQUMsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLEVBQUU7QUFDeEIsY0FBWSxFQUFFLENBQUMsQ0FBQztBQUNoQixNQUFJLEVBQUUsV0FBVztBQUNqQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxLQUFLO0FBQ1gsU0FBTyxFQUFFLE1BQU07QUFDZixNQUFJLEVBQUUsZ0JBQWdCO0NBQ3ZCLENBQUMsRUFFRixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUN0QixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLEtBQUs7QUFDWCxTQUFPLEVBQUUsTUFBTTtBQUNmLE1BQUksRUFBRSxtREFBbUQ7Q0FDMUQsQ0FBQyxFQUVGLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO0FBQ3hCLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSxrQkFBa0I7QUFDeEIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsS0FBSztBQUNYLFNBQU8sRUFBRSxNQUFNO0FBQ2YsTUFBSSxFQUFFLHdHQUF3RztDQUMvRyxDQUFDLEVBRUYsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQUU7QUFDOUIsY0FBWSxFQUFFLElBQUk7QUFDbEIsTUFBSSxFQUFFLHdCQUF3QjtBQUM5QixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxtQ0FBbUM7Q0FDMUMsQ0FBQyxFQUVGLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNsQixjQUFZLEVBQUUsS0FBSztBQUNuQixNQUFJLEVBQUUsWUFBWTtBQUNsQixRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSwwREFBMEQ7Q0FDakUsQ0FBQyxFQUVGLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO0FBQ3JCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxjQUFjO0FBQ3BCLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLHFFQUFxRTtDQUM1RSxDQUFDLEVBRUYsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQ2xCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxtQkFBbUI7QUFDekIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsaUVBQWlFLEdBQ2pFLHFEQUFxRDtBQUMzRCxPQUFLLEVBQUUsQ0FBQztDQUNULENBQUMsRUFFRixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRTtBQUN6QixjQUFZLEVBQUUsS0FBSztBQUNuQixNQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLGdFQUFnRSxHQUNoRSxvRUFBb0UsR0FDcEUsNkRBQTZELEdBQzdELGtFQUFrRSxHQUNsRSxvRUFBb0UsR0FDcEUsZ0VBQWdFO0FBQ3RFLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSxRQUFRO0FBQ2QsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsZ0VBQWdFLEdBQ2hFLHFFQUFxRSxHQUNyRSw0REFBNEQ7Q0FDbkUsQ0FBQyxFQUVGLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoQixjQUFZLEVBQUUsSUFBSTtBQUNsQixNQUFJLEVBQUUsVUFBVTtBQUNoQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxnRUFBZ0UsR0FDaEUsa0RBQWtEO0NBQ3pELENBQUMsRUFFRixDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRTtBQUN4QixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLGdFQUFnRTtDQUN2RSxDQUFDLEVBRUYsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDL0IsTUFBSSxFQUFFLG9CQUFvQjtBQUMxQixjQUFZLEVBQUUsS0FBSztBQUNuQixRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSw2RUFBNkU7QUFDbkYsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQ2xCLE1BQUksRUFBRSxZQUFZO0FBQ2xCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsUUFBTSxFQUFFLFdBQVc7QUFDbkIsTUFBSSxFQUFFLHVFQUF1RTtDQUM5RSxDQUFDLEVBRUYsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQUU7QUFDOUIsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLHNCQUFzQjtBQUM1QixVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSxLQUFLO0FBQ1gsU0FBTyxFQUFFLE9BQU87QUFDaEIsTUFBSSxFQUFFLDBFQUEwRTtDQUNqRixDQUFDLEVBRUYsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLEVBQUU7QUFDMUIsY0FBWSxFQUFFLElBQUk7QUFDbEIsTUFBSSxFQUFFLGNBQWM7QUFDcEIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsS0FBSztBQUNYLFNBQU8sRUFBRSxNQUFNO0FBQ2YsTUFBSSxFQUFFLGlGQUFpRjtDQUN4RixDQUFDLEVBRUYsQ0FBQyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsQ0FBQyxFQUFFO0FBQ2xDLE1BQUksRUFBRSxxQkFBcUI7QUFDM0IsY0FBWSxFQUFFLEVBQUU7QUFDaEIsTUFBSSxFQUFFLGdCQUFnQjtBQUN0QixVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSwrREFBK0QsR0FDL0Qsd0JBQXdCO0FBQ2pDLE1BQUksRUFBRSxrRUFBa0UsR0FDbEUscURBQXFEO0NBQzVELENBQUMsQ0FDSCxDQUFDOztBQUVGLElBQU0sY0FBYyxHQUFHLENBQ3JCLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ3RCLGNBQVksRUFBRSxFQUFFO0FBQ2hCLE1BQUksRUFBRSx1QkFBdUI7QUFDN0IsTUFBSSxFQUFFLEtBQUs7QUFDWCxVQUFRLEVBQUUsS0FBSztBQUNmLE1BQUksRUFBRSw4REFBOEQsR0FDOUQsaUVBQWlFLEdBQ2pFLGlFQUFpRTtDQUN4RSxDQUFDLEVBRUYsQ0FBQyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO0FBQzNCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxlQUFlO0FBQ3JCLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLHNFQUFzRSxHQUN0RSxxRUFBcUU7QUFDM0UsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDLEVBRUYsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDcEIsTUFBSSxFQUFFLGNBQWM7QUFDcEIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLFNBQU8sRUFBRSxLQUFLO0FBQ2QsTUFBSSxFQUFFLHdFQUF3RTtDQUMvRSxDQUFDLEVBRUYsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDdkIsTUFBSSxFQUFFLGlCQUFpQjtBQUN2QixjQUFZLEVBQUUsSUFBSTtBQUNsQixVQUFRLEVBQUUsS0FBSztBQUNmLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsU0FBTyxFQUFFLEtBQUs7QUFDZCxNQUFJLEVBQUUsK0NBQStDO0NBQ3RELENBQUMsRUFFRixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUN0QixNQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxTQUFPLEVBQUUsUUFBUTtBQUNqQixNQUFJLEVBQUUsa0VBQWtFO0NBQ3pFLENBQUMsRUFFRixDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDbEIsTUFBSSxFQUFFLFlBQVk7QUFDbEIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLFNBQU8sRUFBRSwwQ0FBMEM7QUFDbkQsTUFBSSxFQUFFLGlEQUFpRDtDQUN4RCxDQUFDLEVBRUYsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7QUFDbkIsTUFBSSxFQUFFLGFBQWE7QUFDbkIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLFNBQU8sRUFBRSxRQUFRO0FBQ2pCLE1BQUksRUFBRSw2REFBNkQ7Q0FDcEUsQ0FBQyxFQUVGLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLE1BQUksRUFBRSxLQUFLO0FBQ1gsVUFBUSxFQUFFLEtBQUs7QUFDZixjQUFZLEVBQUUsSUFBSTtBQUNsQixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSwrSUFBK0k7QUFDckosU0FBTyxFQUFFLHFCQUFxQjtDQUMvQixDQUFDLEVBRUYsQ0FBQyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO0FBQzVCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxlQUFlO0FBQ3JCLE1BQUksRUFBRSxLQUFLO0FBQ1gsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSw0RUFBNEU7Q0FDbkYsQ0FBQyxFQUVGLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNmLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSxVQUFVO0FBQ2hCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLElBQUk7QUFDYixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxrRUFBa0U7Q0FDekUsQ0FBQyxFQUVGLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNiLGNBQVksRUFBRSxJQUFJO0FBQ2xCLE1BQUksRUFBRSxRQUFRO0FBQ2QsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsT0FBTztBQUNoQixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxnRUFBZ0U7Q0FDdkUsQ0FBQyxFQUVGLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDakIsTUFBSSxFQUFFLE1BQU07QUFDWixVQUFRLEVBQUUsS0FBSztBQUNmLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFNBQU8sRUFBRSx5QkFBeUI7QUFDbEMsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsMEVBQTBFO0NBQ2pGLENBQUMsRUFFRixDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDbEIsTUFBSSxFQUFFLGFBQWE7QUFDbkIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsV0FBVztBQUNwQixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxpRkFBaUYsR0FDakYscUJBQXFCO0NBQzVCLENBQUMsRUFFRixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDZixjQUFZLEVBQUUsS0FBSztBQUNuQixNQUFJLEVBQUUsU0FBUztBQUNmLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsaUZBQWlGLEdBQ2pGLGdFQUFnRTtBQUN0RSxPQUFLLEVBQUUsQ0FBQztDQUNULENBQUMsRUFFRixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDakIsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLFdBQVc7QUFDakIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSwrRUFBK0UsR0FDL0UsNkRBQTZELEdBQzdELHVFQUF1RTtBQUM3RSxPQUFLLEVBQUUsQ0FBQztDQUNULENBQUMsRUFFRixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDZCxNQUFJLEVBQUUsWUFBWTtBQUNsQixjQUFZLEVBQUUsSUFBSTtBQUNsQixVQUFRLEVBQUUsS0FBSztBQUNmLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsU0FBTyxFQUFFLDJCQUEyQjtBQUNwQyxNQUFJLEVBQUUsZ0ZBQWdGLEdBQ2hGLG1DQUFtQztDQUMxQyxDQUFDLEVBRUYsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7QUFDbkIsTUFBSSxFQUFFLGFBQWE7QUFDbkIsY0FBWSxFQUFFLElBQUk7QUFDbEIsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsY0FBYztBQUN2QixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxnRkFBZ0YsR0FDaEYsa0RBQWtEO0NBQ3pELENBQUMsRUFFRixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN2QixNQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLDJCQUEyQjtBQUNwQyxlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSwrRUFBK0UsR0FDL0UsK0NBQStDO0NBQ3RELENBQUMsRUFFRixDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRTtBQUN4QixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLGdCQUFnQjtBQUN6QixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxnRkFBZ0YsR0FDaEYsb0NBQW9DO0NBQzNDLENBQUMsRUFFRixDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFBRTtBQUMzQixNQUFJLEVBQUUsb0JBQW9CO0FBQzFCLGNBQVksRUFBRSxDQUFDO0FBQ2YsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsS0FBSztBQUNYLFNBQU8sRUFBRSxHQUFHO0FBQ1osZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsMkZBQTJGO0NBQ2xHLENBQUMsRUFFRixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN2QixNQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLGNBQVksRUFBRSxLQUFLO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLHlEQUF5RDtBQUNsRSxlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSx1RkFBdUYsR0FDdkYsOENBQThDO0NBQ3JELENBQUMsRUFFRixDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixNQUFJLEVBQUUsS0FBSztBQUNYLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLFVBQVU7QUFDbkIsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUseURBQXlEO0NBQ2hFLENBQUMsRUFFRixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDZixNQUFJLEVBQUUsU0FBUztBQUNmLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLG1CQUFtQjtBQUM1QixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSwrRUFBK0U7Q0FDdEYsQ0FBQyxFQUVGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQ25CLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxhQUFhO0FBQ25CLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsZ0ZBQWdGO0NBQ3ZGLENBQUMsRUFFRixDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRTtBQUNwQixjQUFZLEVBQUUsa0JBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7QUFDM0csTUFBSSxFQUFFLGNBQWM7QUFDcEIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxnREFBZ0Q7Q0FDdkQsQ0FBQyxFQUVGLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO0FBQ3hCLGNBQVksRUFBRSxTQUFTO0FBQ3ZCLE1BQUksRUFBRSxrQkFBa0I7QUFDeEIsVUFBUSxFQUFFLEtBQUs7QUFDZixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxvREFBb0Q7Q0FDM0QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoQixjQUFZLEVBQUUsaUJBQWlCO0FBQy9CLE1BQUksRUFBRSxVQUFVO0FBQ2hCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUseUNBQXlDO0NBQ2hELENBQUMsRUFFRixDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtBQUNuQixjQUFZLEVBQUUsU0FBUztBQUN2QixNQUFJLEVBQUUsYUFBYTtBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsTUFBSSxFQUFFLDRDQUE0QztDQUNuRCxDQUFDLEVBRUYsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDcEIsTUFBSSxFQUFFLGNBQWM7QUFDcEIsY0FBWSxFQUFFLDRCQUE0QjtBQUMxQyxVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSw0QkFBNEI7QUFDckMsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsa0ZBQWtGO0NBQ3pGLENBQUMsRUFFRixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUN0QixNQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLGNBQVksRUFBRSxrQ0FBa0M7QUFDaEQsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsc0NBQXNDO0FBQy9DLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsTUFBSSxFQUFFLG9GQUFvRjtDQUMzRixDQUFDLEVBRUYsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7QUFDbkIsTUFBSSxFQUFFLGFBQWE7QUFDbkIsY0FBWSxFQUFFLFlBQVk7QUFDMUIsVUFBUSxFQUFFLEtBQUs7QUFDZixTQUFPLEVBQUUsWUFBWTtBQUNyQixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSx5RUFBeUU7Q0FDaEYsQ0FBQyxFQUVGLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNsQixNQUFJLEVBQUUseUJBQXlCO0FBQy9CLGNBQVksRUFBRSxJQUFJO0FBQ2xCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsU0FBTyxFQUFFLFlBQVk7QUFDckIsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUsaUZBQWlGLEdBQ2pGLGdCQUFnQjtDQUN2QixDQUFDLEVBRUYsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLEVBQUU7QUFDN0IsTUFBSSxFQUFFLG9CQUFvQjtBQUMxQixjQUFZLEVBQUUsS0FBSztBQUNuQixRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsTUFBSSxFQUFFLDRGQUE0RjtDQUNuRyxDQUFDLEVBRUYsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDdEIsY0FBWSxFQUFFLElBQUk7QUFDbEIsTUFBSSxFQUFFLGdCQUFnQjtBQUN0QixVQUFRLEVBQUUsS0FBSztBQUNmLFNBQU8sRUFBRSxXQUFXO0FBQ3BCLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsTUFBSSxFQUFFLGlFQUFpRTtDQUN4RSxDQUFDLEVBRUYsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLEVBQUU7QUFDN0IsY0FBWSxFQUFFLEtBQUs7QUFDbkIsTUFBSSxFQUFFLHNCQUFzQjtBQUM1QixRQUFNLEVBQUUsV0FBVztBQUNuQixVQUFRLEVBQUUsS0FBSztBQUNmLGVBQWEsRUFBRSx3QkFBd0I7QUFDdkMsTUFBSSxFQUFFLGlFQUFpRSxHQUNqRSxpRUFBaUUsR0FDakUsb0JBQW9CO0FBQzFCLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO0FBQ3JCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxlQUFlO0FBQ3JCLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUseUdBQXlHO0FBQy9HLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO0FBQzlCLFVBQVEsRUFBRSxLQUFLO0FBQ2YsTUFBSSxFQUFFLHVCQUF1QjtBQUM3QixjQUFZLEVBQUUsVUFBVTtBQUN4QixlQUFhLEVBQUUsd0JBQXdCO0FBQ3ZDLE1BQUksRUFBRSxnR0FBZ0c7QUFDdEcsU0FBTyxFQUFFLFVBQVU7Q0FDcEIsQ0FBQyxFQUVGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQ25CLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxZQUFZO0FBQ2xCLFFBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQVEsRUFBRSxLQUFLO0FBQ2YsZUFBYSxFQUFFLHdCQUF3QjtBQUN2QyxNQUFJLEVBQUUscUZBQXFGO0FBQzNGLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ3RCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSxpQkFBaUI7QUFDdkIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsdUZBQXVGO0FBQzdGLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxFQUVGLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQ3ZCLGNBQVksRUFBRSxLQUFLO0FBQ25CLE1BQUksRUFBRSx3QkFBd0I7QUFDOUIsUUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBUSxFQUFFLEtBQUs7QUFDZixNQUFJLEVBQUUsZ0dBQWdHLEdBQ2hHLCtEQUErRCxHQUMvRCwwRkFBMEYsR0FDMUYsbUNBQW1DO0FBQ3pDLE9BQUssRUFBRSxDQUFDO0NBQ1QsQ0FBQyxDQUNILENBQUM7O0FBRUYsU0FBUyxxQ0FBcUMsQ0FBRSxNQUFNLEVBQUU7Ozs7OztBQU10RCxRQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDckMsUUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUksRUFBRTtBQUNqQyxRQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGNBQVUsQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDOzs7Ozs7QUFDdEUsd0NBQXFCLGNBQWMsNEdBQUU7WUFBNUIsUUFBUTs7QUFDZixZQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzNCLFlBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsS0FBSyx3QkFBd0IsRUFBRTtBQUMxRCxjQUFJLEdBQUcsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDckUsc0JBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXRELGdCQUFJLE9BQU8sdUJBQUssR0FBRyxFQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLG9DQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQUcsQ0FBQztXQUM1RDtTQUNGO09BQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxXQUFPLFVBQVUsQ0FBQztHQUNuQixDQUFDO0NBQ0g7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxJQUFJLEVBQUU7QUFDL0IsTUFBSTs7Ozs7O0FBTUYsUUFBSSxnQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDOUIsVUFBSSxHQUFHLGdCQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdEM7R0FDRixDQUFDLE9BQU8sR0FBRyxFQUFFOztHQUViO0FBQ0QsTUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsTUFBSSxDQUFDLG9CQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMxQixVQUFNLHlDQUF5QyxDQUFDO0dBQ2pEO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLFNBQVMsR0FBSTtBQUNwQixNQUFJLE1BQU0sR0FBRyw2QkFBbUI7QUFDOUIsV0FBTyxFQUFFLHlCQUFPLE9BQU87QUFDdkIsV0FBTyxFQUFFLElBQUk7QUFDYixlQUFXLEVBQUUsNEZBQTRGO0FBQ3pHLFFBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVE7R0FDbEMsQ0FBQyxDQUFDO0FBQ0gsTUFBSSxPQUFPLEdBQUcsb0JBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM1QyxRQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7O0FBQ3pCLHVDQUFnQixPQUFPLGlIQUFFO1VBQWhCLEdBQUc7O0FBQ1YsWUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCx1Q0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUMsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFFRCxTQUFTLGNBQWMsR0FBSTtBQUN6QixNQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7Ozs7OztBQUNsQix1Q0FBb0IsSUFBSSxpSEFBRTs7O1VBQWQsR0FBRzs7QUFDYixjQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7S0FDdkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxTQUFPLFFBQVEsQ0FBQztDQUNqQjs7cUJBRWMsU0FBUztRQUNmLGNBQWMsR0FBZCxjQUFjO1FBQUUsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoibGliL3BhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBcmd1bWVudFBhcnNlciB9IGZyb20gJ2FyZ3BhcnNlJztcclxuaW1wb3J0IHBrZ09iaiBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxyXG5cclxuXHJcbmNvbnN0IGFyZ3MgPSBbXHJcbiAgW1snLS1zaGVsbCddLCB7XHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBoZWxwOiAnRW50ZXIgUkVQTCBtb2RlJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gICAgZGVzdDogJ3NoZWxsJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1yZWJvb3QnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdyZWJvb3QnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSByZWJvb3QgZW11bGF0b3IgYWZ0ZXIgZWFjaCBzZXNzaW9uIGFuZCBraWxsIGl0IGF0IHRoZSBlbmQnLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0taXBhJ10sIHtcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIGFicyBwYXRoIHRvIGNvbXBpbGVkIC5pcGEgZmlsZScsXHJcbiAgICBleGFtcGxlOiAnL2Ficy9wYXRoL3RvL215LmlwYScsXHJcbiAgICBkZXN0OiAnaXBhJyxcclxuICB9XSxcclxuXHJcbiAgW1snLWEnLCAnLS1hZGRyZXNzJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogJzAuMC4wLjAnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJzAuMC4wLjAnLFxyXG4gICAgaGVscDogJ0lQIEFkZHJlc3MgdG8gbGlzdGVuIG9uJyxcclxuICAgIGRlc3Q6ICdhZGRyZXNzJyxcclxuICB9XSxcclxuXHJcbiAgW1snLXAnLCAnLS1wb3J0J10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogNDcyMyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogJzQ3MjMnLFxyXG4gICAgaGVscDogJ3BvcnQgdG8gbGlzdGVuIG9uJyxcclxuICAgIGRlc3Q6ICdwb3J0JyxcclxuICB9XSxcclxuXHJcbiAgW1snLWNhJywgJy0tY2FsbGJhY2stYWRkcmVzcyddLCB7XHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXN0OiAnY2FsbGJhY2tBZGRyZXNzJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGV4YW1wbGU6ICcxMjcuMC4wLjEnLFxyXG4gICAgaGVscDogJ2NhbGxiYWNrIElQIEFkZHJlc3MgKGRlZmF1bHQ6IHNhbWUgYXMgLS1hZGRyZXNzKScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy1jcCcsICctLWNhbGxiYWNrLXBvcnQnXSwge1xyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVzdDogJ2NhbGxiYWNrUG9ydCcsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICB0eXBlOiAnaW50JyxcclxuICAgIGV4YW1wbGU6ICc0NzIzJyxcclxuICAgIGhlbHA6ICdjYWxsYmFjayBwb3J0IChkZWZhdWx0OiBzYW1lIGFzIHBvcnQpJyxcclxuICB9XSxcclxuXHJcbiAgW1snLWJwJywgJy0tYm9vdHN0cmFwLXBvcnQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiA0NzI0LFxyXG4gICAgZGVzdDogJ2Jvb3RzdHJhcFBvcnQnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgdHlwZTogJ2ludCcsXHJcbiAgICBleGFtcGxlOiAnNDcyNCcsXHJcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgcG9ydCB0byB1c2Ugb24gZGV2aWNlIHRvIHRhbGsgdG8gQXBwaXVtJyxcclxuICB9XSxcclxuXHJcbiAgW1snLXInLCAnLS1iYWNrZW5kLXJldHJpZXMnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAzLFxyXG4gICAgZGVzdDogJ2JhY2tlbmRSZXRyaWVzJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogJzMnLFxyXG4gICAgaGVscDogJyhpT1Mtb25seSkgSG93IG1hbnkgdGltZXMgdG8gcmV0cnkgbGF1bmNoaW5nIEluc3RydW1lbnRzICcgK1xyXG4gICAgICAgICAgJ2JlZm9yZSBzYXlpbmcgaXQgY3Jhc2hlZCBvciB0aW1lZCBvdXQnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLXNlc3Npb24tb3ZlcnJpZGUnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdzZXNzaW9uT3ZlcnJpZGUnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICdFbmFibGVzIHNlc3Npb24gb3ZlcnJpZGUgKGNsb2JiZXJpbmcpJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctbCcsICctLXByZS1sYXVuY2gnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdsYXVuY2gnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICdQcmUtbGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBiZWZvcmUgYWxsb3dpbmcgdGhlIGZpcnN0IHNlc3Npb24gJyArXHJcbiAgICAgICAgICAnKFJlcXVpcmVzIC0tYXBwIGFuZCwgZm9yIEFuZHJvaWQsIC0tYXBwLXBrZyBhbmQgLS1hcHAtYWN0aXZpdHkpJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctZycsICctLWxvZyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBkZXN0OiAnbG9nJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGV4YW1wbGU6ICcvcGF0aC90by9hcHBpdW0ubG9nJyxcclxuICAgIGhlbHA6ICdBbHNvIHNlbmQgbG9nIG91dHB1dCB0byB0aGlzIGZpbGUnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWxvZy1sZXZlbCddLCB7XHJcbiAgICBjaG9pY2VzOiBbJ2luZm8nLCAnaW5mbzpkZWJ1ZycsICdpbmZvOmluZm8nLCAnaW5mbzp3YXJuJywgJ2luZm86ZXJyb3InLFxyXG4gICAgICAgICAgICAgICd3YXJuJywgJ3dhcm46ZGVidWcnLCAnd2FybjppbmZvJywgJ3dhcm46d2FybicsICd3YXJuOmVycm9yJyxcclxuICAgICAgICAgICAgICAnZXJyb3InLCAnZXJyb3I6ZGVidWcnLCAnZXJyb3I6aW5mbycsICdlcnJvcjp3YXJuJywgJ2Vycm9yOmVycm9yJyxcclxuICAgICAgICAgICAgICAnZGVidWcnLCAnZGVidWc6ZGVidWcnLCAnZGVidWc6aW5mbycsICdkZWJ1Zzp3YXJuJywgJ2RlYnVnOmVycm9yJ10sXHJcbiAgICBkZWZhdWx0VmFsdWU6ICdkZWJ1ZycsXHJcbiAgICBkZXN0OiAnbG9nbGV2ZWwnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJ2RlYnVnJyxcclxuICAgIGhlbHA6ICdsb2cgbGV2ZWw7IGRlZmF1bHQgKGNvbnNvbGVbOmZpbGVdKTogZGVidWdbOmRlYnVnXScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tbG9nLXRpbWVzdGFtcCddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ1Nob3cgdGltZXN0YW1wcyBpbiBjb25zb2xlIG91dHB1dCcsXHJcbiAgICBuYXJnczogMCxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICBkZXN0OiAnbG9nVGltZXN0YW1wJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1sb2NhbC10aW1lem9uZSddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ1VzZSBsb2NhbCB0aW1lem9uZSBmb3IgdGltZXN0YW1wcycsXHJcbiAgICBuYXJnczogMCxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICBkZXN0OiAnbG9jYWxUaW1lem9uZScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tbG9nLW5vLWNvbG9ycyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ0RvIG5vdCB1c2UgY29sb3JzIGluIGNvbnNvbGUgb3V0cHV0JyxcclxuICAgIG5hcmdzOiAwLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIGRlc3Q6ICdsb2dOb0NvbG9ycycsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy1HJywgJy0td2ViaG9vayddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnbG9jYWxob3N0Ojk4NzYnLFxyXG4gICAgZGVzdDogJ3dlYmhvb2snLFxyXG4gICAgaGVscDogJ0Fsc28gc2VuZCBsb2cgb3V0cHV0IHRvIHRoaXMgSFRUUCBsaXN0ZW5lcicsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tc2FmYXJpJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgZGVzdDogJ3NhZmFyaScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnKElPUy1Pbmx5KSBVc2UgdGhlIHNhZmFyaSBhcHAnLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZGVmYXVsdC1kZXZpY2UnLCAnLWRkJ10sIHtcclxuICAgIGRlc3Q6ICdkZWZhdWx0RGV2aWNlJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJyhJT1MtU2ltdWxhdG9yLW9ubHkpIHVzZSB0aGUgZGVmYXVsdCBzaW11bGF0b3IgdGhhdCBpbnN0cnVtZW50cyAnICtcclxuICAgICAgICAgICdsYXVuY2hlcyBvbiBpdHMgb3duJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1mb3JjZS1pcGhvbmUnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdmb3JjZUlwaG9uZScsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJyhJT1Mtb25seSkgVXNlIHRoZSBpUGhvbmUgU2ltdWxhdG9yIG5vIG1hdHRlciB3aGF0IHRoZSBhcHAgd2FudHMnLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZm9yY2UtaXBhZCddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgZGVzdDogJ2ZvcmNlSXBhZCcsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJyhJT1Mtb25seSkgVXNlIHRoZSBpUGFkIFNpbXVsYXRvciBubyBtYXR0ZXIgd2hhdCB0aGUgYXBwIHdhbnRzJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLXRyYWNldGVtcGxhdGUnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgZGVzdDogJ2F1dG9tYXRpb25UcmFjZVRlbXBsYXRlUGF0aCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnL1VzZXJzL21lL0F1dG9tYXRpb24udHJhY2V0ZW1wbGF0ZScsXHJcbiAgICBoZWxwOiAnKElPUy1vbmx5KSAudHJhY2V0ZW1wbGF0ZSBmaWxlIHRvIHVzZSB3aXRoIEluc3RydW1lbnRzJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1pbnN0cnVtZW50cyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBkZXN0OiAnaW5zdHJ1bWVudHNQYXRoJyxcclxuICAgIHJlcXVpcmU6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJy9wYXRoL3RvL2luc3RydW1lbnRzJyxcclxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIHBhdGggdG8gaW5zdHJ1bWVudHMgYmluYXJ5JyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1ub2RlY29uZmlnJ10sIHtcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlc3Q6ICdub2RlY29uZmlnJyxcclxuICAgIGhlbHA6ICdDb25maWd1cmF0aW9uIEpTT04gZmlsZSB0byByZWdpc3RlciBhcHBpdW0gd2l0aCBzZWxlbml1bSBncmlkJyxcclxuICAgIGV4YW1wbGU6ICcvYWJzL3BhdGgvdG8vbm9kZWNvbmZpZy5qc29uJyxcclxuICB9XSxcclxuXHJcbiAgW1snLXJhJywgJy0tcm9ib3QtYWRkcmVzcyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6ICcwLjAuMC4wJyxcclxuICAgIGRlc3Q6ICdyb2JvdEFkZHJlc3MnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJzAuMC4wLjAnLFxyXG4gICAgaGVscDogJ0lQIEFkZHJlc3Mgb2Ygcm9ib3QnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctcnAnLCAnLS1yb2JvdC1wb3J0J10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogLTEsXHJcbiAgICBkZXN0OiAncm9ib3RQb3J0JyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogJzQyNDInLFxyXG4gICAgaGVscDogJ3BvcnQgZm9yIHJvYm90JyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1zZWxlbmRyb2lkLXBvcnQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiA4MDgwLFxyXG4gICAgZGVzdDogJ3NlbGVuZHJvaWRQb3J0JyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogJzgwODAnLFxyXG4gICAgaGVscDogJ0xvY2FsIHBvcnQgdXNlZCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIFNlbGVuZHJvaWQnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWNocm9tZWRyaXZlci1wb3J0J10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlc3Q6ICdjaHJvbWVEcml2ZXJQb3J0JyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogJzk1MTUnLFxyXG4gICAgaGVscDogJ1BvcnQgdXBvbiB3aGljaCBDaHJvbWVEcml2ZXIgd2lsbCBydW4uIElmIG5vdCBnaXZlbiwgQW5kcm9pZCBkcml2ZXIgd2lsbCBwaWNrIGEgcmFuZG9tIGF2YWlsYWJsZSBwb3J0LicsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tY2hyb21lZHJpdmVyLWV4ZWN1dGFibGUnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgZGVzdDogJ2Nocm9tZWRyaXZlckV4ZWN1dGFibGUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ0Nocm9tZURyaXZlciBleGVjdXRhYmxlIGZ1bGwgcGF0aCcsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tc2hvdy1jb25maWcnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdzaG93Q29uZmlnJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnU2hvdyBpbmZvIGFib3V0IHRoZSBhcHBpdW0gc2VydmVyIGNvbmZpZ3VyYXRpb24gYW5kIGV4aXQnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLW5vLXBlcm1zLWNoZWNrJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBkZXN0OiAnbm9QZXJtc0NoZWNrJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnQnlwYXNzIEFwcGl1bVxcJ3MgY2hlY2tzIHRvIGVuc3VyZSB3ZSBjYW4gcmVhZC93cml0ZSBuZWNlc3NhcnkgZmlsZXMnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLXN0cmljdC1jYXBzJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBkZXN0OiAnZW5mb3JjZVN0cmljdENhcHMnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICdDYXVzZSBzZXNzaW9ucyB0byBmYWlsIGlmIGRlc2lyZWQgY2FwcyBhcmUgc2VudCBpbiB0aGF0IEFwcGl1bSAnICtcclxuICAgICAgICAgICdkb2VzIG5vdCByZWNvZ25pemUgYXMgdmFsaWQgZm9yIHRoZSBzZWxlY3RlZCBkZXZpY2UnLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0taXNvbGF0ZS1zaW0tZGV2aWNlJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBkZXN0OiAnaXNvbGF0ZVNpbURldmljZScsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ1hjb2RlIDYgaGFzIGEgYnVnIG9uIHNvbWUgcGxhdGZvcm1zIHdoZXJlIGEgY2VydGFpbiBzaW11bGF0b3IgJyArXHJcbiAgICAgICAgICAnY2FuIG9ubHkgYmUgbGF1bmNoZWQgd2l0aG91dCBlcnJvciBpZiBhbGwgb3RoZXIgc2ltdWxhdG9yIGRldmljZXMgJyArXHJcbiAgICAgICAgICAnYXJlIGZpcnN0IGRlbGV0ZWQuIFRoaXMgb3B0aW9uIGNhdXNlcyBBcHBpdW0gdG8gZGVsZXRlIGFsbCAnICtcclxuICAgICAgICAgICdkZXZpY2VzIG90aGVyIHRoYW4gdGhlIG9uZSBiZWluZyB1c2VkIGJ5IEFwcGl1bS4gTm90ZSB0aGF0IHRoaXMgJyArXHJcbiAgICAgICAgICAnaXMgYSBwZXJtYW5lbnQgZGVsZXRpb24sIGFuZCB5b3UgYXJlIHJlc3BvbnNpYmxlIGZvciB1c2luZyBzaW1jdGwgJyArXHJcbiAgICAgICAgICAnb3IgeGNvZGUgdG8gbWFuYWdlIHRoZSBjYXRlZ29yaWVzIG9mIGRldmljZXMgdXNlZCB3aXRoIEFwcGl1bS4nLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tdG1wJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlc3Q6ICd0bXBEaXInLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ0Fic29sdXRlIHBhdGggdG8gZGlyZWN0b3J5IEFwcGl1bSBjYW4gdXNlIHRvIG1hbmFnZSB0ZW1wb3JhcnkgJyArXHJcbiAgICAgICAgICAnZmlsZXMsIGxpa2UgYnVpbHQtaW4gaU9TIGFwcHMgaXQgbmVlZHMgdG8gbW92ZSBhcm91bmQuIE9uICpuaXgvTWFjICcgK1xyXG4gICAgICAgICAgJ2RlZmF1bHRzIHRvIC90bXAsIG9uIFdpbmRvd3MgZGVmYXVsdHMgdG8gQzpcXFxcV2luZG93c1xcXFxUZW1wJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS10cmFjZS1kaXInXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgZGVzdDogJ3RyYWNlRGlyJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICdBYnNvbHV0ZSBwYXRoIHRvIGRpcmVjdG9yeSBBcHBpdW0gdXNlIHRvIHNhdmUgaW9zIGluc3RydW1lbnRzICcgK1xyXG4gICAgICAgICAgJ3RyYWNlcywgZGVmYXVsdHMgdG8gPHRtcCBkaXI+L2FwcGl1bS1pbnN0cnVtZW50cycsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZGVidWctbG9nLXNwYWNpbmcnXSwge1xyXG4gICAgZGVzdDogJ2RlYnVnTG9nU3BhY2luZycsXHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGhlbHA6ICdBZGQgZXhhZ2dlcmF0ZWQgc3BhY2luZyBpbiBsb2dzIHRvIGhlbHAgd2l0aCB2aXN1YWwgaW5zcGVjdGlvbicsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tc3VwcHJlc3MtYWRiLWtpbGwtc2VydmVyJ10sIHtcclxuICAgIGRlc3Q6ICdzdXBwcmVzc0tpbGxTZXJ2ZXInLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgSWYgc2V0LCBwcmV2ZW50cyBBcHBpdW0gZnJvbSBraWxsaW5nIHRoZSBhZGIgc2VydmVyIGluc3RhbmNlJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWFzeW5jLXRyYWNlJ10sIHtcclxuICAgIGRlc3Q6ICdhc3luY1RyYWNlJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgaGVscDogJ0FkZCBsb25nIHN0YWNrIHRyYWNlcyB0byBsb2cgZW50cmllcy4gUmVjb21tZW5kZWQgZm9yIGRlYnVnZ2luZyBvbmx5LicsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0td2Via2l0LWRlYnVnLXByb3h5LXBvcnQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAyNzc1MyxcclxuICAgIGRlc3Q6ICd3ZWJraXREZWJ1Z1Byb3h5UG9ydCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICB0eXBlOiAnaW50JyxcclxuICAgIGV4YW1wbGU6IFwiMjc3NTNcIixcclxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIExvY2FsIHBvcnQgdXNlZCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIGlvcy13ZWJraXQtZGVidWctcHJveHknXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0td2ViZHJpdmVyYWdlbnQtcG9ydCddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IDgxMDAsXHJcbiAgICBkZXN0OiAnd2RhTG9jYWxQb3J0JyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIHR5cGU6ICdpbnQnLFxyXG4gICAgZXhhbXBsZTogXCI4MTAwXCIsXHJcbiAgICBoZWxwOiAnKElPUy1vbmx5LCBYQ1VJVGVzdC1vbmx5KSBMb2NhbCBwb3J0IHVzZWQgZm9yIGNvbW11bmljYXRpb24gd2l0aCBXZWJEcml2ZXJBZ2VudCdcclxuICB9XSxcclxuXHJcbiAgW1snLWRjJywgJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnXSwge1xyXG4gICAgZGVzdDogJ2RlZmF1bHRDYXBhYmlsaXRpZXMnLFxyXG4gICAgZGVmYXVsdFZhbHVlOiB7fSxcclxuICAgIHR5cGU6IHBhcnNlRGVmYXVsdENhcHMsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnWyBcXCd7XCJhcHBcIjogXCJteWFwcC5hcHBcIiwgXCJkZXZpY2VOYW1lXCI6IFwiaVBob25lIFNpbXVsYXRvclwifVxcJyAnICtcclxuICAgICAgICAgICAgICd8IC9wYXRoL3RvL2NhcHMuanNvbiBdJyxcclxuICAgIGhlbHA6ICdTZXQgdGhlIGRlZmF1bHQgZGVzaXJlZCBjYXBhYmlsaXRpZXMsIHdoaWNoIHdpbGwgYmUgc2V0IG9uIGVhY2ggJyArXHJcbiAgICAgICAgICAnc2Vzc2lvbiB1bmxlc3Mgb3ZlcnJpZGRlbiBieSByZWNlaXZlZCBjYXBhYmlsaXRpZXMuJ1xyXG4gIH1dLFxyXG5dO1xyXG5cclxuY29uc3QgZGVwcmVjYXRlZEFyZ3MgPSBbXHJcbiAgW1snLS1jb21tYW5kLXRpbWVvdXQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiA2MCxcclxuICAgIGRlc3Q6ICdkZWZhdWx0Q29tbWFuZFRpbWVvdXQnLFxyXG4gICAgdHlwZTogJ2ludCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIE5vIGVmZmVjdC4gVGhpcyB1c2VkIHRvIGJlIHRoZSBkZWZhdWx0IGNvbW1hbmQgJyArXHJcbiAgICAgICAgICAndGltZW91dCBmb3IgdGhlIHNlcnZlciB0byB1c2UgZm9yIGFsbCBzZXNzaW9ucyAoaW4gc2Vjb25kcyBhbmQgJyArXHJcbiAgICAgICAgICAnc2hvdWxkIGJlIGxlc3MgdGhhbiAyMTQ3NDgzKS4gVXNlIG5ld0NvbW1hbmRUaW1lb3V0IGNhcCBpbnN0ZWFkJ1xyXG4gIH1dLFxyXG5cclxuICBbWyctaycsICctLWtlZXAtYXJ0aWZhY3RzJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBkZXN0OiAna2VlcEFydGlmYWN0cycsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIG5vIGVmZmVjdCwgdHJhY2UgaXMgbm93IGluIHRtcCBkaXIgYnkgZGVmYXVsdCBhbmQgaXMgJyArXHJcbiAgICAgICAgICAnY2xlYXJlZCBiZWZvcmUgZWFjaCBydW4uIFBsZWFzZSBhbHNvIHJlZmVyIHRvIHRoZSAtLXRyYWNlLWRpciBmbGFnLicsXHJcbiAgICBuYXJnczogMCxcclxuICB9XSxcclxuXHJcbiAgW1snLS1wbGF0Zm9ybS1uYW1lJ10sIHtcclxuICAgIGRlc3Q6ICdwbGF0Zm9ybU5hbWUnLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgZXhhbXBsZTogJ2lPUycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gTmFtZSBvZiB0aGUgbW9iaWxlIHBsYXRmb3JtOiBpT1MsIEFuZHJvaWQsIG9yIEZpcmVmb3hPUycsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tcGxhdGZvcm0tdmVyc2lvbiddLCB7XHJcbiAgICBkZXN0OiAncGxhdGZvcm1WZXJzaW9uJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGV4YW1wbGU6ICc3LjEnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIFZlcnNpb24gb2YgdGhlIG1vYmlsZSBwbGF0Zm9ybScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tYXV0b21hdGlvbi1uYW1lJ10sIHtcclxuICAgIGRlc3Q6ICdhdXRvbWF0aW9uTmFtZScsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBleGFtcGxlOiAnQXBwaXVtJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBOYW1lIG9mIHRoZSBhdXRvbWF0aW9uIHRvb2w6IEFwcGl1bSBvciBTZWxlbmRyb2lkJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1kZXZpY2UtbmFtZSddLCB7XHJcbiAgICBkZXN0OiAnZGV2aWNlTmFtZScsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBleGFtcGxlOiAnaVBob25lIFJldGluYSAoNC1pbmNoKSwgQW5kcm9pZCBFbXVsYXRvcicsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gTmFtZSBvZiB0aGUgbW9iaWxlIGRldmljZSB0byB1c2UnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWJyb3dzZXItbmFtZSddLCB7XHJcbiAgICBkZXN0OiAnYnJvd3Nlck5hbWUnLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgZXhhbXBsZTogJ1NhZmFyaScsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gTmFtZSBvZiB0aGUgbW9iaWxlIGJyb3dzZXI6IFNhZmFyaSBvciBDaHJvbWUnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWFwcCddLCB7XHJcbiAgICBkZXN0OiAnYXBwJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBJT1M6IGFicyBwYXRoIHRvIHNpbXVsYXRvci1jb21waWxlZCAuYXBwIGZpbGUgb3IgdGhlIGJ1bmRsZV9pZCBvZiB0aGUgZGVzaXJlZCB0YXJnZXQgb24gZGV2aWNlOyBBbmRyb2lkOiBhYnMgcGF0aCB0byAuYXBrIGZpbGUnLFxyXG4gICAgZXhhbXBsZTogJy9hYnMvcGF0aC90by9teS5hcHAnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctbHQnLCAnLS1sYXVuY2gtdGltZW91dCddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IDkwMDAwLFxyXG4gICAgZGVzdDogJ2xhdW5jaFRpbWVvdXQnLFxyXG4gICAgdHlwZTogJ2ludCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKGlPUy1vbmx5KSBob3cgbG9uZyBpbiBtcyB0byB3YWl0IGZvciBJbnN0cnVtZW50cyB0byBsYXVuY2gnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWxhbmd1YWdlJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlc3Q6ICdsYW5ndWFnZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnZW4nLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIExhbmd1YWdlIGZvciB0aGUgaU9TIHNpbXVsYXRvciAvIEFuZHJvaWQgRW11bGF0b3InLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWxvY2FsZSddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICBkZXN0OiAnbG9jYWxlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGV4YW1wbGU6ICdlbl9VUycsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gTG9jYWxlIGZvciB0aGUgaU9TIHNpbXVsYXRvciAvIEFuZHJvaWQgRW11bGF0b3InLFxyXG4gIH1dLFxyXG5cclxuICBbWyctVScsICctLXVkaWQnXSwge1xyXG4gICAgZGVzdDogJ3VkaWQnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgZXhhbXBsZTogJzFhZHNmLXNkZmFzLWFzZGYtMTIzc2RmJyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBVbmlxdWUgZGV2aWNlIGlkZW50aWZpZXIgb2YgdGhlIGNvbm5lY3RlZCBwaHlzaWNhbCBkZXZpY2UnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLW9yaWVudGF0aW9uJ10sIHtcclxuICAgIGRlc3Q6ICdvcmllbnRhdGlvbicsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnTEFORFNDQVBFJyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoSU9TLW9ubHkpIHVzZSBMQU5EU0NBUEUgb3IgUE9SVFJBSVQgdG8gaW5pdGlhbGl6ZSBhbGwgcmVxdWVzdHMgJyArXHJcbiAgICAgICAgICAndG8gdGhpcyBvcmllbnRhdGlvbicsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tbm8tcmVzZXQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdub1Jlc2V0JyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gRG8gbm90IHJlc2V0IGFwcCBzdGF0ZSBiZXR3ZWVuIHNlc3Npb25zIChJT1M6IGRvIG5vdCBkZWxldGUgYXBwICcgK1xyXG4gICAgICAgICAgJ3BsaXN0IGZpbGVzOyBBbmRyb2lkOiBkbyBub3QgdW5pbnN0YWxsIGFwcCBiZWZvcmUgbmV3IHNlc3Npb24pJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWZ1bGwtcmVzZXQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdmdWxsUmVzZXQnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoaU9TKSBEZWxldGUgdGhlIGVudGlyZSBzaW11bGF0b3IgZm9sZGVyLiAoQW5kcm9pZCkgUmVzZXQgYXBwICcgK1xyXG4gICAgICAgICAgJ3N0YXRlIGJ5IHVuaW5zdGFsbGluZyBhcHAgaW5zdGVhZCBvZiBjbGVhcmluZyBhcHAgZGF0YS4gT24gJyArXHJcbiAgICAgICAgICAnQW5kcm9pZCwgdGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBhcHAgYWZ0ZXIgdGhlIHNlc3Npb24gaXMgY29tcGxldGUuJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWFwcC1wa2cnXSwge1xyXG4gICAgZGVzdDogJ2FwcFBhY2thZ2UnLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgZXhhbXBsZTogJ2NvbS5leGFtcGxlLmFuZHJvaWQubXlBcHAnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEphdmEgcGFja2FnZSBvZiB0aGUgQW5kcm9pZCBhcHAgeW91IHdhbnQgdG8gcnVuICcgK1xyXG4gICAgICAgICAgJyhlLmcuLCBjb20uZXhhbXBsZS5hbmRyb2lkLm15QXBwKScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tYXBwLWFjdGl2aXR5J10sIHtcclxuICAgIGRlc3Q6ICdhcHBBY3Rpdml0eScsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnTWFpbkFjdGl2aXR5JyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBBY3Rpdml0eSBuYW1lIGZvciB0aGUgQW5kcm9pZCBhY3Rpdml0eSB5b3Ugd2FudCAnICtcclxuICAgICAgICAgICd0byBsYXVuY2ggZnJvbSB5b3VyIHBhY2thZ2UgKGUuZy4sIE1haW5BY3Rpdml0eSknLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWFwcC13YWl0LXBhY2thZ2UnXSwge1xyXG4gICAgZGVzdDogJ2FwcFdhaXRQYWNrYWdlJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnY29tLmV4YW1wbGUuYW5kcm9pZC5teUFwcCcsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgUGFja2FnZSBuYW1lIGZvciB0aGUgQW5kcm9pZCBhY3Rpdml0eSB5b3Ugd2FudCAnICtcclxuICAgICAgICAgICd0byB3YWl0IGZvciAoZS5nLiwgY29tLmV4YW1wbGUuYW5kcm9pZC5teUFwcCknLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWFwcC13YWl0LWFjdGl2aXR5J10sIHtcclxuICAgIGRlc3Q6ICdhcHBXYWl0QWN0aXZpdHknLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGV4YW1wbGU6ICdTcGxhc2hBY3Rpdml0eScsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgQWN0aXZpdHkgbmFtZSBmb3IgdGhlIEFuZHJvaWQgYWN0aXZpdHkgeW91IHdhbnQgJyArXHJcbiAgICAgICAgICAndG8gd2FpdCBmb3IgKGUuZy4sIFNwbGFzaEFjdGl2aXR5KScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZGV2aWNlLXJlYWR5LXRpbWVvdXQnXSwge1xyXG4gICAgZGVzdDogJ2RldmljZVJlYWR5VGltZW91dCcsXHJcbiAgICBkZWZhdWx0VmFsdWU6IDUsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICB0eXBlOiAnaW50JyxcclxuICAgIGV4YW1wbGU6ICc1JyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBUaW1lb3V0IGluIHNlY29uZHMgd2hpbGUgd2FpdGluZyBmb3IgZGV2aWNlIHRvIGJlY29tZSByZWFkeScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tYW5kcm9pZC1jb3ZlcmFnZSddLCB7XHJcbiAgICBkZXN0OiAnYW5kcm9pZENvdmVyYWdlJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnY29tLm15LlBrZy9jb20ubXkuUGtnLmluc3RydW1lbnRhdGlvbi5NeUluc3RydW1lbnRhdGlvbicsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgRnVsbHkgcXVhbGlmaWVkIGluc3RydW1lbnRhdGlvbiBjbGFzcy4gUGFzc2VkIHRvIC13IGluICcgK1xyXG4gICAgICAgICAgJ2FkYiBzaGVsbCBhbSBpbnN0cnVtZW50IC1lIGNvdmVyYWdlIHRydWUgLXcgJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1hdmQnXSwge1xyXG4gICAgZGVzdDogJ2F2ZCcsXHJcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnQGRlZmF1bHQnLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIE5hbWUgb2YgdGhlIGF2ZCB0byBsYXVuY2gnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWF2ZC1hcmdzJ10sIHtcclxuICAgIGRlc3Q6ICdhdmRBcmdzJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGV4YW1wbGU6ICctbm8tc25hcHNob3QtbG9hZCcsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgQWRkaXRpb25hbCBlbXVsYXRvciBhcmd1bWVudHMgdG8gbGF1bmNoIHRoZSBhdmQnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLXVzZS1rZXlzdG9yZSddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgZGVzdDogJ3VzZUtleXN0b3JlJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgV2hlbiBzZXQgdGhlIGtleXN0b3JlIHdpbGwgYmUgdXNlZCB0byBzaWduIGFwa3MuJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1rZXlzdG9yZS1wYXRoJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogcGF0aC5yZXNvbHZlKHByb2Nlc3MuZW52LkhPTUUgfHwgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEUgfHwgJycsICcuYW5kcm9pZCcsICdkZWJ1Zy5rZXlzdG9yZScpLFxyXG4gICAgZGVzdDogJ2tleXN0b3JlUGF0aCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgUGF0aCB0byBrZXlzdG9yZScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0ta2V5c3RvcmUtcGFzc3dvcmQnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiAnYW5kcm9pZCcsXHJcbiAgICBkZXN0OiAna2V5c3RvcmVQYXNzd29yZCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgUGFzc3dvcmQgdG8ga2V5c3RvcmUnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWtleS1hbGlhcyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6ICdhbmRyb2lkZGVidWdrZXknLFxyXG4gICAgZGVzdDogJ2tleUFsaWFzJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBLZXkgYWxpYXMnLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWtleS1wYXNzd29yZCddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6ICdhbmRyb2lkJyxcclxuICAgIGRlc3Q6ICdrZXlQYXNzd29yZCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgS2V5IHBhc3N3b3JkJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1pbnRlbnQtYWN0aW9uJ10sIHtcclxuICAgIGRlc3Q6ICdpbnRlbnRBY3Rpb24nLFxyXG4gICAgZGVmYXVsdFZhbHVlOiAnYW5kcm9pZC5pbnRlbnQuYWN0aW9uLk1BSU4nLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJ2FuZHJvaWQuaW50ZW50LmFjdGlvbi5NQUlOJyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBJbnRlbnQgYWN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBzdGFydCBhY3Rpdml0eScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0taW50ZW50LWNhdGVnb3J5J10sIHtcclxuICAgIGRlc3Q6ICdpbnRlbnRDYXRlZ29yeScsXHJcbiAgICBkZWZhdWx0VmFsdWU6ICdhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUicsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuQVBQX0NPTlRBQ1RTJyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBJbnRlbnQgY2F0ZWdvcnkgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5JyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1pbnRlbnQtZmxhZ3MnXSwge1xyXG4gICAgZGVzdDogJ2ludGVudEZsYWdzJyxcclxuICAgIGRlZmF1bHRWYWx1ZTogJzB4MTAyMDAwMDAnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJzB4MTAyMDAwMDAnLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEZsYWdzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5JyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1pbnRlbnQtYXJncyddLCB7XHJcbiAgICBkZXN0OiAnb3B0aW9uYWxJbnRlbnRBcmd1bWVudHMnLFxyXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZXhhbXBsZTogJzB4MTAyMDAwMDAnLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEFkZGl0aW9uYWwgaW50ZW50IGFyZ3VtZW50cyB0aGF0IHdpbGwgYmUgdXNlZCB0byAnICtcclxuICAgICAgICAgICdzdGFydCBhY3Rpdml0eScsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZG9udC1zdG9wLWFwcC1vbi1yZXNldCddLCB7XHJcbiAgICBkZXN0OiAnZG9udFN0b3BBcHBPblJlc2V0JyxcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIFdoZW4gaW5jbHVkZWQsIHJlZnJhaW5zIGZyb20gc3RvcHBpbmcgdGhlIGFwcCBiZWZvcmUgcmVzdGFydCcsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tY2FsZW5kYXItZm9ybWF0J10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcclxuICAgIGRlc3Q6ICdjYWxlbmRhckZvcm1hdCcsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBleGFtcGxlOiAnZ3JlZ29yaWFuJyxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoSU9TLW9ubHkpIGNhbGVuZGFyIGZvcm1hdCBmb3IgdGhlIGlPUyBzaW11bGF0b3InLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLW5hdGl2ZS1pbnN0cnVtZW50cy1saWInXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICduYXRpdmVJbnN0cnVtZW50c0xpYicsXHJcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxyXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChJT1Mtb25seSkgSU9TIGhhcyBhIHdlaXJkIGJ1aWx0LWluIHVuYXZvaWRhYmxlICcgK1xyXG4gICAgICAgICAgJ2RlbGF5LiBXZSBwYXRjaCB0aGlzIGluIGFwcGl1bS4gSWYgeW91IGRvIG5vdCB3YW50IGl0IHBhdGNoZWQsICcgK1xyXG4gICAgICAgICAgJ3Bhc3MgaW4gdGhpcyBmbGFnLicsXHJcbiAgICBuYXJnczogMCxcclxuICB9XSxcclxuXHJcbiAgW1snLS1rZWVwLWtleWNoYWlucyddLCB7XHJcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgZGVzdDogJ2tlZXBLZXlDaGFpbnMnLFxyXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoaU9TLW9ubHkpIFdoZXRoZXIgdG8ga2VlcCBrZXljaGFpbnMgKExpYnJhcnkvS2V5Y2hhaW5zKSB3aGVuIHJlc2V0IGFwcCBiZXR3ZWVuIHNlc3Npb25zJyxcclxuICAgIG5hcmdzOiAwLFxyXG4gIH1dLFxyXG5cclxuICBbWyctLWxvY2FsaXphYmxlLXN0cmluZ3MtZGlyJ10sIHtcclxuICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdsb2NhbGl6YWJsZVN0cmluZ3NEaXInLFxyXG4gICAgZGVmYXVsdFZhbHVlOiAnZW4ubHByb2onLFxyXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxyXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChJT1Mtb25seSkgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIGRpciB3aGVyZSBMb2NhbGl6YWJsZS5zdHJpbmdzIGZpbGUgcmVzaWRlcyAnLFxyXG4gICAgZXhhbXBsZTogJ2VuLmxwcm9qJyxcclxuICB9XSxcclxuXHJcbiAgW1snLS1zaG93LWlvcy1sb2cnXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdzaG93SU9TTG9nJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKElPUy1vbmx5KSBpZiBzZXQsIHRoZSBpT1Mgc3lzdGVtIGxvZyB3aWxsIGJlIHdyaXR0ZW4gdG8gdGhlIGNvbnNvbGUnLFxyXG4gICAgbmFyZ3M6IDAsXHJcbiAgfV0sXHJcblxyXG4gIFtbJy0tZW5hYmxlLWhlYXBkdW1wJ10sIHtcclxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICBkZXN0OiAnaGVhcGR1bXBFbmFibGVkJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnRW5hYmxlIGNvbGxlY3Rpb24gb2YgTm9kZUpTIG1lbW9yeSBoZWFwIGR1bXBzLiBUaGlzIGlzIHVzZWZ1bCBmb3IgbWVtb3J5IGxlYWtzIGxvb2t1cCcsXHJcbiAgICBuYXJnczogMFxyXG4gIH1dLFxyXG5cclxuICBbWyctLXJlbGF4ZWQtc2VjdXJpdHknXSwge1xyXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgIGRlc3Q6ICdyZWxheGVkU2VjdXJpdHlFbmFibGVkJyxcclxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXHJcbiAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICBoZWxwOiAnRGlzYWJsZSBhZGRpdGlvbmFsIHNlY3VyaXR5IGNoZWNrcywgc28gaXQgaXMgcG9zc2libGUgdG8gdXNlIHNvbWUgYWR2YW5jZWQgZmVhdHVyZXMsIHByb3ZpZGVkICcgK1xyXG4gICAgICAgICAgJ2J5IGRyaXZlcnMgc3VwcG9ydGluZyB0aGlzIG9wdGlvbi4gT25seSBlbmFibGUgaXQgaWYgYWxsIHRoZSAnICtcclxuICAgICAgICAgICdjbGllbnRzIGFyZSBpbiB0aGUgdHJ1c3RlZCBuZXR3b3JrIGFuZCBpdFxcJ3Mgbm90IHRoZSBjYXNlIGlmIGEgY2xpZW50IGNvdWxkIHBvdGVudGlhbGx5ICcgK1xyXG4gICAgICAgICAgJ2JyZWFrIG91dCBvZiB0aGUgc2Vzc2lvbiBzYW5kYm94LicsXHJcbiAgICBuYXJnczogMFxyXG4gIH1dXHJcbl07XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQYXJzZUFyZ3NGb3JEZWZhdWx0Q2FwYWJpbGl0aWVzIChwYXJzZXIpIHtcclxuICAvLyBoZXJlIHdlIHdhbnQgdG8gdXBkYXRlIHRoZSBwYXJzZXIucGFyc2VBcmdzKCkgZnVuY3Rpb25cclxuICAvLyBpbiBvcmRlciB0byBicmluZyB0b2dldGhlciBhbGwgdGhlIGFyZ3MgdGhhdCBhcmUgYWN0dWFsbHlcclxuICAvLyBkZWZhdWx0IGNhcHMuXHJcbiAgLy8gb25jZSB0aG9zZSBkZXByZWNhdGVkIGFyZ3MgYXJlIGFjdHVhbGx5IHJlbW92ZWQsIHRoaXNcclxuICAvLyBjYW4gYWxzbyBiZSByZW1vdmVkXHJcbiAgcGFyc2VyLl9wYXJzZUFyZ3MgPSBwYXJzZXIucGFyc2VBcmdzO1xyXG4gIHBhcnNlci5wYXJzZUFyZ3MgPSBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgbGV0IHBhcnNlZEFyZ3MgPSBwYXJzZXIuX3BhcnNlQXJncyhhcmdzKTtcclxuICAgIHBhcnNlZEFyZ3MuZGVmYXVsdENhcGFiaWxpdGllcyA9IHBhcnNlZEFyZ3MuZGVmYXVsdENhcGFiaWxpdGllcyB8fCB7fTtcclxuICAgIGZvciAobGV0IGFyZ0VudHJ5IG9mIGRlcHJlY2F0ZWRBcmdzKSB7XHJcbiAgICAgIGxldCBhcmcgPSBhcmdFbnRyeVsxXS5kZXN0O1xyXG4gICAgICBpZiAoYXJnRW50cnlbMV0uZGVwcmVjYXRlZEZvciA9PT0gJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnKSB7XHJcbiAgICAgICAgaWYgKGFyZyBpbiBwYXJzZWRBcmdzICYmIHBhcnNlZEFyZ3NbYXJnXSAhPT0gYXJnRW50cnlbMV0uZGVmYXVsdFZhbHVlKSB7XHJcbiAgICAgICAgICBwYXJzZWRBcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXNbYXJnXSA9IHBhcnNlZEFyZ3NbYXJnXTtcclxuICAgICAgICAgIC8vIGogcyBoIGkgbiB0IGNhbid0IGhhbmRsZSBjb21wbGV4IGludGVycG9sYXRlZCBzdHJpbmdzXHJcbiAgICAgICAgICBsZXQgY2FwRGljdCA9IHtbYXJnXTogcGFyc2VkQXJnc1thcmddfTtcclxuICAgICAgICAgIGFyZ0VudHJ5WzFdLmRlcHJlY2F0ZWRGb3IgPSBgLS1kZWZhdWx0LWNhcGFiaWxpdGllcyBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJyR7SlNPTi5zdHJpbmdpZnkoY2FwRGljdCl9J2A7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VkQXJncztcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURlZmF1bHRDYXBzIChjYXBzKSB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIHVzZSBzeW5jaHJvbm91cyBmaWxlIGFjY2VzcywgYXMgYGFyZ3BhcnNlYCBwcm92aWRlcyBubyB3YXkgb2YgZWl0aGVyXHJcbiAgICAvLyBhd2FpdGluZyBvciB1c2luZyBjYWxsYmFja3MuIFRoaXMgc3RlcCBoYXBwZW5zIGluIHN0YXJ0dXAsIGluIHdoYXQgaXNcclxuICAgIC8vIGVmZmVjdGl2ZWx5IGNvbW1hbmQtbGluZSBjb2RlLCBzbyBub3RoaW5nIGlzIGJsb2NrZWQgaW4gdGVybXMgb2ZcclxuICAgIC8vIHNlc3Npb25zLCBzbyBob2xkaW5nIHVwIHRoZSBldmVudCBsb29wIGRvZXMgbm90IGluY3VyIHRoZSB1c3VhbFxyXG4gICAgLy8gZHJhd2JhY2tzLlxyXG4gICAgaWYgKGZzLnN0YXRTeW5jKGNhcHMpLmlzRmlsZSgpKSB7XHJcbiAgICAgIGNhcHMgPSBmcy5yZWFkRmlsZVN5bmMoY2FwcywgJ3V0ZjgnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIC8vIG5vdCBhIGZpbGUsIG9yIG5vdCByZWFkYWJsZVxyXG4gIH1cclxuICBjYXBzID0gSlNPTi5wYXJzZShjYXBzKTtcclxuICBpZiAoIV8uaXNQbGFpbk9iamVjdChjYXBzKSkge1xyXG4gICAgdGhyb3cgJ0ludmFsaWQgZm9ybWF0IGZvciBkZWZhdWx0IGNhcGFiaWxpdGllcyc7XHJcbiAgfVxyXG4gIHJldHVybiBjYXBzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXJzZXIgKCkge1xyXG4gIGxldCBwYXJzZXIgPSBuZXcgQXJndW1lbnRQYXJzZXIoe1xyXG4gICAgdmVyc2lvbjogcGtnT2JqLnZlcnNpb24sXHJcbiAgICBhZGRIZWxwOiB0cnVlLFxyXG4gICAgZGVzY3JpcHRpb246ICdBIHdlYmRyaXZlci1jb21wYXRpYmxlIHNlcnZlciBmb3IgdXNlIHdpdGggbmF0aXZlIGFuZCBoeWJyaWQgaU9TIGFuZCBBbmRyb2lkIGFwcGxpY2F0aW9ucy4nLFxyXG4gICAgcHJvZzogcHJvY2Vzcy5hcmd2WzFdIHx8ICdBcHBpdW0nXHJcbiAgfSk7XHJcbiAgbGV0IGFsbEFyZ3MgPSBfLnVuaW9uKGFyZ3MsIGRlcHJlY2F0ZWRBcmdzKTtcclxuICBwYXJzZXIucmF3QXJncyA9IGFsbEFyZ3M7XHJcbiAgZm9yIChsZXQgYXJnIG9mIGFsbEFyZ3MpIHtcclxuICAgIHBhcnNlci5hZGRBcmd1bWVudChhcmdbMF0sIGFyZ1sxXSk7XHJcbiAgfVxyXG4gIHVwZGF0ZVBhcnNlQXJnc0ZvckRlZmF1bHRDYXBhYmlsaXRpZXMocGFyc2VyKTtcclxuXHJcbiAgcmV0dXJuIHBhcnNlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFyZ3MgKCkge1xyXG4gIGxldCBkZWZhdWx0cyA9IHt9O1xyXG4gIGZvciAobGV0IFssIGFyZ10gb2YgYXJncykge1xyXG4gICAgZGVmYXVsdHNbYXJnLmRlc3RdID0gYXJnLmRlZmF1bHRWYWx1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGRlZmF1bHRzO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRQYXJzZXI7XHJcbmV4cG9ydCB7IGdldERlZmF1bHRBcmdzLCBnZXRQYXJzZXIgfTtcclxuIl0sInNvdXJjZVJvb3QiOiIuLlxcLi4ifQ==
