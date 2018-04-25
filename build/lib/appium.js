'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('./config');

var _appiumBaseDriver = require('appium-base-driver');

var _appiumFakeDriver = require('appium-fake-driver');

var _appiumAndroidDriver = require('appium-android-driver');

var _appiumIosDriver = require('appium-ios-driver');

var _appiumUiautomator2Driver = require('appium-uiautomator2-driver');

var _appiumSelendroidDriver = require('appium-selendroid-driver');

var _appiumXcuitestDriver = require('appium-xcuitest-driver');

var _appiumYouiengineDriver = require('appium-youiengine-driver');

var _appiumWindowsDriver = require('appium-windows-driver');

var _appiumMacDriver = require('appium-mac-driver');

var _appiumEspressoDriver = require('appium-espresso-driver');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _asyncLock = require('async-lock');

var _asyncLock2 = _interopRequireDefault(_asyncLock);

var _utils = require('./utils');

// Force protocol to be MJSONWP until we start accepting W3C capabilities
_appiumBaseDriver.BaseDriver.determineProtocol = function () {
  return 'MJSONWP';
};

var sessionsListGuard = new _asyncLock2['default']();
var pendingDriversGuard = new _asyncLock2['default']();

var AppiumDriver = (function (_BaseDriver) {
  _inherits(AppiumDriver, _BaseDriver);

  function AppiumDriver(args) {
    _classCallCheck(this, AppiumDriver);

    _get(Object.getPrototypeOf(AppiumDriver.prototype), 'constructor', this).call(this);

    // the main Appium Driver has no new command timeout
    this.newCommandTimeoutMs = 0;

    this.args = _Object$assign({}, args);

    // Access to sessions list must be guarded with a Semaphore, because
    // it might be changed by other async calls at any time
    // It is not recommended to access this property directly from the outside
    this.sessions = {};

    // Access to pending drivers list must be guarded with a Semaphore, because
    // it might be changed by other async calls at any time
    // It is not recommended to access this property directly from the outside
    this.pendingDrivers = {};
  }

  // help decide which commands should be proxied to sub-drivers and which
  // should be handled by this, our umbrella driver

  /**
   * Cancel commands queueing for the umbrella Appium driver
   */

  _createClass(AppiumDriver, [{
    key: 'sessionExists',
    value: function sessionExists(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && dstSession.sessionId !== null;
    }
  }, {
    key: 'driverForSession',
    value: function driverForSession(sessionId) {
      return this.sessions[sessionId];
    }
  }, {
    key: 'getDriverForCaps',
    value: function getDriverForCaps(caps) {
      // TODO if this logic ever becomes complex, should probably factor out
      // into its own file
      if (!caps.platformName || !_lodash2['default'].isString(caps.platformName)) {
        throw new Error("You must include a platformName capability");
      }

      // we don't necessarily have an `automationName` capability,
      if (caps.automationName) {
        if (caps.automationName.toLowerCase() === 'selendroid') {
          // but if we do and it is 'Selendroid', act on it
          return _appiumSelendroidDriver.SelendroidDriver;
        } else if (caps.automationName.toLowerCase() === 'uiautomator2') {
          // but if we do and it is 'Uiautomator2', act on it
          return _appiumUiautomator2Driver.AndroidUiautomator2Driver;
        } else if (caps.automationName.toLowerCase() === 'xcuitest') {
          // but if we do and it is 'XCUITest', act on it
          return _appiumXcuitestDriver.XCUITestDriver;
        } else if (caps.automationName.toLowerCase() === 'youiengine') {
          // but if we do and it is 'YouiEngine', act on it
          return _appiumYouiengineDriver.YouiEngineDriver;
        } else if (caps.automationName.toLowerCase() === 'espresso') {
          _logger2['default'].warn('The Appium Espresso driver is currently in early beta and meant only for experimental usage. Its API is not yet complete or guaranteed to work. Please report bugs to the Appium team on GitHub.');
          return _appiumEspressoDriver.EspressoDriver;
        }
      }

      if (caps.platformName.toLowerCase() === "fake") {
        return _appiumFakeDriver.FakeDriver;
      }

      if (caps.platformName.toLowerCase() === 'android') {
        return _appiumAndroidDriver.AndroidDriver;
      }

      if (caps.platformName.toLowerCase() === 'ios') {
        if (caps.platformVersion) {
          var majorVer = caps.platformVersion.toString().split(".")[0];
          if (parseInt(majorVer, 10) >= 10) {
            _logger2['default'].info("Requested iOS support with version >= 10, using XCUITest " + "driver instead of UIAutomation-based driver, since the " + "latter is unsupported on iOS 10 and up.");
            return _appiumXcuitestDriver.XCUITestDriver;
          }
        }

        return _appiumIosDriver.IosDriver;
      }

      if (caps.platformName.toLowerCase() === 'windows') {
        return _appiumWindowsDriver.WindowsDriver;
      }

      if (caps.platformName.toLowerCase() === 'mac') {
        return _appiumMacDriver.MacDriver;
      }

      var msg = undefined;
      if (caps.automationName) {
        msg = 'Could not find a driver for automationName \'' + caps.automationName + '\' and platformName ' + ('\'' + caps.platformName + '\'.');
      } else {
        msg = 'Could not find a driver for platformName \'' + caps.platformName + '\'.';
      }
      throw new Error(msg + ' Please check your desired capabilities.');
    }
  }, {
    key: 'getDriverVersion',
    value: function getDriverVersion(driver) {
      var NAME_DRIVER_MAP = {
        SelendroidDriver: 'appium-selendroid-driver',
        AndroidUiautomator2Driver: 'appium-uiautomator2-driver',
        XCUITestDriver: 'appium-xcuitest-driver',
        YouiEngineDriver: 'appium-youiengine-driver',
        FakeDriver: 'appium-fake-driver',
        AndroidDriver: 'appium-android-driver',
        IosDriver: 'appium-ios-driver',
        WindowsDriver: 'appium-windows-driver',
        MacDriver: 'appium-mac-driver'
      };
      if (!NAME_DRIVER_MAP[driver.name]) {
        _logger2['default'].warn('Unable to get version of driver \'' + driver.name + '\'');
        return;
      }

      var _require = require(NAME_DRIVER_MAP[driver.name] + '/package.json');

      var version = _require.version;

      return version;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      var config, gitSha, status;
      return _regeneratorRuntime.async(function getStatus$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap((0, _config.getAppiumConfig)());

          case 2:
            config = context$2$0.sent;
            gitSha = config['git-sha'];
            status = { build: { version: config.version } };

            if (typeof gitSha !== "undefined") {
              status.build.revision = gitSha;
            }
            return context$2$0.abrupt('return', status);

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getSessions',
    value: function getSessions() {
      var sessions;
      return _regeneratorRuntime.async(function getSessions$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this.sessions;
            }));

          case 2:
            sessions = context$2$0.sent;
            return context$2$0.abrupt('return', _lodash2['default'].toPairs(sessions).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2);

              var id = _ref2[0];
              var driver = _ref2[1];

              return { id: id, capabilities: driver.caps };
            }));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'printNewSessionAnnouncement',
    value: function printNewSessionAnnouncement(driver, caps) {
      var driverVersion = this.getDriverVersion(driver);
      var introString = driverVersion ? 'Creating new ' + driver.name + ' (v' + driverVersion + ') session' : 'Creating new ' + driver.name + ' session';
      _logger2['default'].info(introString);
      _logger2['default'].info('Capabilities:');
      (0, _utils.inspectObject)(caps);
    }

    /**
     * Create a new session
     * @param {Object} desiredCaps JSONWP formatted desired capabilities
     * @param {Object} reqCaps Required capabilities
     * @param {Object} capabilities W3C capabilities
     * @return {Array} Unique session ID and capabilities
     */
  }, {
    key: 'createSession',
    value: function createSession(desiredCaps, reqCaps, capabilities) {
      if (desiredCaps === undefined) desiredCaps = {};

      var w3cCaps, InnerDriver, sessionIdsToDelete, runningDriversData, otherPendingDriversData, d, innerSessionId, dCaps, _ref3, _ref32;

      return _regeneratorRuntime.async(function createSession$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (capabilities) {
              // Merging W3C caps into desiredCaps is a stop-gap until all the clients and drivers become fully W3C compliant
              _logger2['default'].info('Merged W3C capabilities ' + _lodash2['default'].truncate(JSON.stringify(capabilities), { length: 50 }) + ' into desiredCapabilities object ' + _lodash2['default'].truncate(JSON.stringify(desiredCaps), { length: 50 }));
              w3cCaps = (0, _appiumBaseDriver.processCapabilities)(capabilities, null, false);

              desiredCaps = _lodash2['default'].merge(desiredCaps, w3cCaps);
            }
            desiredCaps = _lodash2['default'].defaults(_lodash2['default'].clone(desiredCaps), this.args.defaultCapabilities);
            InnerDriver = this.getDriverForCaps(desiredCaps);

            this.printNewSessionAnnouncement(InnerDriver, desiredCaps);

            if (!this.args.sessionOverride) {
              context$2$0.next = 17;
              break;
            }

            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _lodash2['default'].keys(_this2.sessions);
            }));

          case 7:
            sessionIdsToDelete = context$2$0.sent;

            if (!sessionIdsToDelete.length) {
              context$2$0.next = 17;
              break;
            }

            _logger2['default'].info('Session override is on. Deleting other ' + sessionIdsToDelete.length + ' active session' + (sessionIdsToDelete.length ? '' : 's') + '.');
            context$2$0.prev = 10;
            context$2$0.next = 13;
            return _regeneratorRuntime.awrap(_bluebird2['default'].map(sessionIdsToDelete, function (id) {
              return _this2.deleteSession(id);
            }));

          case 13:
            context$2$0.next = 17;
            break;

          case 15:
            context$2$0.prev = 15;
            context$2$0.t0 = context$2$0['catch'](10);

          case 17:
            runningDriversData = undefined, otherPendingDriversData = undefined;
            d = new InnerDriver(this.args);

            if (this.args.relaxedSecurityEnabled) {
              _logger2['default'].info('Applying relaxed security to ' + InnerDriver.name + ' as per server command line argument');
              d.relaxedSecurityEnabled = true;
            }
            context$2$0.prev = 20;
            context$2$0.next = 23;
            return _regeneratorRuntime.awrap(this.curSessionDataForDriver(InnerDriver));

          case 23:
            runningDriversData = context$2$0.sent;
            context$2$0.next = 29;
            break;

          case 26:
            context$2$0.prev = 26;
            context$2$0.t1 = context$2$0['catch'](20);
            throw new _appiumBaseDriver.errors.SessionNotCreatedError(context$2$0.t1.message);

          case 29:
            context$2$0.next = 31;
            return _regeneratorRuntime.awrap(pendingDriversGuard.acquire(AppiumDriver.name, function () {
              _this2.pendingDrivers[InnerDriver.name] = _this2.pendingDrivers[InnerDriver.name] || [];
              otherPendingDriversData = _this2.pendingDrivers[InnerDriver.name].map(function (drv) {
                return drv.driverData;
              });
              _this2.pendingDrivers[InnerDriver.name].push(d);
            }));

          case 31:
            innerSessionId = undefined, dCaps = undefined;
            context$2$0.prev = 32;
            context$2$0.next = 35;
            return _regeneratorRuntime.awrap(d.createSession(desiredCaps, reqCaps, [].concat(_toConsumableArray(runningDriversData), _toConsumableArray(otherPendingDriversData))));

          case 35:
            _ref3 = context$2$0.sent;
            _ref32 = _slicedToArray(_ref3, 2);
            innerSessionId = _ref32[0];
            dCaps = _ref32[1];
            context$2$0.next = 41;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              _this2.sessions[innerSessionId] = d;
            }));

          case 41:
            context$2$0.prev = 41;
            context$2$0.next = 44;
            return _regeneratorRuntime.awrap(pendingDriversGuard.acquire(AppiumDriver.name, function () {
              _lodash2['default'].pull(_this2.pendingDrivers[InnerDriver.name], d);
            }));

          case 44:
            return context$2$0.finish(41);

          case 45:

            // this is an async function but we don't await it because it handles
            // an out-of-band promise which is fulfilled if the inner driver
            // unexpectedly shuts down
            this.attachUnexpectedShutdownHandler(d, innerSessionId);

            _logger2['default'].info('New ' + InnerDriver.name + ' session created successfully, session ' + (innerSessionId + ' added to master session list'));

            // set the New Command Timeout for the inner driver
            d.startNewCommandTimeout();

            return context$2$0.abrupt('return', [innerSessionId, dCaps]);

          case 49:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[10, 15], [20, 26], [32,, 41, 45]]);
    }
  }, {
    key: 'attachUnexpectedShutdownHandler',
    value: function attachUnexpectedShutdownHandler(driver, innerSessionId) {
      return _regeneratorRuntime.async(function attachUnexpectedShutdownHandler$(context$2$0) {
        var _this3 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(driver.onUnexpectedShutdown);

          case 3:
            throw new Error('Unexpected shutdown');

          case 6:
            context$2$0.prev = 6;
            context$2$0.t0 = context$2$0['catch'](0);

            if (!(context$2$0.t0 instanceof _bluebird2['default'].CancellationError)) {
              context$2$0.next = 10;
              break;
            }

            return context$2$0.abrupt('return');

          case 10:
            _logger2['default'].warn('Closing session, cause was \'' + context$2$0.t0.message + '\'');
            _logger2['default'].info('Removing session ' + innerSessionId + ' from our master session list');
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              delete _this3.sessions[innerSessionId];
            }));

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 6]]);
    }
  }, {
    key: 'curSessionDataForDriver',
    value: function curSessionDataForDriver(InnerDriver) {
      var sessions, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, datum;

      return _regeneratorRuntime.async(function curSessionDataForDriver$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this4.sessions;
            }));

          case 2:
            sessions = context$2$0.sent;
            data = _lodash2['default'].values(sessions).filter(function (s) {
              return s.constructor.name === InnerDriver.name;
            }).map(function (s) {
              return s.driverData;
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$2$0.prev = 7;
            _iterator = _getIterator(data);

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              context$2$0.next = 16;
              break;
            }

            datum = _step.value;

            if (datum) {
              context$2$0.next = 13;
              break;
            }

            throw new Error('Problem getting session data for driver type ' + (InnerDriver.name + '; does it implement \'get ') + 'driverData\'?');

          case 13:
            _iteratorNormalCompletion = true;
            context$2$0.next = 9;
            break;

          case 16:
            context$2$0.next = 22;
            break;

          case 18:
            context$2$0.prev = 18;
            context$2$0.t0 = context$2$0['catch'](7);
            _didIteratorError = true;
            _iteratorError = context$2$0.t0;

          case 22:
            context$2$0.prev = 22;
            context$2$0.prev = 23;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 25:
            context$2$0.prev = 25;

            if (!_didIteratorError) {
              context$2$0.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return context$2$0.finish(25);

          case 29:
            return context$2$0.finish(22);

          case 30:
            return context$2$0.abrupt('return', data);

          case 31:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[7, 18, 22, 30], [23,, 25, 29]]);
    }
  }, {
    key: 'deleteSession',
    value: function deleteSession(sessionId) {
      var otherSessionsData, dstSession;
      return _regeneratorRuntime.async(function deleteSession$(context$2$0) {
        var _this5 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            otherSessionsData = null;
            dstSession = null;
            context$2$0.next = 5;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              if (!_this5.sessions[sessionId]) {
                return;
              }
              var curConstructorName = _this5.sessions[sessionId].constructor.name;
              otherSessionsData = _lodash2['default'].toPairs(_this5.sessions).filter(function (_ref4) {
                var _ref42 = _slicedToArray(_ref4, 2);

                var key = _ref42[0];
                var value = _ref42[1];
                return value.constructor.name === curConstructorName && key !== sessionId;
              }).map(function (_ref5) {
                var _ref52 = _slicedToArray(_ref5, 2);

                var value = _ref52[1];
                return value.driverData;
              });
              dstSession = _this5.sessions[sessionId];
              _logger2['default'].info('Removing session ' + sessionId + ' from our master session list');
              // regardless of whether the deleteSession completes successfully or not
              // make the session unavailable, because who knows what state it might
              // be in otherwise
              delete _this5.sessions[sessionId];
            }));

          case 5:
            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(dstSession.deleteSession(sessionId, otherSessionsData));

          case 7:
            context$2$0.next = 13;
            break;

          case 9:
            context$2$0.prev = 9;
            context$2$0.t0 = context$2$0['catch'](0);

            _logger2['default'].error('Had trouble ending session ' + sessionId + ': ' + context$2$0.t0.message);
            throw context$2$0.t0;

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 9]]);
    }
  }, {
    key: 'executeCommand',
    value: function executeCommand(cmd) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _get2, sessionId, dstSession;

      return _regeneratorRuntime.async(function executeCommand$(context$2$0) {
        var _this6 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(cmd === 'getStatus')) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.getStatus());

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
            if (!isAppiumDriverCommand(cmd)) {
              context$2$0.next = 8;
              break;
            }

            context$2$0.next = 7;
            return _regeneratorRuntime.awrap((_get2 = _get(Object.getPrototypeOf(AppiumDriver.prototype), 'executeCommand', this)).call.apply(_get2, [this, cmd].concat(args)));

          case 7:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 8:
            sessionId = _lodash2['default'].last(args);
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this6.sessions[sessionId];
            }));

          case 11:
            dstSession = context$2$0.sent;

            if (dstSession) {
              context$2$0.next = 14;
              break;
            }

            throw new Error('The session with id \'' + sessionId + '\' does not exist');

          case 14:
            context$2$0.next = 16;
            return _regeneratorRuntime.awrap(dstSession.executeCommand.apply(dstSession, [cmd].concat(args)));

          case 16:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 17:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'proxyActive',
    value: function proxyActive(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && _lodash2['default'].isFunction(dstSession.proxyActive) && dstSession.proxyActive(sessionId);
    }
  }, {
    key: 'getProxyAvoidList',
    value: function getProxyAvoidList(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession ? dstSession.getProxyAvoidList() : [];
    }
  }, {
    key: 'canProxy',
    value: function canProxy(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && dstSession.canProxy(sessionId);
    }
  }, {
    key: 'isCommandsQueueEnabled',
    get: function get() {
      return false;
    }
  }]);

  return AppiumDriver;
})(_appiumBaseDriver.BaseDriver);

function isAppiumDriverCommand(cmd) {
  return !(0, _appiumBaseDriver.isSessionCommand)(cmd) || cmd === "deleteSession";
}

function getAppiumRouter(args) {
  var appium = new AppiumDriver(args);
  return (0, _appiumBaseDriver.routeConfiguringFunction)(appium);
}

exports.AppiumDriver = AppiumDriver;
exports.getAppiumRouter = getAppiumRouter;
exports['default'] = getAppiumRouter;

// TODO: When we support W3C pass in capabilities object

// Remove the session on unexpected shutdown, so that we are in a position
// to open another session later on.
// TODO: this should be removed and replaced by a onShutdown callback.
// this is a cancellable promise
// if we get here, we've had an unexpected shutdown, so error

// if we cancelled the unexpected shutdown promise, that means we
// no longer care about it, and can safely ignore it

// getStatus command should not be put into queue. If we do it as part of super.executeCommand, it will be added to queue.
// There will be lot of status commands in queue during createSession command, as createSession can take up to or more than a minute.
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxTQUFPLGdEQUF5QixNQUFNLENBQUMsQ0FBQztDQUN6Qzs7UUFFUSxZQUFZLEdBQVosWUFBWTtRQUFFLGVBQWUsR0FBZixlQUFlO3FCQUN2QixlQUFlIiwiZmlsZSI6ImxpYi9hcHBpdW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgbG9nIGZyb20gJy4vbG9nZ2VyJztcclxuaW1wb3J0IHsgZ2V0QXBwaXVtQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xyXG5pbXBvcnQgeyBCYXNlRHJpdmVyLCByb3V0ZUNvbmZpZ3VyaW5nRnVuY3Rpb24sIGVycm9ycyxcclxuICAgICAgICAgaXNTZXNzaW9uQ29tbWFuZCwgcHJvY2Vzc0NhcGFiaWxpdGllcyB9IGZyb20gJ2FwcGl1bS1iYXNlLWRyaXZlcic7XHJcbmltcG9ydCB7IEZha2VEcml2ZXIgfSBmcm9tICdhcHBpdW0tZmFrZS1kcml2ZXInO1xyXG5pbXBvcnQgeyBBbmRyb2lkRHJpdmVyIH0gZnJvbSAnYXBwaXVtLWFuZHJvaWQtZHJpdmVyJztcclxuaW1wb3J0IHsgSW9zRHJpdmVyIH0gZnJvbSAnYXBwaXVtLWlvcy1kcml2ZXInO1xyXG5pbXBvcnQgeyBBbmRyb2lkVWlhdXRvbWF0b3IyRHJpdmVyIH0gZnJvbSAnYXBwaXVtLXVpYXV0b21hdG9yMi1kcml2ZXInO1xyXG5pbXBvcnQgeyBTZWxlbmRyb2lkRHJpdmVyIH0gZnJvbSAnYXBwaXVtLXNlbGVuZHJvaWQtZHJpdmVyJztcclxuaW1wb3J0IHsgWENVSVRlc3REcml2ZXIgfSBmcm9tICdhcHBpdW0teGN1aXRlc3QtZHJpdmVyJztcclxuaW1wb3J0IHsgWW91aUVuZ2luZURyaXZlciB9IGZyb20gJ2FwcGl1bS15b3VpZW5naW5lLWRyaXZlcic7XHJcbmltcG9ydCB7IFdpbmRvd3NEcml2ZXIgfSBmcm9tICdhcHBpdW0td2luZG93cy1kcml2ZXInO1xyXG5pbXBvcnQgeyBNYWNEcml2ZXIgfSBmcm9tICdhcHBpdW0tbWFjLWRyaXZlcic7XHJcbmltcG9ydCB7IEVzcHJlc3NvRHJpdmVyIH0gZnJvbSAnYXBwaXVtLWVzcHJlc3NvLWRyaXZlcic7XHJcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IEFzeW5jTG9jayBmcm9tICdhc3luYy1sb2NrJztcclxuaW1wb3J0IHsgaW5zcGVjdE9iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuLy8gRm9yY2UgcHJvdG9jb2wgdG8gYmUgTUpTT05XUCB1bnRpbCB3ZSBzdGFydCBhY2NlcHRpbmcgVzNDIGNhcGFiaWxpdGllc1xyXG5CYXNlRHJpdmVyLmRldGVybWluZVByb3RvY29sID0gKCkgPT4gJ01KU09OV1AnO1xyXG5cclxuY29uc3Qgc2Vzc2lvbnNMaXN0R3VhcmQgPSBuZXcgQXN5bmNMb2NrKCk7XHJcbmNvbnN0IHBlbmRpbmdEcml2ZXJzR3VhcmQgPSBuZXcgQXN5bmNMb2NrKCk7XHJcblxyXG5jbGFzcyBBcHBpdW1Ecml2ZXIgZXh0ZW5kcyBCYXNlRHJpdmVyIHtcclxuICBjb25zdHJ1Y3RvciAoYXJncykge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICAvLyB0aGUgbWFpbiBBcHBpdW0gRHJpdmVyIGhhcyBubyBuZXcgY29tbWFuZCB0aW1lb3V0XHJcbiAgICB0aGlzLm5ld0NvbW1hbmRUaW1lb3V0TXMgPSAwO1xyXG5cclxuICAgIHRoaXMuYXJncyA9IE9iamVjdC5hc3NpZ24oe30sIGFyZ3MpO1xyXG5cclxuICAgIC8vIEFjY2VzcyB0byBzZXNzaW9ucyBsaXN0IG11c3QgYmUgZ3VhcmRlZCB3aXRoIGEgU2VtYXBob3JlLCBiZWNhdXNlXHJcbiAgICAvLyBpdCBtaWdodCBiZSBjaGFuZ2VkIGJ5IG90aGVyIGFzeW5jIGNhbGxzIGF0IGFueSB0aW1lXHJcbiAgICAvLyBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gYWNjZXNzIHRoaXMgcHJvcGVydHkgZGlyZWN0bHkgZnJvbSB0aGUgb3V0c2lkZVxyXG4gICAgdGhpcy5zZXNzaW9ucyA9IHt9O1xyXG5cclxuICAgIC8vIEFjY2VzcyB0byBwZW5kaW5nIGRyaXZlcnMgbGlzdCBtdXN0IGJlIGd1YXJkZWQgd2l0aCBhIFNlbWFwaG9yZSwgYmVjYXVzZVxyXG4gICAgLy8gaXQgbWlnaHQgYmUgY2hhbmdlZCBieSBvdGhlciBhc3luYyBjYWxscyBhdCBhbnkgdGltZVxyXG4gICAgLy8gSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIGFjY2VzcyB0aGlzIHByb3BlcnR5IGRpcmVjdGx5IGZyb20gdGhlIG91dHNpZGVcclxuICAgIHRoaXMucGVuZGluZ0RyaXZlcnMgPSB7fTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbCBjb21tYW5kcyBxdWV1ZWluZyBmb3IgdGhlIHVtYnJlbGxhIEFwcGl1bSBkcml2ZXJcclxuICAgKi9cclxuICBnZXQgaXNDb21tYW5kc1F1ZXVlRW5hYmxlZCAoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzZXNzaW9uRXhpc3RzIChzZXNzaW9uSWQpIHtcclxuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XHJcbiAgICByZXR1cm4gZHN0U2Vzc2lvbiAmJiBkc3RTZXNzaW9uLnNlc3Npb25JZCAhPT0gbnVsbDtcclxuICB9XHJcblxyXG4gIGRyaXZlckZvclNlc3Npb24gKHNlc3Npb25JZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXTtcclxuICB9XHJcblxyXG4gIGdldERyaXZlckZvckNhcHMgKGNhcHMpIHtcclxuICAgIC8vIFRPRE8gaWYgdGhpcyBsb2dpYyBldmVyIGJlY29tZXMgY29tcGxleCwgc2hvdWxkIHByb2JhYmx5IGZhY3RvciBvdXRcclxuICAgIC8vIGludG8gaXRzIG93biBmaWxlXHJcbiAgICBpZiAoIWNhcHMucGxhdGZvcm1OYW1lIHx8ICFfLmlzU3RyaW5nKGNhcHMucGxhdGZvcm1OYW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBpbmNsdWRlIGEgcGxhdGZvcm1OYW1lIGNhcGFiaWxpdHlcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhbiBgYXV0b21hdGlvbk5hbWVgIGNhcGFiaWxpdHksXHJcbiAgICBpZiAoY2Fwcy5hdXRvbWF0aW9uTmFtZSkge1xyXG4gICAgICBpZiAoY2Fwcy5hdXRvbWF0aW9uTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZW5kcm9pZCcpIHtcclxuICAgICAgICAvLyBidXQgaWYgd2UgZG8gYW5kIGl0IGlzICdTZWxlbmRyb2lkJywgYWN0IG9uIGl0XHJcbiAgICAgICAgcmV0dXJuIFNlbGVuZHJvaWREcml2ZXI7XHJcbiAgICAgIH0gZWxzZSBpZiAoY2Fwcy5hdXRvbWF0aW9uTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndWlhdXRvbWF0b3IyJykge1xyXG4gICAgICAgIC8vIGJ1dCBpZiB3ZSBkbyBhbmQgaXQgaXMgJ1VpYXV0b21hdG9yMicsIGFjdCBvbiBpdFxyXG4gICAgICAgIHJldHVybiBBbmRyb2lkVWlhdXRvbWF0b3IyRHJpdmVyO1xyXG4gICAgICB9IGVsc2UgaWYgKGNhcHMuYXV0b21hdGlvbk5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3hjdWl0ZXN0Jykge1xyXG4gICAgICAgIC8vIGJ1dCBpZiB3ZSBkbyBhbmQgaXQgaXMgJ1hDVUlUZXN0JywgYWN0IG9uIGl0XHJcbiAgICAgICAgcmV0dXJuIFhDVUlUZXN0RHJpdmVyO1xyXG4gICAgICB9IGVsc2UgaWYgKGNhcHMuYXV0b21hdGlvbk5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3lvdWllbmdpbmUnKSB7XHJcbiAgICAgICAgLy8gYnV0IGlmIHdlIGRvIGFuZCBpdCBpcyAnWW91aUVuZ2luZScsIGFjdCBvbiBpdFxyXG4gICAgICAgIHJldHVybiBZb3VpRW5naW5lRHJpdmVyO1xyXG4gICAgICB9IGVsc2UgaWYgKGNhcHMuYXV0b21hdGlvbk5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2VzcHJlc3NvJykge1xyXG4gICAgICAgIGxvZy53YXJuKCdUaGUgQXBwaXVtIEVzcHJlc3NvIGRyaXZlciBpcyBjdXJyZW50bHkgaW4gZWFybHkgYmV0YSBhbmQgbWVhbnQgb25seSBmb3IgZXhwZXJpbWVudGFsIHVzYWdlLiBJdHMgQVBJIGlzIG5vdCB5ZXQgY29tcGxldGUgb3IgZ3VhcmFudGVlZCB0byB3b3JrLiBQbGVhc2UgcmVwb3J0IGJ1Z3MgdG8gdGhlIEFwcGl1bSB0ZWFtIG9uIEdpdEh1Yi4nKTtcclxuICAgICAgICByZXR1cm4gRXNwcmVzc29Ecml2ZXI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2Fwcy5wbGF0Zm9ybU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWtlXCIpIHtcclxuICAgICAgcmV0dXJuIEZha2VEcml2ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcHMucGxhdGZvcm1OYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhbmRyb2lkJykge1xyXG4gICAgICByZXR1cm4gQW5kcm9pZERyaXZlcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2Fwcy5wbGF0Zm9ybU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lvcycpIHtcclxuICAgICAgaWYgKGNhcHMucGxhdGZvcm1WZXJzaW9uKSB7XHJcbiAgICAgICAgbGV0IG1ham9yVmVyID0gY2Fwcy5wbGF0Zm9ybVZlcnNpb24udG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMF07XHJcbiAgICAgICAgaWYgKHBhcnNlSW50KG1ham9yVmVyLCAxMCkgPj0gMTApIHtcclxuICAgICAgICAgIGxvZy5pbmZvKFwiUmVxdWVzdGVkIGlPUyBzdXBwb3J0IHdpdGggdmVyc2lvbiA+PSAxMCwgdXNpbmcgWENVSVRlc3QgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgXCJkcml2ZXIgaW5zdGVhZCBvZiBVSUF1dG9tYXRpb24tYmFzZWQgZHJpdmVyLCBzaW5jZSB0aGUgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgXCJsYXR0ZXIgaXMgdW5zdXBwb3J0ZWQgb24gaU9TIDEwIGFuZCB1cC5cIik7XHJcbiAgICAgICAgICByZXR1cm4gWENVSVRlc3REcml2ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gSW9zRHJpdmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYXBzLnBsYXRmb3JtTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnd2luZG93cycpIHtcclxuICAgICAgcmV0dXJuIFdpbmRvd3NEcml2ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcHMucGxhdGZvcm1OYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdtYWMnKSB7XHJcbiAgICAgIHJldHVybiBNYWNEcml2ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1zZztcclxuICAgIGlmIChjYXBzLmF1dG9tYXRpb25OYW1lKSB7XHJcbiAgICAgIG1zZyA9IGBDb3VsZCBub3QgZmluZCBhIGRyaXZlciBmb3IgYXV0b21hdGlvbk5hbWUgJyR7Y2Fwcy5hdXRvbWF0aW9uTmFtZX0nIGFuZCBwbGF0Zm9ybU5hbWUgYCArXHJcbiAgICAgICAgICAgIGAnJHtjYXBzLnBsYXRmb3JtTmFtZX0nLmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtc2cgPSBgQ291bGQgbm90IGZpbmQgYSBkcml2ZXIgZm9yIHBsYXRmb3JtTmFtZSAnJHtjYXBzLnBsYXRmb3JtTmFtZX0nLmA7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnfSBQbGVhc2UgY2hlY2sgeW91ciBkZXNpcmVkIGNhcGFiaWxpdGllcy5gKTtcclxuICB9XHJcblxyXG4gIGdldERyaXZlclZlcnNpb24gKGRyaXZlcikge1xyXG4gICAgY29uc3QgTkFNRV9EUklWRVJfTUFQID0ge1xyXG4gICAgICBTZWxlbmRyb2lkRHJpdmVyOiAnYXBwaXVtLXNlbGVuZHJvaWQtZHJpdmVyJyxcclxuICAgICAgQW5kcm9pZFVpYXV0b21hdG9yMkRyaXZlcjogJ2FwcGl1bS11aWF1dG9tYXRvcjItZHJpdmVyJyxcclxuICAgICAgWENVSVRlc3REcml2ZXI6ICdhcHBpdW0teGN1aXRlc3QtZHJpdmVyJyxcclxuICAgICAgWW91aUVuZ2luZURyaXZlcjogJ2FwcGl1bS15b3VpZW5naW5lLWRyaXZlcicsXHJcbiAgICAgIEZha2VEcml2ZXI6ICdhcHBpdW0tZmFrZS1kcml2ZXInLFxyXG4gICAgICBBbmRyb2lkRHJpdmVyOiAnYXBwaXVtLWFuZHJvaWQtZHJpdmVyJyxcclxuICAgICAgSW9zRHJpdmVyOiAnYXBwaXVtLWlvcy1kcml2ZXInLFxyXG4gICAgICBXaW5kb3dzRHJpdmVyOiAnYXBwaXVtLXdpbmRvd3MtZHJpdmVyJyxcclxuICAgICAgTWFjRHJpdmVyOiAnYXBwaXVtLW1hYy1kcml2ZXInLFxyXG4gICAgfTtcclxuICAgIGlmICghTkFNRV9EUklWRVJfTUFQW2RyaXZlci5uYW1lXSkge1xyXG4gICAgICBsb2cud2FybihgVW5hYmxlIHRvIGdldCB2ZXJzaW9uIG9mIGRyaXZlciAnJHtkcml2ZXIubmFtZX0nYCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCB7dmVyc2lvbn0gPSByZXF1aXJlKGAke05BTUVfRFJJVkVSX01BUFtkcml2ZXIubmFtZV19L3BhY2thZ2UuanNvbmApO1xyXG4gICAgcmV0dXJuIHZlcnNpb247XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRTdGF0dXMgKCkge1xyXG4gICAgbGV0IGNvbmZpZyA9IGF3YWl0IGdldEFwcGl1bUNvbmZpZygpO1xyXG4gICAgbGV0IGdpdFNoYSA9IGNvbmZpZ1snZ2l0LXNoYSddO1xyXG4gICAgbGV0IHN0YXR1cyA9IHtidWlsZDoge3ZlcnNpb246IGNvbmZpZy52ZXJzaW9ufX07XHJcbiAgICBpZiAodHlwZW9mIGdpdFNoYSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBzdGF0dXMuYnVpbGQucmV2aXNpb24gPSBnaXRTaGE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdHVzO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0U2Vzc2lvbnMgKCkge1xyXG4gICAgY29uc3Qgc2Vzc2lvbnMgPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zKTtcclxuICAgIHJldHVybiBfLnRvUGFpcnMoc2Vzc2lvbnMpXHJcbiAgICAgICAgLm1hcCgoW2lkLCBkcml2ZXJdKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4ge2lkLCBjYXBhYmlsaXRpZXM6IGRyaXZlci5jYXBzfTtcclxuICAgICAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaW50TmV3U2Vzc2lvbkFubm91bmNlbWVudCAoZHJpdmVyLCBjYXBzKSB7XHJcbiAgICBsZXQgZHJpdmVyVmVyc2lvbiA9IHRoaXMuZ2V0RHJpdmVyVmVyc2lvbihkcml2ZXIpO1xyXG4gICAgbGV0IGludHJvU3RyaW5nID0gZHJpdmVyVmVyc2lvbiA/XHJcbiAgICAgIGBDcmVhdGluZyBuZXcgJHtkcml2ZXIubmFtZX0gKHYke2RyaXZlclZlcnNpb259KSBzZXNzaW9uYCA6XHJcbiAgICAgIGBDcmVhdGluZyBuZXcgJHtkcml2ZXIubmFtZX0gc2Vzc2lvbmA7XHJcbiAgICBsb2cuaW5mbyhpbnRyb1N0cmluZyk7XHJcbiAgICBsb2cuaW5mbygnQ2FwYWJpbGl0aWVzOicpO1xyXG4gICAgaW5zcGVjdE9iamVjdChjYXBzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBzZXNzaW9uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlc2lyZWRDYXBzIEpTT05XUCBmb3JtYXR0ZWQgZGVzaXJlZCBjYXBhYmlsaXRpZXNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxQ2FwcyBSZXF1aXJlZCBjYXBhYmlsaXRpZXNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FwYWJpbGl0aWVzIFczQyBjYXBhYmlsaXRpZXNcclxuICAgKiBAcmV0dXJuIHtBcnJheX0gVW5pcXVlIHNlc3Npb24gSUQgYW5kIGNhcGFiaWxpdGllc1xyXG4gICAqL1xyXG4gIGFzeW5jIGNyZWF0ZVNlc3Npb24gKGRlc2lyZWRDYXBzPXt9LCByZXFDYXBzLCBjYXBhYmlsaXRpZXMpIHtcclxuICAgIGlmIChjYXBhYmlsaXRpZXMpIHtcclxuICAgICAgLy8gTWVyZ2luZyBXM0MgY2FwcyBpbnRvIGRlc2lyZWRDYXBzIGlzIGEgc3RvcC1nYXAgdW50aWwgYWxsIHRoZSBjbGllbnRzIGFuZCBkcml2ZXJzIGJlY29tZSBmdWxseSBXM0MgY29tcGxpYW50XHJcbiAgICAgIGxvZy5pbmZvKGBNZXJnZWQgVzNDIGNhcGFiaWxpdGllcyAke18udHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoY2FwYWJpbGl0aWVzKSwge2xlbmd0aDogNTB9KX0gaW50byBkZXNpcmVkQ2FwYWJpbGl0aWVzIG9iamVjdCAke18udHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoZGVzaXJlZENhcHMpLCB7bGVuZ3RoOiA1MH0pfWApO1xyXG4gICAgICBsZXQgdzNjQ2FwcyA9IHByb2Nlc3NDYXBhYmlsaXRpZXMoY2FwYWJpbGl0aWVzLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIGRlc2lyZWRDYXBzID0gXy5tZXJnZShkZXNpcmVkQ2FwcywgdzNjQ2Fwcyk7XHJcbiAgICB9XHJcbiAgICBkZXNpcmVkQ2FwcyA9IF8uZGVmYXVsdHMoXy5jbG9uZShkZXNpcmVkQ2FwcyksIHRoaXMuYXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzKTtcclxuICAgIGxldCBJbm5lckRyaXZlciA9IHRoaXMuZ2V0RHJpdmVyRm9yQ2FwcyhkZXNpcmVkQ2Fwcyk7XHJcbiAgICB0aGlzLnByaW50TmV3U2Vzc2lvbkFubm91bmNlbWVudChJbm5lckRyaXZlciwgZGVzaXJlZENhcHMpO1xyXG5cclxuICAgIGlmICh0aGlzLmFyZ3Muc2Vzc2lvbk92ZXJyaWRlKSB7XHJcbiAgICAgIGNvbnN0IHNlc3Npb25JZHNUb0RlbGV0ZSA9IGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IF8ua2V5cyh0aGlzLnNlc3Npb25zKSk7XHJcbiAgICAgIGlmIChzZXNzaW9uSWRzVG9EZWxldGUubGVuZ3RoKSB7XHJcbiAgICAgICAgbG9nLmluZm8oYFNlc3Npb24gb3ZlcnJpZGUgaXMgb24uIERlbGV0aW5nIG90aGVyICR7c2Vzc2lvbklkc1RvRGVsZXRlLmxlbmd0aH0gYWN0aXZlIHNlc3Npb24ke3Nlc3Npb25JZHNUb0RlbGV0ZS5sZW5ndGggPyAnJyA6ICdzJ30uYCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGF3YWl0IEIubWFwKHNlc3Npb25JZHNUb0RlbGV0ZSwgKGlkKSA9PiB0aGlzLmRlbGV0ZVNlc3Npb24oaWQpKTtcclxuICAgICAgICB9IGNhdGNoIChpZ24pIHt9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcnVubmluZ0RyaXZlcnNEYXRhLCBvdGhlclBlbmRpbmdEcml2ZXJzRGF0YTtcclxuICAgIGxldCBkID0gbmV3IElubmVyRHJpdmVyKHRoaXMuYXJncyk7XHJcbiAgICBpZiAodGhpcy5hcmdzLnJlbGF4ZWRTZWN1cml0eUVuYWJsZWQpIHtcclxuICAgICAgbG9nLmluZm8oYEFwcGx5aW5nIHJlbGF4ZWQgc2VjdXJpdHkgdG8gJHtJbm5lckRyaXZlci5uYW1lfSBhcyBwZXIgc2VydmVyIGNvbW1hbmQgbGluZSBhcmd1bWVudGApO1xyXG4gICAgICBkLnJlbGF4ZWRTZWN1cml0eUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgcnVubmluZ0RyaXZlcnNEYXRhID0gYXdhaXQgdGhpcy5jdXJTZXNzaW9uRGF0YUZvckRyaXZlcihJbm5lckRyaXZlcik7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuU2Vzc2lvbk5vdENyZWF0ZWRFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgcGVuZGluZ0RyaXZlcnNHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMucGVuZGluZ0RyaXZlcnNbSW5uZXJEcml2ZXIubmFtZV0gPSB0aGlzLnBlbmRpbmdEcml2ZXJzW0lubmVyRHJpdmVyLm5hbWVdIHx8IFtdO1xyXG4gICAgICBvdGhlclBlbmRpbmdEcml2ZXJzRGF0YSA9IHRoaXMucGVuZGluZ0RyaXZlcnNbSW5uZXJEcml2ZXIubmFtZV0ubWFwKChkcnYpID0+IGRydi5kcml2ZXJEYXRhKTtcclxuICAgICAgdGhpcy5wZW5kaW5nRHJpdmVyc1tJbm5lckRyaXZlci5uYW1lXS5wdXNoKGQpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgaW5uZXJTZXNzaW9uSWQsIGRDYXBzO1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gVE9ETzogV2hlbiB3ZSBzdXBwb3J0IFczQyBwYXNzIGluIGNhcGFiaWxpdGllcyBvYmplY3RcclxuICAgICAgW2lubmVyU2Vzc2lvbklkLCBkQ2Fwc10gPSBhd2FpdCBkLmNyZWF0ZVNlc3Npb24oZGVzaXJlZENhcHMsIHJlcUNhcHMsIFsuLi5ydW5uaW5nRHJpdmVyc0RhdGEsIC4uLm90aGVyUGVuZGluZ0RyaXZlcnNEYXRhXSk7XHJcbiAgICAgIGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHtcclxuICAgICAgICB0aGlzLnNlc3Npb25zW2lubmVyU2Vzc2lvbklkXSA9IGQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgYXdhaXQgcGVuZGluZ0RyaXZlcnNHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgXy5wdWxsKHRoaXMucGVuZGluZ0RyaXZlcnNbSW5uZXJEcml2ZXIubmFtZV0sIGQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIGFuIGFzeW5jIGZ1bmN0aW9uIGJ1dCB3ZSBkb24ndCBhd2FpdCBpdCBiZWNhdXNlIGl0IGhhbmRsZXNcclxuICAgIC8vIGFuIG91dC1vZi1iYW5kIHByb21pc2Ugd2hpY2ggaXMgZnVsZmlsbGVkIGlmIHRoZSBpbm5lciBkcml2ZXJcclxuICAgIC8vIHVuZXhwZWN0ZWRseSBzaHV0cyBkb3duXHJcbiAgICB0aGlzLmF0dGFjaFVuZXhwZWN0ZWRTaHV0ZG93bkhhbmRsZXIoZCwgaW5uZXJTZXNzaW9uSWQpO1xyXG5cclxuXHJcbiAgICBsb2cuaW5mbyhgTmV3ICR7SW5uZXJEcml2ZXIubmFtZX0gc2Vzc2lvbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseSwgc2Vzc2lvbiBgICtcclxuICAgICAgICAgICAgIGAke2lubmVyU2Vzc2lvbklkfSBhZGRlZCB0byBtYXN0ZXIgc2Vzc2lvbiBsaXN0YCk7XHJcblxyXG4gICAgLy8gc2V0IHRoZSBOZXcgQ29tbWFuZCBUaW1lb3V0IGZvciB0aGUgaW5uZXIgZHJpdmVyXHJcbiAgICBkLnN0YXJ0TmV3Q29tbWFuZFRpbWVvdXQoKTtcclxuXHJcbiAgICByZXR1cm4gW2lubmVyU2Vzc2lvbklkLCBkQ2Fwc107XHJcbiAgfVxyXG5cclxuICBhc3luYyBhdHRhY2hVbmV4cGVjdGVkU2h1dGRvd25IYW5kbGVyIChkcml2ZXIsIGlubmVyU2Vzc2lvbklkKSB7XHJcbiAgICAvLyBSZW1vdmUgdGhlIHNlc3Npb24gb24gdW5leHBlY3RlZCBzaHV0ZG93biwgc28gdGhhdCB3ZSBhcmUgaW4gYSBwb3NpdGlvblxyXG4gICAgLy8gdG8gb3BlbiBhbm90aGVyIHNlc3Npb24gbGF0ZXIgb24uXHJcbiAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSByZW1vdmVkIGFuZCByZXBsYWNlZCBieSBhIG9uU2h1dGRvd24gY2FsbGJhY2suXHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkcml2ZXIub25VbmV4cGVjdGVkU2h1dGRvd247IC8vIHRoaXMgaXMgYSBjYW5jZWxsYWJsZSBwcm9taXNlXHJcbiAgICAgIC8vIGlmIHdlIGdldCBoZXJlLCB3ZSd2ZSBoYWQgYW4gdW5leHBlY3RlZCBzaHV0ZG93biwgc28gZXJyb3JcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHNodXRkb3duJyk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgQi5DYW5jZWxsYXRpb25FcnJvcikge1xyXG4gICAgICAgIC8vIGlmIHdlIGNhbmNlbGxlZCB0aGUgdW5leHBlY3RlZCBzaHV0ZG93biBwcm9taXNlLCB0aGF0IG1lYW5zIHdlXHJcbiAgICAgICAgLy8gbm8gbG9uZ2VyIGNhcmUgYWJvdXQgaXQsIGFuZCBjYW4gc2FmZWx5IGlnbm9yZSBpdFxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBsb2cud2FybihgQ2xvc2luZyBzZXNzaW9uLCBjYXVzZSB3YXMgJyR7ZS5tZXNzYWdlfSdgKTtcclxuICAgICAgbG9nLmluZm8oYFJlbW92aW5nIHNlc3Npb24gJHtpbm5lclNlc3Npb25JZH0gZnJvbSBvdXIgbWFzdGVyIHNlc3Npb24gbGlzdGApO1xyXG4gICAgICBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuc2Vzc2lvbnNbaW5uZXJTZXNzaW9uSWRdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGN1clNlc3Npb25EYXRhRm9yRHJpdmVyIChJbm5lckRyaXZlcikge1xyXG4gICAgY29uc3Qgc2Vzc2lvbnMgPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zKTtcclxuICAgIGNvbnN0IGRhdGEgPSBfLnZhbHVlcyhzZXNzaW9ucylcclxuICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHMpID0+IHMuY29uc3RydWN0b3IubmFtZSA9PT0gSW5uZXJEcml2ZXIubmFtZSlcclxuICAgICAgICAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuZHJpdmVyRGF0YSk7XHJcbiAgICBmb3IgKGxldCBkYXR1bSBvZiBkYXRhKSB7XHJcbiAgICAgIGlmICghZGF0dW0pIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb2JsZW0gZ2V0dGluZyBzZXNzaW9uIGRhdGEgZm9yIGRyaXZlciB0eXBlIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtJbm5lckRyaXZlci5uYW1lfTsgZG9lcyBpdCBpbXBsZW1lbnQgJ2dldCBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGRyaXZlckRhdGEnP2ApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRlbGV0ZVNlc3Npb24gKHNlc3Npb25JZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IG90aGVyU2Vzc2lvbnNEYXRhID0gbnVsbDtcclxuICAgICAgbGV0IGRzdFNlc3Npb24gPSBudWxsO1xyXG4gICAgICBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF0pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY3VyQ29uc3RydWN0b3JOYW1lID0gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgb3RoZXJTZXNzaW9uc0RhdGEgPSBfLnRvUGFpcnModGhpcy5zZXNzaW9ucylcclxuICAgICAgICAgICAgICAuZmlsdGVyKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgPT09IGN1ckNvbnN0cnVjdG9yTmFtZSAmJiBrZXkgIT09IHNlc3Npb25JZClcclxuICAgICAgICAgICAgICAubWFwKChbLCB2YWx1ZV0pID0+IHZhbHVlLmRyaXZlckRhdGEpO1xyXG4gICAgICAgIGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XHJcbiAgICAgICAgbG9nLmluZm8oYFJlbW92aW5nIHNlc3Npb24gJHtzZXNzaW9uSWR9IGZyb20gb3VyIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcclxuICAgICAgICAvLyByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIGRlbGV0ZVNlc3Npb24gY29tcGxldGVzIHN1Y2Nlc3NmdWxseSBvciBub3RcclxuICAgICAgICAvLyBtYWtlIHRoZSBzZXNzaW9uIHVuYXZhaWxhYmxlLCBiZWNhdXNlIHdobyBrbm93cyB3aGF0IHN0YXRlIGl0IG1pZ2h0XHJcbiAgICAgICAgLy8gYmUgaW4gb3RoZXJ3aXNlXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXTtcclxuICAgICAgfSk7XHJcbiAgICAgIGF3YWl0IGRzdFNlc3Npb24uZGVsZXRlU2Vzc2lvbihzZXNzaW9uSWQsIG90aGVyU2Vzc2lvbnNEYXRhKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbG9nLmVycm9yKGBIYWQgdHJvdWJsZSBlbmRpbmcgc2Vzc2lvbiAke3Nlc3Npb25JZH06ICR7ZS5tZXNzYWdlfWApO1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZXhlY3V0ZUNvbW1hbmQgKGNtZCwgLi4uYXJncykge1xyXG4gICAgLy8gZ2V0U3RhdHVzIGNvbW1hbmQgc2hvdWxkIG5vdCBiZSBwdXQgaW50byBxdWV1ZS4gSWYgd2UgZG8gaXQgYXMgcGFydCBvZiBzdXBlci5leGVjdXRlQ29tbWFuZCwgaXQgd2lsbCBiZSBhZGRlZCB0byBxdWV1ZS5cclxuICAgIC8vIFRoZXJlIHdpbGwgYmUgbG90IG9mIHN0YXR1cyBjb21tYW5kcyBpbiBxdWV1ZSBkdXJpbmcgY3JlYXRlU2Vzc2lvbiBjb21tYW5kLCBhcyBjcmVhdGVTZXNzaW9uIGNhbiB0YWtlIHVwIHRvIG9yIG1vcmUgdGhhbiBhIG1pbnV0ZS5cclxuICAgIGlmIChjbWQgPT09ICdnZXRTdGF0dXMnKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFN0YXR1cygpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzQXBwaXVtRHJpdmVyQ29tbWFuZChjbWQpKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCBzdXBlci5leGVjdXRlQ29tbWFuZChjbWQsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlc3Npb25JZCA9IF8ubGFzdChhcmdzKTtcclxuICAgIGNvbnN0IGRzdFNlc3Npb24gPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF0pO1xyXG4gICAgaWYgKCFkc3RTZXNzaW9uKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHNlc3Npb24gd2l0aCBpZCAnJHtzZXNzaW9uSWR9JyBkb2VzIG5vdCBleGlzdGApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IGRzdFNlc3Npb24uZXhlY3V0ZUNvbW1hbmQoY21kLCAuLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIHByb3h5QWN0aXZlIChzZXNzaW9uSWQpIHtcclxuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XHJcbiAgICByZXR1cm4gZHN0U2Vzc2lvbiAmJiBfLmlzRnVuY3Rpb24oZHN0U2Vzc2lvbi5wcm94eUFjdGl2ZSkgJiYgZHN0U2Vzc2lvbi5wcm94eUFjdGl2ZShzZXNzaW9uSWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJveHlBdm9pZExpc3QgKHNlc3Npb25JZCkge1xyXG4gICAgY29uc3QgZHN0U2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXTtcclxuICAgIHJldHVybiBkc3RTZXNzaW9uID8gZHN0U2Vzc2lvbi5nZXRQcm94eUF2b2lkTGlzdCgpIDogW107XHJcbiAgfVxyXG5cclxuICBjYW5Qcm94eSAoc2Vzc2lvbklkKSB7XHJcbiAgICBjb25zdCBkc3RTZXNzaW9uID0gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdO1xyXG4gICAgcmV0dXJuIGRzdFNlc3Npb24gJiYgZHN0U2Vzc2lvbi5jYW5Qcm94eShzZXNzaW9uSWQpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGVscCBkZWNpZGUgd2hpY2ggY29tbWFuZHMgc2hvdWxkIGJlIHByb3hpZWQgdG8gc3ViLWRyaXZlcnMgYW5kIHdoaWNoXHJcbi8vIHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoaXMsIG91ciB1bWJyZWxsYSBkcml2ZXJcclxuZnVuY3Rpb24gaXNBcHBpdW1Ecml2ZXJDb21tYW5kIChjbWQpIHtcclxuICByZXR1cm4gIWlzU2Vzc2lvbkNvbW1hbmQoY21kKSB8fCBjbWQgPT09IFwiZGVsZXRlU2Vzc2lvblwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcHBpdW1Sb3V0ZXIgKGFyZ3MpIHtcclxuICBsZXQgYXBwaXVtID0gbmV3IEFwcGl1bURyaXZlcihhcmdzKTtcclxuICByZXR1cm4gcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uKGFwcGl1bSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEFwcGl1bURyaXZlciwgZ2V0QXBwaXVtUm91dGVyIH07XHJcbmV4cG9ydCBkZWZhdWx0IGdldEFwcGl1bVJvdXRlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIuLlxcLi4ifQ==
