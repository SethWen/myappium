require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _libMain = require('../lib/main');

var _helpers = require('./helpers');

_chai2['default'].use(_chaiAsPromised2['default']);

var should = _chai2['default'].should();
var shouldStartServer = process.env.USE_RUNNING_SERVER !== "0";
var caps = { platformName: "Fake", deviceName: "Fake", app: _helpers.TEST_FAKE_APP };

describe('FakeDriver - via HTTP', function () {
  var server = null;
  before(function callee$1$0() {
    var args;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!shouldStartServer) {
            context$2$0.next = 5;
            break;
          }

          args = { port: _helpers.TEST_PORT, host: _helpers.TEST_HOST };
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 4:
          server = context$2$0.sent;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!server) {
            context$2$0.next = 3;
            break;
          }

          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(server.close());

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  describe('session handling', function () {
    it('should start and stop a session', function callee$2$0() {
      var driver, _ref, _ref2, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.init(caps));

          case 3:
            _ref = context$3$0.sent;
            _ref2 = _slicedToArray(_ref, 1);
            sessionId = _ref2[0];

            should.exist(sessionId);
            sessionId.should.be.a('string');
            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(driver.quit());

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.title().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should be able to run two FakeDriver sessions simultaneously', function callee$2$0() {
      var driver1, _ref3, _ref32, sessionId1, driver2, _ref4, _ref42, sessionId2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver1.init(caps));

          case 3:
            _ref3 = context$3$0.sent;
            _ref32 = _slicedToArray(_ref3, 1);
            sessionId1 = _ref32[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 11;
            return _regeneratorRuntime.awrap(driver2.init(caps));

          case 11:
            _ref4 = context$3$0.sent;
            _ref42 = _slicedToArray(_ref4, 1);
            sessionId2 = _ref42[0];

            should.exist(sessionId2);
            sessionId2.should.be.a('string');
            sessionId1.should.not.equal(sessionId2);
            context$3$0.next = 19;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 19:
            context$3$0.next = 21;
            return _regeneratorRuntime.awrap(driver2.quit());

          case 21:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should not be able to run two FakeDriver sessions simultaneously when one is unique', function callee$2$0() {
      var uniqueCaps, driver1, _ref5, _ref52, sessionId1, driver2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            uniqueCaps = _lodash2['default'].clone(caps);

            uniqueCaps.uniqueApp = true;
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(driver1.init(uniqueCaps));

          case 5:
            _ref5 = context$3$0.sent;
            _ref52 = _slicedToArray(_ref5, 1);
            sessionId1 = _ref52[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 13;
            return _regeneratorRuntime.awrap(driver2.init(caps).should.eventually.be.rejected);

          case 13:
            context$3$0.next = 15;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should use the newCommandTimeout of the inner Driver on session creation', function callee$2$0() {
      var driver, _ref6, _ref62, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);

            caps.newCommandTimeout = 0.25;

            context$3$0.next = 4;
            return _regeneratorRuntime.awrap(driver.init(caps));

          case 4:
            _ref6 = context$3$0.sent;
            _ref62 = _slicedToArray(_ref6, 1);
            sessionId = _ref62[0];

            should.exist(sessionId);

            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(_bluebird2['default'].delay(250));

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.source().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should accept W3C capabilities', function callee$2$0() {
      var w3cCaps, _ref7, status, value, sessionId, _ref8, screenshotStatus, screenshotValue, badW3Ccaps;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            w3cCaps = {
              capabilities: {
                alwaysMatch: { platformName: 'Fake' },
                firstMatch: [{ 'appium:deviceName': 'Fake', 'appium:app': _helpers.TEST_FAKE_APP }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session', json: w3cCaps }));

          case 3:
            _ref7 = context$3$0.sent;
            status = _ref7.status;
            value = _ref7.value;
            sessionId = _ref7.sessionId;

            status.should.equal(0);
            sessionId.should.be.a.string;
            value.should.exist;

            // Now use that sessionId to call /screenshot
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap((0, _requestPromise2['default'])({ url: 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session/' + sessionId + '/screenshot', json: true }));

          case 12:
            _ref8 = context$3$0.sent;
            screenshotStatus = _ref8.status;
            screenshotValue = _ref8.value;

            screenshotValue.should.equal('hahahanotreallyascreenshot');
            screenshotStatus.should.equal(0);
            // Now use that sessionID to call an arbitrary W3C-only endpoint that isn't implemented to see if it throws correct error
            context$3$0.next = 19;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session/' + sessionId + '/execute/async', json: { script: '', args: ['a'] } }).should.eventually.be.rejectedWith(/501/));

          case 19:
            badW3Ccaps = {
              capabilities: {
                alwaysMatch: {},
                firstMatch: [{ 'appium:deviceName': 'Fake', 'appium:app': _helpers.TEST_FAKE_APP }]
              }
            };
            context$3$0.prev = 20;
            context$3$0.next = 23;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session', json: badW3Ccaps }));

          case 23:
            context$3$0.next = 28;
            break;

          case 25:
            context$3$0.prev = 25;
            context$3$0.t0 = context$3$0['catch'](20);

            context$3$0.t0.statusCode.should.equal(500);

          case 28:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[20, 25]]);
    });

    it('should accept a combo of W3C and JSONWP capabilities', function callee$2$0() {
      var combinedCaps, _ref9, status, value, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              "desiredCapabilities": caps,
              "capabilities": {
                "alwaysMatch": {},
                "firstMatch": [{
                  "platformName": "Fake"
                }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session', json: combinedCaps }));

          case 3:
            _ref9 = context$3$0.sent;
            status = _ref9.status;
            value = _ref9.value;
            sessionId = _ref9.sessionId;

            status.should.equal(0);
            value.platformName.should.equal('Fake');
            sessionId.should.exist;

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });
});

describe('Logsink', function () {
  var server = null;
  var logs = [];
  var logHandler = function logHandler(level, message) {
    logs.push([level, message]);
  };
  var args = { port: _helpers.TEST_PORT, host: _helpers.TEST_HOST, logHandler: logHandler };

  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 2:
          server = context$2$0.sent;

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(server.close());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('should send logs to a logHandler passed in by a parent package', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          logs.length.should.be.above(1);
          logs[0].length.should.equal(2);
          logs[0][1].should.include("Welcome to Appium");

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});

// Try with valid capabilities and check that it returns a session ID

// Now try with invalid capabilities and check that it returns 500 status
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZHJpdmVyLWUyZS1zcGVjcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7Ozt3QkFDUixVQUFVOzs7O29CQUNQLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O2tCQUM5QixJQUFJOzs7OzhCQUNDLGlCQUFpQjs7Ozt1QkFDQSxhQUFhOzt1QkFDRSxXQUFXOztBQUUvRCxrQkFBSyxHQUFHLDZCQUFnQixDQUFDOztBQUV6QixJQUFNLE1BQU0sR0FBRyxrQkFBSyxNQUFNLEVBQUUsQ0FBQztBQUM3QixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssR0FBRyxDQUFDO0FBQ2pFLElBQU0sSUFBSSxHQUFHLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsd0JBQWUsRUFBQyxDQUFDOztBQUU1RSxRQUFRLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUN0QyxNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTSxDQUFDO1FBRUMsSUFBSTs7OztlQUROLGlCQUFpQjs7Ozs7QUFDZixjQUFJLEdBQUcsRUFBQyxJQUFJLG9CQUFXLEVBQUUsSUFBSSxvQkFBVyxFQUFDOzsyQ0FDOUIsbUJBQWEsSUFBSSxDQUFDOzs7QUFBakMsZ0JBQU07Ozs7Ozs7R0FFVCxDQUFDLENBQUM7QUFDSCxPQUFLLENBQUM7Ozs7ZUFDQSxNQUFNOzs7Ozs7MkNBQ0YsTUFBTSxDQUFDLEtBQUssRUFBRTs7Ozs7OztHQUV2QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakMsTUFBRSxDQUFDLGlDQUFpQyxFQUFFO1VBQ2hDLE1BQU0sZUFDTCxTQUFTOzs7OztBQURWLGtCQUFNLEdBQUcsZ0JBQUcsa0JBQWtCLHdDQUFzQjs7NkNBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7OztBQUFwQyxxQkFB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RyxJQUFJLENBQUM7QUFDbEIsTUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsTUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksS0FBSyxFQUFFLE9BQU8sRUFBSztBQUNuQyxRQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDN0IsQ0FBQztBQUNGLE1BQUksSUFBSSxHQUFHLEVBQUMsSUFBSSxvQkFBVyxFQUFFLElBQUksb0JBQVcsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUM7O0FBRTFELFFBQU0sQ0FBQzs7Ozs7MkNBQ1UsbUJBQWEsSUFBSSxDQUFDOzs7QUFBakMsZ0JBQU07Ozs7Ozs7R0FDUCxDQUFDLENBQUM7O0FBRUgsT0FBSyxDQUFDOzs7OzsyQ0FDRSxNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0dBQ3JCLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0VBQWdFLEVBQUU7Ozs7QUFDbkUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixjQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7OztHQUNoRCxDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9kcml2ZXItZTJlLXNwZWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHJhbnNwaWxlOm1vY2hhXHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xyXG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XHJcbmltcG9ydCB3ZCBmcm9tICd3ZCc7XHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XHJcbmltcG9ydCB7IG1haW4gYXMgYXBwaXVtU2VydmVyIH0gZnJvbSAnLi4vbGliL21haW4nO1xyXG5pbXBvcnQgeyBURVNUX0ZBS0VfQVBQLCBURVNUX0hPU1QsIFRFU1RfUE9SVCB9IGZyb20gJy4vaGVscGVycyc7XHJcblxyXG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XHJcblxyXG5jb25zdCBzaG91bGQgPSBjaGFpLnNob3VsZCgpO1xyXG5jb25zdCBzaG91bGRTdGFydFNlcnZlciA9IHByb2Nlc3MuZW52LlVTRV9SVU5OSU5HX1NFUlZFUiAhPT0gXCIwXCI7XHJcbmNvbnN0IGNhcHMgPSB7cGxhdGZvcm1OYW1lOiBcIkZha2VcIiwgZGV2aWNlTmFtZTogXCJGYWtlXCIsIGFwcDogVEVTVF9GQUtFX0FQUH07XHJcblxyXG5kZXNjcmliZSgnRmFrZURyaXZlciAtIHZpYSBIVFRQJywgKCkgPT4ge1xyXG4gIGxldCBzZXJ2ZXIgPSBudWxsO1xyXG4gIGJlZm9yZShhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAoc2hvdWxkU3RhcnRTZXJ2ZXIpIHtcclxuICAgICAgbGV0IGFyZ3MgPSB7cG9ydDogVEVTVF9QT1JULCBob3N0OiBURVNUX0hPU1R9O1xyXG4gICAgICBzZXJ2ZXIgPSBhd2FpdCBhcHBpdW1TZXJ2ZXIoYXJncyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgYWZ0ZXIoYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKHNlcnZlcikge1xyXG4gICAgICBhd2FpdCBzZXJ2ZXIuY2xvc2UoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ3Nlc3Npb24gaGFuZGxpbmcnLCAoKSA9PiB7XHJcbiAgICBpdCgnc2hvdWxkIHN0YXJ0IGFuZCBzdG9wIGEgc2Vzc2lvbicsIGFzeW5jICgpID0+IHtcclxuICAgICAgbGV0IGRyaXZlciA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XHJcbiAgICAgIGxldCBbc2Vzc2lvbklkXSA9IGF3YWl0IGRyaXZlci5pbml0KGNhcHMpO1xyXG4gICAgICBzaG91bGQuZXhpc3Qoc2Vzc2lvbklkKTtcclxuICAgICAgc2Vzc2lvbklkLnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcclxuICAgICAgYXdhaXQgZHJpdmVyLnF1aXQoKTtcclxuICAgICAgYXdhaXQgZHJpdmVyLnRpdGxlKCkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC90ZXJtaW5hdGVkLyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gcnVuIHR3byBGYWtlRHJpdmVyIHNlc3Npb25zIHNpbXVsdGFuZW91c2x5JywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBsZXQgZHJpdmVyMSA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XHJcbiAgICAgIGxldCBbc2Vzc2lvbklkMV0gPSBhd2FpdCBkcml2ZXIxLmluaXQoY2Fwcyk7XHJcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQxKTtcclxuICAgICAgc2Vzc2lvbklkMS5zaG91bGQuYmUuYSgnc3RyaW5nJyk7XHJcbiAgICAgIGxldCBkcml2ZXIyID0gd2QucHJvbWlzZUNoYWluUmVtb3RlKFRFU1RfSE9TVCwgVEVTVF9QT1JUKTtcclxuICAgICAgbGV0IFtzZXNzaW9uSWQyXSA9IGF3YWl0IGRyaXZlcjIuaW5pdChjYXBzKTtcclxuICAgICAgc2hvdWxkLmV4aXN0KHNlc3Npb25JZDIpO1xyXG4gICAgICBzZXNzaW9uSWQyLnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcclxuICAgICAgc2Vzc2lvbklkMS5zaG91bGQubm90LmVxdWFsKHNlc3Npb25JZDIpO1xyXG4gICAgICBhd2FpdCBkcml2ZXIxLnF1aXQoKTtcclxuICAgICAgYXdhaXQgZHJpdmVyMi5xdWl0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIG5vdCBiZSBhYmxlIHRvIHJ1biB0d28gRmFrZURyaXZlciBzZXNzaW9ucyBzaW11bHRhbmVvdXNseSB3aGVuIG9uZSBpcyB1bmlxdWUnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGxldCB1bmlxdWVDYXBzID0gXy5jbG9uZShjYXBzKTtcclxuICAgICAgdW5pcXVlQ2Fwcy51bmlxdWVBcHAgPSB0cnVlO1xyXG4gICAgICBsZXQgZHJpdmVyMSA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XHJcbiAgICAgIGxldCBbc2Vzc2lvbklkMV0gPSBhd2FpdCBkcml2ZXIxLmluaXQodW5pcXVlQ2Fwcyk7XHJcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQxKTtcclxuICAgICAgc2Vzc2lvbklkMS5zaG91bGQuYmUuYSgnc3RyaW5nJyk7XHJcbiAgICAgIGxldCBkcml2ZXIyID0gd2QucHJvbWlzZUNoYWluUmVtb3RlKFRFU1RfSE9TVCwgVEVTVF9QT1JUKTtcclxuICAgICAgYXdhaXQgZHJpdmVyMi5pbml0KGNhcHMpLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkO1xyXG4gICAgICBhd2FpdCBkcml2ZXIxLnF1aXQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG91bGQgdXNlIHRoZSBuZXdDb21tYW5kVGltZW91dCBvZiB0aGUgaW5uZXIgRHJpdmVyIG9uIHNlc3Npb24gY3JlYXRpb24nLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGxldCBkcml2ZXIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xyXG5cclxuICAgICAgY2Fwcy5uZXdDb21tYW5kVGltZW91dCA9IDAuMjU7XHJcblxyXG4gICAgICBsZXQgW3Nlc3Npb25JZF0gPSBhd2FpdCBkcml2ZXIuaW5pdChjYXBzKTtcclxuICAgICAgc2hvdWxkLmV4aXN0KHNlc3Npb25JZCk7XHJcblxyXG4gICAgICBhd2FpdCBCLmRlbGF5KDI1MCk7XHJcbiAgICAgIGF3YWl0IGRyaXZlci5zb3VyY2UoKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL3Rlcm1pbmF0ZWQvKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG91bGQgYWNjZXB0IFczQyBjYXBhYmlsaXRpZXMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIC8vIFRyeSB3aXRoIHZhbGlkIGNhcGFiaWxpdGllcyBhbmQgY2hlY2sgdGhhdCBpdCByZXR1cm5zIGEgc2Vzc2lvbiBJRFxyXG4gICAgICBjb25zdCB3M2NDYXBzID0ge1xyXG4gICAgICAgIGNhcGFiaWxpdGllczoge1xyXG4gICAgICAgICAgYWx3YXlzTWF0Y2g6IHtwbGF0Zm9ybU5hbWU6ICdGYWtlJ30sXHJcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbeydhcHBpdW06ZGV2aWNlTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTphcHAnOiBURVNUX0ZBS0VfQVBQfV0sXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgeyBzdGF0dXMsIHZhbHVlLCBzZXNzaW9uSWQgfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBgaHR0cDovLyR7VEVTVF9IT1NUfToke1RFU1RfUE9SVH0vd2QvaHViL3Nlc3Npb25gLCBqc29uOiB3M2NDYXBzfSk7XHJcbiAgICAgIHN0YXR1cy5zaG91bGQuZXF1YWwoMCk7XHJcbiAgICAgIHNlc3Npb25JZC5zaG91bGQuYmUuYS5zdHJpbmc7XHJcbiAgICAgIHZhbHVlLnNob3VsZC5leGlzdDtcclxuXHJcbiAgICAgIC8vIE5vdyB1c2UgdGhhdCBzZXNzaW9uSWQgdG8gY2FsbCAvc2NyZWVuc2hvdFxyXG4gICAgICBjb25zdCB7IHN0YXR1czpzY3JlZW5zaG90U3RhdHVzLCB2YWx1ZTpzY3JlZW5zaG90VmFsdWUgfSA9IGF3YWl0IHJlcXVlc3Qoe3VybDogYGh0dHA6Ly8ke1RFU1RfSE9TVH06JHtURVNUX1BPUlR9L3dkL2h1Yi9zZXNzaW9uLyR7c2Vzc2lvbklkfS9zY3JlZW5zaG90YCwganNvbjogdHJ1ZX0pO1xyXG4gICAgICBzY3JlZW5zaG90VmFsdWUuc2hvdWxkLmVxdWFsKCdoYWhhaGFub3RyZWFsbHlhc2NyZWVuc2hvdCcpO1xyXG4gICAgICBzY3JlZW5zaG90U3RhdHVzLnNob3VsZC5lcXVhbCgwKTtcclxuICAgICAgLy8gTm93IHVzZSB0aGF0IHNlc3Npb25JRCB0byBjYWxsIGFuIGFyYml0cmFyeSBXM0Mtb25seSBlbmRwb2ludCB0aGF0IGlzbid0IGltcGxlbWVudGVkIHRvIHNlZSBpZiBpdCB0aHJvd3MgY29ycmVjdCBlcnJvclxyXG4gICAgICBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYGh0dHA6Ly8ke1RFU1RfSE9TVH06JHtURVNUX1BPUlR9L3dkL2h1Yi9zZXNzaW9uLyR7c2Vzc2lvbklkfS9leGVjdXRlL2FzeW5jYCwganNvbjoge3NjcmlwdDogJycsIGFyZ3M6IFsnYSddfX0pLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvNTAxLyk7XHJcblxyXG4gICAgICAvLyBOb3cgdHJ5IHdpdGggaW52YWxpZCBjYXBhYmlsaXRpZXMgYW5kIGNoZWNrIHRoYXQgaXQgcmV0dXJucyA1MDAgc3RhdHVzXHJcbiAgICAgIGNvbnN0IGJhZFczQ2NhcHMgPSB7XHJcbiAgICAgICAgY2FwYWJpbGl0aWVzOiB7XHJcbiAgICAgICAgICBhbHdheXNNYXRjaDoge30sXHJcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbeydhcHBpdW06ZGV2aWNlTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTphcHAnOiBURVNUX0ZBS0VfQVBQfV0sXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYGh0dHA6Ly8ke1RFU1RfSE9TVH06JHtURVNUX1BPUlR9L3dkL2h1Yi9zZXNzaW9uYCwganNvbjogYmFkVzNDY2Fwc30pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgZS5zdGF0dXNDb2RlLnNob3VsZC5lcXVhbCg1MDApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIGFjY2VwdCBhIGNvbWJvIG9mIFczQyBhbmQgSlNPTldQIGNhcGFiaWxpdGllcycsIGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgY29tYmluZWRDYXBzID0ge1xyXG4gICAgICAgIFwiZGVzaXJlZENhcGFiaWxpdGllc1wiOiBjYXBzLFxyXG4gICAgICAgIFwiY2FwYWJpbGl0aWVzXCI6IHtcclxuICAgICAgICAgIFwiYWx3YXlzTWF0Y2hcIjoge30sXHJcbiAgICAgICAgICBcImZpcnN0TWF0Y2hcIjogW3tcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybU5hbWVcIjogXCJGYWtlXCIsXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHsgc3RhdHVzLCB2YWx1ZSwgc2Vzc2lvbklkIH0gPSBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYGh0dHA6Ly8ke1RFU1RfSE9TVH06JHtURVNUX1BPUlR9L3dkL2h1Yi9zZXNzaW9uYCwganNvbjogY29tYmluZWRDYXBzfSk7XHJcbiAgICAgIHN0YXR1cy5zaG91bGQuZXF1YWwoMCk7XHJcbiAgICAgIHZhbHVlLnBsYXRmb3JtTmFtZS5zaG91bGQuZXF1YWwoJ0Zha2UnKTtcclxuICAgICAgc2Vzc2lvbklkLnNob3VsZC5leGlzdDtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmRlc2NyaWJlKCdMb2dzaW5rJywgKCkgPT4ge1xyXG4gIGxldCBzZXJ2ZXIgPSBudWxsO1xyXG4gIGxldCBsb2dzID0gW107XHJcbiAgbGV0IGxvZ0hhbmRsZXIgPSAobGV2ZWwsIG1lc3NhZ2UpID0+IHtcclxuICAgIGxvZ3MucHVzaChbbGV2ZWwsIG1lc3NhZ2VdKTtcclxuICB9O1xyXG4gIGxldCBhcmdzID0ge3BvcnQ6IFRFU1RfUE9SVCwgaG9zdDogVEVTVF9IT1NULCBsb2dIYW5kbGVyfTtcclxuXHJcbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcclxuICAgIHNlcnZlciA9IGF3YWl0IGFwcGl1bVNlcnZlcihhcmdzKTtcclxuICB9KTtcclxuXHJcbiAgYWZ0ZXIoYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdzaG91bGQgc2VuZCBsb2dzIHRvIGEgbG9nSGFuZGxlciBwYXNzZWQgaW4gYnkgYSBwYXJlbnQgcGFja2FnZScsIGFzeW5jICgpID0+IHtcclxuICAgIGxvZ3MubGVuZ3RoLnNob3VsZC5iZS5hYm92ZSgxKTtcclxuICAgIGxvZ3NbMF0ubGVuZ3RoLnNob3VsZC5lcXVhbCgyKTtcclxuICAgIGxvZ3NbMF1bMV0uc2hvdWxkLmluY2x1ZGUoXCJXZWxjb21lIHRvIEFwcGl1bVwiKTtcclxuICB9KTtcclxuXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
