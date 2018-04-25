require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _libAppium = require('../lib/appium');

var _appiumFakeDriver = require('appium-fake-driver');

var _helpers = require('./helpers');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _appiumXcuitestDriver = require('appium-xcuitest-driver');

var _appiumIosDriver = require('appium-ios-driver');

var _asyncbox = require('asyncbox');

_chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

var BASE_CAPS = { platformName: 'Fake', deviceName: 'Fake', app: _helpers.TEST_FAKE_APP };
var SESSION_ID = 1;

describe('AppiumDriver', function () {
  describe('getAppiumRouter', function () {
    it('should return a route configuring function', function callee$2$0() {
      var routeConfiguringFunction;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            routeConfiguringFunction = (0, _libAppium.getAppiumRouter)({});

            routeConfiguringFunction.should.be.a['function'];

          case 2:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('AppiumDriver', function () {
    function getDriverAndFakeDriver() {
      var appium = new _libAppium.AppiumDriver({});
      var fakeDriver = new _appiumFakeDriver.FakeDriver();
      var mockFakeDriver = _sinon2['default'].mock(fakeDriver);
      appium.getDriverForCaps = function () /*args*/{
        return function () {
          return fakeDriver;
        };
      };
      return [appium, mockFakeDriver];
    }
    describe('createSession', function () {
      var appium = undefined;
      var mockFakeDriver = undefined;
      beforeEach(function () {
        var _getDriverAndFakeDriver = getDriverAndFakeDriver();

        var _getDriverAndFakeDriver2 = _slicedToArray(_getDriverAndFakeDriver, 2);

        appium = _getDriverAndFakeDriver2[0];
        mockFakeDriver = _getDriverAndFakeDriver2[1];
      });
      afterEach(function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              mockFakeDriver.restore();
              context$4$0.next = 3;
              return _regeneratorRuntime.awrap(appium.deleteSession(SESSION_ID));

            case 3:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });

      it('should call inner driver\'s createSession with desired capabilities', function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              mockFakeDriver.expects("createSession").once().withExactArgs(BASE_CAPS, undefined, []).returns([SESSION_ID, BASE_CAPS]);
              context$4$0.next = 3;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 3:
              mockFakeDriver.verify();

            case 4:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should call inner driver\'s createSession with desired and default capabilities', function callee$3$0() {
        var defaultCaps, allCaps;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              defaultCaps = { deviceName: 'Emulator' }, allCaps = _lodash2['default'].extend(_lodash2['default'].clone(defaultCaps), BASE_CAPS);

              appium.args.defaultCapabilities = defaultCaps;
              mockFakeDriver.expects("createSession").once().withArgs(allCaps).returns([SESSION_ID, allCaps]);
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 5:
              mockFakeDriver.verify();

            case 6:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should call inner driver\'s createSession with desired and default capabilities without overriding caps', function callee$3$0() {
        var defaultCaps;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              defaultCaps = { platformName: 'Ersatz' };

              appium.args.defaultCapabilities = defaultCaps;
              mockFakeDriver.expects("createSession").once().withArgs(BASE_CAPS).returns([SESSION_ID, BASE_CAPS]);
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 5:
              mockFakeDriver.verify();

            case 6:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should kill all other sessions if sessionOverride is on', function callee$3$0() {
        var fakeDrivers, mockFakeDrivers, sessions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mfd;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              appium.args.sessionOverride = true;

              // mock three sessions that should be removed when the new one is created
              fakeDrivers = [new _appiumFakeDriver.FakeDriver(), new _appiumFakeDriver.FakeDriver(), new _appiumFakeDriver.FakeDriver()];
              mockFakeDrivers = _lodash2['default'].map(fakeDrivers, function (fd) {
                return _sinon2['default'].mock(fd);
              });

              mockFakeDrivers[0].expects('deleteSession').once();
              mockFakeDrivers[1].expects('deleteSession').once().throws('Cannot shut down Android driver; it has already shut down');
              mockFakeDrivers[2].expects('deleteSession').once();
              appium.sessions['abc-123-xyz'] = fakeDrivers[0];
              appium.sessions['xyz-321-abc'] = fakeDrivers[1];
              appium.sessions['123-abc-xyz'] = fakeDrivers[2];

              context$4$0.next = 11;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 11:
              sessions = context$4$0.sent;

              sessions.should.have.length(3);

              mockFakeDriver.expects("createSession").once().withExactArgs(BASE_CAPS, undefined, []).returns([SESSION_ID, BASE_CAPS]);
              context$4$0.next = 16;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 16:
              context$4$0.next = 18;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 18:
              sessions = context$4$0.sent;

              sessions.should.have.length(1);

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              context$4$0.prev = 23;
              for (_iterator = _getIterator(mockFakeDrivers); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                mfd = _step.value;

                mfd.verify();
              }
              context$4$0.next = 31;
              break;

            case 27:
              context$4$0.prev = 27;
              context$4$0.t0 = context$4$0['catch'](23);
              _didIteratorError = true;
              _iteratorError = context$4$0.t0;

            case 31:
              context$4$0.prev = 31;
              context$4$0.prev = 32;

              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }

            case 34:
              context$4$0.prev = 34;

              if (!_didIteratorError) {
                context$4$0.next = 37;
                break;
              }

              throw _iteratorError;

            case 37:
              return context$4$0.finish(34);

            case 38:
              return context$4$0.finish(31);

            case 39:
              mockFakeDriver.verify();

            case 40:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this, [[23, 27, 31, 39], [32,, 34, 38]]);
      });
    });
    describe('deleteSession', function () {
      var appium = undefined;
      var mockFakeDriver = undefined;
      beforeEach(function () {
        var _getDriverAndFakeDriver3 = getDriverAndFakeDriver();

        var _getDriverAndFakeDriver32 = _slicedToArray(_getDriverAndFakeDriver3, 2);

        appium = _getDriverAndFakeDriver32[0];
        mockFakeDriver = _getDriverAndFakeDriver32[1];
      });
      afterEach(function () {
        mockFakeDriver.restore();
      });
      it('should remove the session if it is found', function callee$3$0() {
        var _ref, _ref2, sessionId, sessions;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 2:
              _ref = context$4$0.sent;
              _ref2 = _slicedToArray(_ref, 1);
              sessionId = _ref2[0];
              context$4$0.next = 7;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 7:
              sessions = context$4$0.sent;

              sessions.should.have.length(1);
              context$4$0.next = 11;
              return _regeneratorRuntime.awrap(appium.deleteSession(sessionId));

            case 11:
              context$4$0.next = 13;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 13:
              sessions = context$4$0.sent;

              sessions.should.have.length(0);

            case 15:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should call inner driver\'s deleteSession method', function callee$3$0() {
        var _ref3, _ref32, sessionId;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(BASE_CAPS));

            case 2:
              _ref3 = context$4$0.sent;
              _ref32 = _slicedToArray(_ref3, 1);
              sessionId = _ref32[0];

              mockFakeDriver.expects("deleteSession").once().withExactArgs(sessionId, []).returns();
              context$4$0.next = 8;
              return _regeneratorRuntime.awrap(appium.deleteSession(sessionId));

            case 8:
              mockFakeDriver.verify();

              // cleanup, since we faked the delete session call
              context$4$0.next = 11;
              return _regeneratorRuntime.awrap(mockFakeDriver.object.deleteSession());

            case 11:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('getSessions', function () {
      var appium = undefined;
      var sessions = undefined;
      before(function () {
        appium = new _libAppium.AppiumDriver({});
      });
      afterEach(function callee$3$0() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, session;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              context$4$0.prev = 3;
              _iterator2 = _getIterator(sessions);

            case 5:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                context$4$0.next = 12;
                break;
              }

              session = _step2.value;
              context$4$0.next = 9;
              return _regeneratorRuntime.awrap(appium.deleteSession(session.id));

            case 9:
              _iteratorNormalCompletion2 = true;
              context$4$0.next = 5;
              break;

            case 12:
              context$4$0.next = 18;
              break;

            case 14:
              context$4$0.prev = 14;
              context$4$0.t0 = context$4$0['catch'](3);
              _didIteratorError2 = true;
              _iteratorError2 = context$4$0.t0;

            case 18:
              context$4$0.prev = 18;
              context$4$0.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }

            case 21:
              context$4$0.prev = 21;

              if (!_didIteratorError2) {
                context$4$0.next = 24;
                break;
              }

              throw _iteratorError2;

            case 24:
              return context$4$0.finish(21);

            case 25:
              return context$4$0.finish(18);

            case 26:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this, [[3, 14, 18, 26], [19,, 21, 25]]);
      });
      it('should return an empty array of sessions', function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 2:
              sessions = context$4$0.sent;

              sessions.should.be.an.array;
              sessions.should.be.empty;

            case 5:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should return sessions created', function callee$3$0() {
        var session1, session2;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(_lodash2['default'].extend(_lodash2['default'].clone(BASE_CAPS), { cap: 'value' })));

            case 2:
              session1 = context$4$0.sent;
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap(appium.createSession(_lodash2['default'].extend(_lodash2['default'].clone(BASE_CAPS), { cap: 'other value' })));

            case 5:
              session2 = context$4$0.sent;
              context$4$0.next = 8;
              return _regeneratorRuntime.awrap(appium.getSessions());

            case 8:
              sessions = context$4$0.sent;

              sessions.should.be.an.array;
              sessions.should.have.length(2);
              sessions[0].id.should.equal(session1[0]);
              sessions[0].capabilities.should.eql(session1[1]);
              sessions[1].id.should.equal(session2[0]);
              sessions[1].capabilities.should.eql(session2[1]);

            case 15:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('getStatus', function () {
      var appium = undefined;
      before(function () {
        appium = new _libAppium.AppiumDriver({});
      });
      it('should return a status', function callee$3$0() {
        var status;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.getStatus());

            case 2:
              status = context$4$0.sent;

              status.build.should.exist;
              status.build.version.should.exist;

            case 5:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('sessionExists', function () {});
    describe('attachUnexpectedShutdownHandler', function () {
      var appium = undefined,
          mockFakeDriver = undefined;
      beforeEach(function () {
        var _getDriverAndFakeDriver4 = getDriverAndFakeDriver();

        var _getDriverAndFakeDriver42 = _slicedToArray(_getDriverAndFakeDriver4, 2);

        appium = _getDriverAndFakeDriver42[0];
        mockFakeDriver = _getDriverAndFakeDriver42[1];
      });
      afterEach(function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(mockFakeDriver.object.deleteSession());

            case 2:
              mockFakeDriver.restore();
              appium.args.defaultCapabilities = {};

            case 4:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });

      it('should remove session if inner driver unexpectedly exits with an error', function callee$3$0() {
        var _ref4, _ref42, sessionId;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(_lodash2['default'].clone(BASE_CAPS)));

            case 2:
              _ref4 = context$4$0.sent;
              _ref42 = _slicedToArray(_ref4, 1);
              sessionId = _ref42[0];
              // eslint-disable-line comma-spacing
              _lodash2['default'].keys(appium.sessions).should.contain(sessionId);
              appium.sessions[sessionId].unexpectedShutdownDeferred.reject(new Error("Oops"));
              // let event loop spin so rejection is handled
              context$4$0.next = 9;
              return _regeneratorRuntime.awrap((0, _asyncbox.sleep)(1));

            case 9:
              _lodash2['default'].keys(appium.sessions).should.not.contain(sessionId);

            case 10:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should remove session if inner driver unexpectedly exits with no error', function callee$3$0() {
        var _ref5, _ref52, sessionId;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(_lodash2['default'].clone(BASE_CAPS)));

            case 2:
              _ref5 = context$4$0.sent;
              _ref52 = _slicedToArray(_ref5, 1);
              sessionId = _ref52[0];
              // eslint-disable-line comma-spacing
              _lodash2['default'].keys(appium.sessions).should.contain(sessionId);
              appium.sessions[sessionId].unexpectedShutdownDeferred.resolve();
              // let event loop spin so rejection is handled
              context$4$0.next = 9;
              return _regeneratorRuntime.awrap((0, _asyncbox.sleep)(1));

            case 9:
              _lodash2['default'].keys(appium.sessions).should.not.contain(sessionId);

            case 10:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
      it('should not remove session if inner driver cancels unexpected exit', function callee$3$0() {
        var _ref6, _ref62, sessionId;

        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(appium.createSession(_lodash2['default'].clone(BASE_CAPS)));

            case 2:
              _ref6 = context$4$0.sent;
              _ref62 = _slicedToArray(_ref6, 1);
              sessionId = _ref62[0];
              // eslint-disable-line comma-spacing
              _lodash2['default'].keys(appium.sessions).should.contain(sessionId);
              appium.sessions[sessionId].onUnexpectedShutdown.cancel();
              // let event loop spin so rejection is handled
              context$4$0.next = 9;
              return _regeneratorRuntime.awrap((0, _asyncbox.sleep)(1));

            case 9:
              _lodash2['default'].keys(appium.sessions).should.contain(sessionId);

            case 10:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('getDriverForCaps', function () {
      it('should not blow up if user does not provide platformName', function () {
        var appium = new _libAppium.AppiumDriver({});
        (function () {
          appium.getDriverForCaps({});
        }).should['throw'](/platformName/);
      });
      it('should get XCUITestDriver driver for automationName of XCUITest', function () {
        var appium = new _libAppium.AppiumDriver({});
        var driver = appium.getDriverForCaps({
          platformName: 'iOS',
          automationName: 'XCUITest'
        });
        driver.should.be.an['instanceof'](Function);
        driver.should.equal(_appiumXcuitestDriver.XCUITestDriver);
      });
      it('should get iosdriver for ios < 10', function () {
        var appium = new _libAppium.AppiumDriver({});
        var caps = {
          platformName: 'iOS',
          platformVersion: '8.0'
        };
        var driver = appium.getDriverForCaps(caps);
        driver.should.be.an['instanceof'](Function);
        driver.should.equal(_appiumIosDriver.IosDriver);

        caps.platformVersion = '8.1';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumIosDriver.IosDriver);

        caps.platformVersion = '9.4';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumIosDriver.IosDriver);

        caps.platformVersion = '';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumIosDriver.IosDriver);

        caps.platformVersion = 'foo';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumIosDriver.IosDriver);

        delete caps.platformVersion;
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumIosDriver.IosDriver);
      });
      it('should get xcuitestdriver for ios >= 10', function () {
        var appium = new _libAppium.AppiumDriver({});
        var caps = {
          platformName: 'iOS',
          platformVersion: '10'
        };
        var driver = appium.getDriverForCaps(caps);
        driver.should.be.an['instanceof'](Function);
        driver.should.equal(_appiumXcuitestDriver.XCUITestDriver);

        caps.platformVersion = '10.0';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumXcuitestDriver.XCUITestDriver);

        caps.platformVersion = '10.1';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumXcuitestDriver.XCUITestDriver);

        caps.platformVersion = '12.14';
        driver = appium.getDriverForCaps(caps);
        driver.should.equal(_appiumXcuitestDriver.XCUITestDriver);
      });
    });
  });
});

// a default capability with the same key as a desired capability
// should do nothing
//# sourceMappingURL=data:application/json;charset=utf8;base64,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WUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDOUIsY0FBTSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxjQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssc0NBQWdCLENBQUM7O0FBRXBDLFlBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQy9CLGNBQU0sR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLHNDQUFnQixDQUFDO09BQ3JDLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L2RyaXZlci1zcGVjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRyYW5zcGlsZTptb2NoYVxyXG5cclxuaW1wb3J0IHsgQXBwaXVtRHJpdmVyLCBnZXRBcHBpdW1Sb3V0ZXIgfSBmcm9tICcuLi9saWIvYXBwaXVtJztcclxuaW1wb3J0IHsgRmFrZURyaXZlciB9IGZyb20gJ2FwcGl1bS1mYWtlLWRyaXZlcic7XHJcbmltcG9ydCB7IFRFU1RfRkFLRV9BUFAgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xyXG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcclxuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xyXG5pbXBvcnQgeyBYQ1VJVGVzdERyaXZlciB9IGZyb20gJ2FwcGl1bS14Y3VpdGVzdC1kcml2ZXInO1xyXG5pbXBvcnQgeyBJb3NEcml2ZXIgfSBmcm9tICdhcHBpdW0taW9zLWRyaXZlcic7XHJcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnYXN5bmNib3gnO1xyXG5cclxuY2hhaS5zaG91bGQoKTtcclxuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xyXG5cclxuY29uc3QgQkFTRV9DQVBTID0ge3BsYXRmb3JtTmFtZTogJ0Zha2UnLCBkZXZpY2VOYW1lOiAnRmFrZScsIGFwcDogVEVTVF9GQUtFX0FQUH07XHJcbmNvbnN0IFNFU1NJT05fSUQgPSAxO1xyXG5cclxuZGVzY3JpYmUoJ0FwcGl1bURyaXZlcicsICgpID0+IHtcclxuICBkZXNjcmliZSgnZ2V0QXBwaXVtUm91dGVyJywgKCkgPT4ge1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSByb3V0ZSBjb25maWd1cmluZyBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcclxuICAgICAgbGV0IHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbiA9IGdldEFwcGl1bVJvdXRlcih7fSk7XHJcbiAgICAgIHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbi5zaG91bGQuYmUuYS5mdW5jdGlvbjtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnQXBwaXVtRHJpdmVyJywgKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gZ2V0RHJpdmVyQW5kRmFrZURyaXZlciAoKSB7XHJcbiAgICAgIGxldCBhcHBpdW0gPSBuZXcgQXBwaXVtRHJpdmVyKHt9KTtcclxuICAgICAgbGV0IGZha2VEcml2ZXIgPSBuZXcgRmFrZURyaXZlcigpO1xyXG4gICAgICBsZXQgbW9ja0Zha2VEcml2ZXIgPSBzaW5vbi5tb2NrKGZha2VEcml2ZXIpO1xyXG4gICAgICBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2FwcyA9IGZ1bmN0aW9uICgvKmFyZ3MqLykge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gZmFrZURyaXZlcjtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gW2FwcGl1bSwgbW9ja0Zha2VEcml2ZXJdO1xyXG4gICAgfVxyXG4gICAgZGVzY3JpYmUoJ2NyZWF0ZVNlc3Npb24nLCAoKSA9PiB7XHJcbiAgICAgIGxldCBhcHBpdW07XHJcbiAgICAgIGxldCBtb2NrRmFrZURyaXZlcjtcclxuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgW2FwcGl1bSwgbW9ja0Zha2VEcml2ZXJdID0gZ2V0RHJpdmVyQW5kRmFrZURyaXZlcigpO1xyXG4gICAgICB9KTtcclxuICAgICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcclxuICAgICAgICBtb2NrRmFrZURyaXZlci5yZXN0b3JlKCk7XHJcbiAgICAgICAgYXdhaXQgYXBwaXVtLmRlbGV0ZVNlc3Npb24oU0VTU0lPTl9JRCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIGlubmVyIGRyaXZlclxcJ3MgY3JlYXRlU2Vzc2lvbiB3aXRoIGRlc2lyZWQgY2FwYWJpbGl0aWVzJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIG1vY2tGYWtlRHJpdmVyLmV4cGVjdHMoXCJjcmVhdGVTZXNzaW9uXCIpXHJcbiAgICAgICAgICAub25jZSgpLndpdGhFeGFjdEFyZ3MoQkFTRV9DQVBTLCB1bmRlZmluZWQsIFtdKVxyXG4gICAgICAgICAgLnJldHVybnMoW1NFU1NJT05fSUQsIEJBU0VfQ0FQU10pO1xyXG4gICAgICAgIGF3YWl0IGFwcGl1bS5jcmVhdGVTZXNzaW9uKEJBU0VfQ0FQUyk7XHJcbiAgICAgICAgbW9ja0Zha2VEcml2ZXIudmVyaWZ5KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgaW5uZXIgZHJpdmVyXFwncyBjcmVhdGVTZXNzaW9uIHdpdGggZGVzaXJlZCBhbmQgZGVmYXVsdCBjYXBhYmlsaXRpZXMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGRlZmF1bHRDYXBzID0ge2RldmljZU5hbWU6ICdFbXVsYXRvcid9XHJcbiAgICAgICAgICAsIGFsbENhcHMgPSBfLmV4dGVuZChfLmNsb25lKGRlZmF1bHRDYXBzKSwgQkFTRV9DQVBTKTtcclxuICAgICAgICBhcHBpdW0uYXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzID0gZGVmYXVsdENhcHM7XHJcbiAgICAgICAgbW9ja0Zha2VEcml2ZXIuZXhwZWN0cyhcImNyZWF0ZVNlc3Npb25cIilcclxuICAgICAgICAgIC5vbmNlKCkud2l0aEFyZ3MoYWxsQ2FwcylcclxuICAgICAgICAgIC5yZXR1cm5zKFtTRVNTSU9OX0lELCBhbGxDYXBzXSk7XHJcbiAgICAgICAgYXdhaXQgYXBwaXVtLmNyZWF0ZVNlc3Npb24oQkFTRV9DQVBTKTtcclxuICAgICAgICBtb2NrRmFrZURyaXZlci52ZXJpZnkoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBpbm5lciBkcml2ZXJcXCdzIGNyZWF0ZVNlc3Npb24gd2l0aCBkZXNpcmVkIGFuZCBkZWZhdWx0IGNhcGFiaWxpdGllcyB3aXRob3V0IG92ZXJyaWRpbmcgY2FwcycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBhIGRlZmF1bHQgY2FwYWJpbGl0eSB3aXRoIHRoZSBzYW1lIGtleSBhcyBhIGRlc2lyZWQgY2FwYWJpbGl0eVxyXG4gICAgICAgIC8vIHNob3VsZCBkbyBub3RoaW5nXHJcbiAgICAgICAgbGV0IGRlZmF1bHRDYXBzID0ge3BsYXRmb3JtTmFtZTogJ0Vyc2F0eid9O1xyXG4gICAgICAgIGFwcGl1bS5hcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMgPSBkZWZhdWx0Q2FwcztcclxuICAgICAgICBtb2NrRmFrZURyaXZlci5leHBlY3RzKFwiY3JlYXRlU2Vzc2lvblwiKVxyXG4gICAgICAgICAgLm9uY2UoKS53aXRoQXJncyhCQVNFX0NBUFMpXHJcbiAgICAgICAgICAucmV0dXJucyhbU0VTU0lPTl9JRCwgQkFTRV9DQVBTXSk7XHJcbiAgICAgICAgYXdhaXQgYXBwaXVtLmNyZWF0ZVNlc3Npb24oQkFTRV9DQVBTKTtcclxuICAgICAgICBtb2NrRmFrZURyaXZlci52ZXJpZnkoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQga2lsbCBhbGwgb3RoZXIgc2Vzc2lvbnMgaWYgc2Vzc2lvbk92ZXJyaWRlIGlzIG9uJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGFwcGl1bS5hcmdzLnNlc3Npb25PdmVycmlkZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIG1vY2sgdGhyZWUgc2Vzc2lvbnMgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIHRoZSBuZXcgb25lIGlzIGNyZWF0ZWRcclxuICAgICAgICBsZXQgZmFrZURyaXZlcnMgPSBbbmV3IEZha2VEcml2ZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZha2VEcml2ZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZha2VEcml2ZXIoKV07XHJcbiAgICAgICAgbGV0IG1vY2tGYWtlRHJpdmVycyA9IF8ubWFwKGZha2VEcml2ZXJzLCAoZmQpID0+IHtyZXR1cm4gc2lub24ubW9jayhmZCk7fSk7XHJcbiAgICAgICAgbW9ja0Zha2VEcml2ZXJzWzBdLmV4cGVjdHMoJ2RlbGV0ZVNlc3Npb24nKVxyXG4gICAgICAgICAgLm9uY2UoKTtcclxuICAgICAgICBtb2NrRmFrZURyaXZlcnNbMV0uZXhwZWN0cygnZGVsZXRlU2Vzc2lvbicpXHJcbiAgICAgICAgICAub25jZSgpXHJcbiAgICAgICAgICAudGhyb3dzKCdDYW5ub3Qgc2h1dCBkb3duIEFuZHJvaWQgZHJpdmVyOyBpdCBoYXMgYWxyZWFkeSBzaHV0IGRvd24nKTtcclxuICAgICAgICBtb2NrRmFrZURyaXZlcnNbMl0uZXhwZWN0cygnZGVsZXRlU2Vzc2lvbicpXHJcbiAgICAgICAgICAub25jZSgpO1xyXG4gICAgICAgIGFwcGl1bS5zZXNzaW9uc1snYWJjLTEyMy14eXonXSA9IGZha2VEcml2ZXJzWzBdO1xyXG4gICAgICAgIGFwcGl1bS5zZXNzaW9uc1sneHl6LTMyMS1hYmMnXSA9IGZha2VEcml2ZXJzWzFdO1xyXG4gICAgICAgIGFwcGl1bS5zZXNzaW9uc1snMTIzLWFiYy14eXonXSA9IGZha2VEcml2ZXJzWzJdO1xyXG5cclxuICAgICAgICBsZXQgc2Vzc2lvbnMgPSBhd2FpdCBhcHBpdW0uZ2V0U2Vzc2lvbnMoKTtcclxuICAgICAgICBzZXNzaW9ucy5zaG91bGQuaGF2ZS5sZW5ndGgoMyk7XHJcblxyXG4gICAgICAgIG1vY2tGYWtlRHJpdmVyLmV4cGVjdHMoXCJjcmVhdGVTZXNzaW9uXCIpXHJcbiAgICAgICAgICAub25jZSgpLndpdGhFeGFjdEFyZ3MoQkFTRV9DQVBTLCB1bmRlZmluZWQsIFtdKVxyXG4gICAgICAgICAgLnJldHVybnMoW1NFU1NJT05fSUQsIEJBU0VfQ0FQU10pO1xyXG4gICAgICAgIGF3YWl0IGFwcGl1bS5jcmVhdGVTZXNzaW9uKEJBU0VfQ0FQUyk7XHJcblxyXG4gICAgICAgIHNlc3Npb25zID0gYXdhaXQgYXBwaXVtLmdldFNlc3Npb25zKCk7XHJcbiAgICAgICAgc2Vzc2lvbnMuc2hvdWxkLmhhdmUubGVuZ3RoKDEpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBtZmQgb2YgbW9ja0Zha2VEcml2ZXJzKSB7XHJcbiAgICAgICAgICBtZmQudmVyaWZ5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1vY2tGYWtlRHJpdmVyLnZlcmlmeSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2RlbGV0ZVNlc3Npb24nLCAoKSA9PiB7XHJcbiAgICAgIGxldCBhcHBpdW07XHJcbiAgICAgIGxldCBtb2NrRmFrZURyaXZlcjtcclxuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgW2FwcGl1bSwgbW9ja0Zha2VEcml2ZXJdID0gZ2V0RHJpdmVyQW5kRmFrZURyaXZlcigpO1xyXG4gICAgICB9KTtcclxuICAgICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICBtb2NrRmFrZURyaXZlci5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIHJlbW92ZSB0aGUgc2Vzc2lvbiBpZiBpdCBpcyBmb3VuZCcsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBsZXQgW3Nlc3Npb25JZF0gPSBhd2FpdCBhcHBpdW0uY3JlYXRlU2Vzc2lvbihCQVNFX0NBUFMpO1xyXG4gICAgICAgIGxldCBzZXNzaW9ucyA9IGF3YWl0IGFwcGl1bS5nZXRTZXNzaW9ucygpO1xyXG4gICAgICAgIHNlc3Npb25zLnNob3VsZC5oYXZlLmxlbmd0aCgxKTtcclxuICAgICAgICBhd2FpdCBhcHBpdW0uZGVsZXRlU2Vzc2lvbihzZXNzaW9uSWQpO1xyXG4gICAgICAgIHNlc3Npb25zID0gYXdhaXQgYXBwaXVtLmdldFNlc3Npb25zKCk7XHJcbiAgICAgICAgc2Vzc2lvbnMuc2hvdWxkLmhhdmUubGVuZ3RoKDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIGlubmVyIGRyaXZlclxcJ3MgZGVsZXRlU2Vzc2lvbiBtZXRob2QnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgW3Nlc3Npb25JZF0gPSBhd2FpdCBhcHBpdW0uY3JlYXRlU2Vzc2lvbihCQVNFX0NBUFMpO1xyXG4gICAgICAgIG1vY2tGYWtlRHJpdmVyLmV4cGVjdHMoXCJkZWxldGVTZXNzaW9uXCIpXHJcbiAgICAgICAgICAub25jZSgpLndpdGhFeGFjdEFyZ3Moc2Vzc2lvbklkLCBbXSlcclxuICAgICAgICAgIC5yZXR1cm5zKCk7XHJcbiAgICAgICAgYXdhaXQgYXBwaXVtLmRlbGV0ZVNlc3Npb24oc2Vzc2lvbklkKTtcclxuICAgICAgICBtb2NrRmFrZURyaXZlci52ZXJpZnkoKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYW51cCwgc2luY2Ugd2UgZmFrZWQgdGhlIGRlbGV0ZSBzZXNzaW9uIGNhbGxcclxuICAgICAgICBhd2FpdCBtb2NrRmFrZURyaXZlci5vYmplY3QuZGVsZXRlU2Vzc2lvbigpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2dldFNlc3Npb25zJywgKCkgPT4ge1xyXG4gICAgICBsZXQgYXBwaXVtO1xyXG4gICAgICBsZXQgc2Vzc2lvbnM7XHJcbiAgICAgIGJlZm9yZSgoKSA9PiB7XHJcbiAgICAgICAgYXBwaXVtID0gbmV3IEFwcGl1bURyaXZlcih7fSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IHNlc3Npb24gb2Ygc2Vzc2lvbnMpIHtcclxuICAgICAgICAgIGF3YWl0IGFwcGl1bS5kZWxldGVTZXNzaW9uKHNlc3Npb24uaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIGVtcHR5IGFycmF5IG9mIHNlc3Npb25zJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHNlc3Npb25zID0gYXdhaXQgYXBwaXVtLmdldFNlc3Npb25zKCk7XHJcbiAgICAgICAgc2Vzc2lvbnMuc2hvdWxkLmJlLmFuLmFycmF5O1xyXG4gICAgICAgIHNlc3Npb25zLnNob3VsZC5iZS5lbXB0eTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHNlc3Npb25zIGNyZWF0ZWQnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlc3Npb24xID0gYXdhaXQgYXBwaXVtLmNyZWF0ZVNlc3Npb24oXy5leHRlbmQoXy5jbG9uZShCQVNFX0NBUFMpLCB7Y2FwOiAndmFsdWUnfSkpO1xyXG4gICAgICAgIGxldCBzZXNzaW9uMiA9IGF3YWl0IGFwcGl1bS5jcmVhdGVTZXNzaW9uKF8uZXh0ZW5kKF8uY2xvbmUoQkFTRV9DQVBTKSwge2NhcDogJ290aGVyIHZhbHVlJ30pKTtcclxuXHJcbiAgICAgICAgc2Vzc2lvbnMgPSBhd2FpdCBhcHBpdW0uZ2V0U2Vzc2lvbnMoKTtcclxuICAgICAgICBzZXNzaW9ucy5zaG91bGQuYmUuYW4uYXJyYXk7XHJcbiAgICAgICAgc2Vzc2lvbnMuc2hvdWxkLmhhdmUubGVuZ3RoKDIpO1xyXG4gICAgICAgIHNlc3Npb25zWzBdLmlkLnNob3VsZC5lcXVhbChzZXNzaW9uMVswXSk7XHJcbiAgICAgICAgc2Vzc2lvbnNbMF0uY2FwYWJpbGl0aWVzLnNob3VsZC5lcWwoc2Vzc2lvbjFbMV0pO1xyXG4gICAgICAgIHNlc3Npb25zWzFdLmlkLnNob3VsZC5lcXVhbChzZXNzaW9uMlswXSk7XHJcbiAgICAgICAgc2Vzc2lvbnNbMV0uY2FwYWJpbGl0aWVzLnNob3VsZC5lcWwoc2Vzc2lvbjJbMV0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2dldFN0YXR1cycsICgpID0+IHtcclxuICAgICAgbGV0IGFwcGl1bTtcclxuICAgICAgYmVmb3JlKCgpID0+IHtcclxuICAgICAgICBhcHBpdW0gPSBuZXcgQXBwaXVtRHJpdmVyKHt9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGxldCBzdGF0dXMgPSBhd2FpdCBhcHBpdW0uZ2V0U3RhdHVzKCk7XHJcbiAgICAgICAgc3RhdHVzLmJ1aWxkLnNob3VsZC5leGlzdDtcclxuICAgICAgICBzdGF0dXMuYnVpbGQudmVyc2lvbi5zaG91bGQuZXhpc3Q7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2Vzc2lvbkV4aXN0cycsICgpID0+IHtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2F0dGFjaFVuZXhwZWN0ZWRTaHV0ZG93bkhhbmRsZXInLCAoKSA9PiB7XHJcbiAgICAgIGxldCBhcHBpdW1cclxuICAgICAgICAsIG1vY2tGYWtlRHJpdmVyO1xyXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICBbYXBwaXVtLCBtb2NrRmFrZURyaXZlcl0gPSBnZXREcml2ZXJBbmRGYWtlRHJpdmVyKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IG1vY2tGYWtlRHJpdmVyLm9iamVjdC5kZWxldGVTZXNzaW9uKCk7XHJcbiAgICAgICAgbW9ja0Zha2VEcml2ZXIucmVzdG9yZSgpO1xyXG4gICAgICAgIGFwcGl1bS5hcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMgPSB7fTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpdCgnc2hvdWxkIHJlbW92ZSBzZXNzaW9uIGlmIGlubmVyIGRyaXZlciB1bmV4cGVjdGVkbHkgZXhpdHMgd2l0aCBhbiBlcnJvcicsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBsZXQgW3Nlc3Npb25JZCxdID0gYXdhaXQgYXBwaXVtLmNyZWF0ZVNlc3Npb24oXy5jbG9uZShCQVNFX0NBUFMpKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb21tYS1zcGFjaW5nXHJcbiAgICAgICAgXy5rZXlzKGFwcGl1bS5zZXNzaW9ucykuc2hvdWxkLmNvbnRhaW4oc2Vzc2lvbklkKTtcclxuICAgICAgICBhcHBpdW0uc2Vzc2lvbnNbc2Vzc2lvbklkXS51bmV4cGVjdGVkU2h1dGRvd25EZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKFwiT29wc1wiKSk7XHJcbiAgICAgICAgLy8gbGV0IGV2ZW50IGxvb3Agc3BpbiBzbyByZWplY3Rpb24gaXMgaGFuZGxlZFxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEpO1xyXG4gICAgICAgIF8ua2V5cyhhcHBpdW0uc2Vzc2lvbnMpLnNob3VsZC5ub3QuY29udGFpbihzZXNzaW9uSWQpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCByZW1vdmUgc2Vzc2lvbiBpZiBpbm5lciBkcml2ZXIgdW5leHBlY3RlZGx5IGV4aXRzIHdpdGggbm8gZXJyb3InLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IFtzZXNzaW9uSWQsXSA9IGF3YWl0IGFwcGl1bS5jcmVhdGVTZXNzaW9uKF8uY2xvbmUoQkFTRV9DQVBTKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tbWEtc3BhY2luZ1xyXG4gICAgICAgIF8ua2V5cyhhcHBpdW0uc2Vzc2lvbnMpLnNob3VsZC5jb250YWluKHNlc3Npb25JZCk7XHJcbiAgICAgICAgYXBwaXVtLnNlc3Npb25zW3Nlc3Npb25JZF0udW5leHBlY3RlZFNodXRkb3duRGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgIC8vIGxldCBldmVudCBsb29wIHNwaW4gc28gcmVqZWN0aW9uIGlzIGhhbmRsZWRcclxuICAgICAgICBhd2FpdCBzbGVlcCgxKTtcclxuICAgICAgICBfLmtleXMoYXBwaXVtLnNlc3Npb25zKS5zaG91bGQubm90LmNvbnRhaW4oc2Vzc2lvbklkKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbW92ZSBzZXNzaW9uIGlmIGlubmVyIGRyaXZlciBjYW5jZWxzIHVuZXhwZWN0ZWQgZXhpdCcsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBsZXQgW3Nlc3Npb25JZCxdID0gYXdhaXQgYXBwaXVtLmNyZWF0ZVNlc3Npb24oXy5jbG9uZShCQVNFX0NBUFMpKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb21tYS1zcGFjaW5nXHJcbiAgICAgICAgXy5rZXlzKGFwcGl1bS5zZXNzaW9ucykuc2hvdWxkLmNvbnRhaW4oc2Vzc2lvbklkKTtcclxuICAgICAgICBhcHBpdW0uc2Vzc2lvbnNbc2Vzc2lvbklkXS5vblVuZXhwZWN0ZWRTaHV0ZG93bi5jYW5jZWwoKTtcclxuICAgICAgICAvLyBsZXQgZXZlbnQgbG9vcCBzcGluIHNvIHJlamVjdGlvbiBpcyBoYW5kbGVkXHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMSk7XHJcbiAgICAgICAgXy5rZXlzKGFwcGl1bS5zZXNzaW9ucykuc2hvdWxkLmNvbnRhaW4oc2Vzc2lvbklkKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdnZXREcml2ZXJGb3JDYXBzJywgKCkgPT4ge1xyXG4gICAgICBpdCgnc2hvdWxkIG5vdCBibG93IHVwIGlmIHVzZXIgZG9lcyBub3QgcHJvdmlkZSBwbGF0Zm9ybU5hbWUnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGFwcGl1bSA9IG5ldyBBcHBpdW1Ecml2ZXIoe30pO1xyXG4gICAgICAgICgoKSA9PiB7IGFwcGl1bS5nZXREcml2ZXJGb3JDYXBzKHt9KTsgfSkuc2hvdWxkLnRocm93KC9wbGF0Zm9ybU5hbWUvKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgZ2V0IFhDVUlUZXN0RHJpdmVyIGRyaXZlciBmb3IgYXV0b21hdGlvbk5hbWUgb2YgWENVSVRlc3QnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGFwcGl1bSA9IG5ldyBBcHBpdW1Ecml2ZXIoe30pO1xyXG4gICAgICAgIGxldCBkcml2ZXIgPSBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2Fwcyh7XHJcbiAgICAgICAgICBwbGF0Zm9ybU5hbWU6ICdpT1MnLFxyXG4gICAgICAgICAgYXV0b21hdGlvbk5hbWU6ICdYQ1VJVGVzdCdcclxuICAgICAgICB9KTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlb2YoRnVuY3Rpb24pO1xyXG4gICAgICAgIGRyaXZlci5zaG91bGQuZXF1YWwoWENVSVRlc3REcml2ZXIpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBnZXQgaW9zZHJpdmVyIGZvciBpb3MgPCAxMCcsICgpID0+IHtcclxuICAgICAgICBsZXQgYXBwaXVtID0gbmV3IEFwcGl1bURyaXZlcih7fSk7XHJcbiAgICAgICAgbGV0IGNhcHMgPSB7XHJcbiAgICAgICAgICBwbGF0Zm9ybU5hbWU6ICdpT1MnLFxyXG4gICAgICAgICAgcGxhdGZvcm1WZXJzaW9uOiAnOC4wJyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBkcml2ZXIgPSBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2FwcyhjYXBzKTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlb2YoRnVuY3Rpb24pO1xyXG4gICAgICAgIGRyaXZlci5zaG91bGQuZXF1YWwoSW9zRHJpdmVyKTtcclxuXHJcbiAgICAgICAgY2Fwcy5wbGF0Zm9ybVZlcnNpb24gPSAnOC4xJztcclxuICAgICAgICBkcml2ZXIgPSBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2FwcyhjYXBzKTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmVxdWFsKElvc0RyaXZlcik7XHJcblxyXG4gICAgICAgIGNhcHMucGxhdGZvcm1WZXJzaW9uID0gJzkuNCc7XHJcbiAgICAgICAgZHJpdmVyID0gYXBwaXVtLmdldERyaXZlckZvckNhcHMoY2Fwcyk7XHJcbiAgICAgICAgZHJpdmVyLnNob3VsZC5lcXVhbChJb3NEcml2ZXIpO1xyXG5cclxuICAgICAgICBjYXBzLnBsYXRmb3JtVmVyc2lvbiA9ICcnO1xyXG4gICAgICAgIGRyaXZlciA9IGFwcGl1bS5nZXREcml2ZXJGb3JDYXBzKGNhcHMpO1xyXG4gICAgICAgIGRyaXZlci5zaG91bGQuZXF1YWwoSW9zRHJpdmVyKTtcclxuXHJcbiAgICAgICAgY2Fwcy5wbGF0Zm9ybVZlcnNpb24gPSAnZm9vJztcclxuICAgICAgICBkcml2ZXIgPSBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2FwcyhjYXBzKTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmVxdWFsKElvc0RyaXZlcik7XHJcblxyXG4gICAgICAgIGRlbGV0ZSBjYXBzLnBsYXRmb3JtVmVyc2lvbjtcclxuICAgICAgICBkcml2ZXIgPSBhcHBpdW0uZ2V0RHJpdmVyRm9yQ2FwcyhjYXBzKTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmVxdWFsKElvc0RyaXZlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIGdldCB4Y3VpdGVzdGRyaXZlciBmb3IgaW9zID49IDEwJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBhcHBpdW0gPSBuZXcgQXBwaXVtRHJpdmVyKHt9KTtcclxuICAgICAgICBsZXQgY2FwcyA9IHtcclxuICAgICAgICAgIHBsYXRmb3JtTmFtZTogJ2lPUycsXHJcbiAgICAgICAgICBwbGF0Zm9ybVZlcnNpb246ICcxMCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZHJpdmVyID0gYXBwaXVtLmdldERyaXZlckZvckNhcHMoY2Fwcyk7XHJcbiAgICAgICAgZHJpdmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZW9mKEZ1bmN0aW9uKTtcclxuICAgICAgICBkcml2ZXIuc2hvdWxkLmVxdWFsKFhDVUlUZXN0RHJpdmVyKTtcclxuXHJcbiAgICAgICAgY2Fwcy5wbGF0Zm9ybVZlcnNpb24gPSAnMTAuMCc7XHJcbiAgICAgICAgZHJpdmVyID0gYXBwaXVtLmdldERyaXZlckZvckNhcHMoY2Fwcyk7XHJcbiAgICAgICAgZHJpdmVyLnNob3VsZC5lcXVhbChYQ1VJVGVzdERyaXZlcik7XHJcblxyXG4gICAgICAgIGNhcHMucGxhdGZvcm1WZXJzaW9uID0gJzEwLjEnO1xyXG4gICAgICAgIGRyaXZlciA9IGFwcGl1bS5nZXREcml2ZXJGb3JDYXBzKGNhcHMpO1xyXG4gICAgICAgIGRyaXZlci5zaG91bGQuZXF1YWwoWENVSVRlc3REcml2ZXIpO1xyXG5cclxuICAgICAgICBjYXBzLnBsYXRmb3JtVmVyc2lvbiA9ICcxMi4xNCc7XHJcbiAgICAgICAgZHJpdmVyID0gYXBwaXVtLmdldERyaXZlckZvckNhcHMoY2Fwcyk7XHJcbiAgICAgICAgZHJpdmVyLnNob3VsZC5lcXVhbChYQ1VJVGVzdERyaXZlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
