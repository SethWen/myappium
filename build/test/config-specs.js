require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _libConfig = require('../lib/config');

var _libParser = require('../lib/parser');

var _libParser2 = _interopRequireDefault(_libParser);

var _libLogger = require('../lib/logger');

var _libLogger2 = _interopRequireDefault(_libLogger);

var should = _chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('Config', function () {
  describe('getGitRev', function () {
    it('should get a reasonable git revision', function callee$2$0() {
      var rev;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap((0, _libConfig.getGitRev)());

          case 2:
            rev = context$3$0.sent;

            rev.should.be.a('string');
            rev.length.should.be.equal(40);
            rev.match(/[0-9a-f]+/i)[0].should.eql(rev);

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('Appium config', function () {
    describe('getAppiumConfig', function () {
      it('should get a configuration object', function callee$3$0() {
        var config;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getAppiumConfig)());

            case 2:
              config = context$4$0.sent;

              config.should.be.an('object');
              should.exist(config['git-sha']);
              should.exist(config.built);
              should.exist(config.version);

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
    describe('showConfig', function () {
      before(function () {
        _sinon2['default'].spy(console, "log");
      });
      it('should log the config to console', function callee$3$0() {
        var config;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getAppiumConfig)());

            case 2:
              config = context$4$0.sent;
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap((0, _libConfig.showConfig)());

            case 5:
              console.log.calledOnce.should.be['true']; // eslint-disable-line no-console
              console.log.getCall(0).args[0].should.contain(JSON.stringify(config)); // eslint-disable-line no-console

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, _this);
      });
    });
  });

  describe('node.js config', function () {
    var _process = process;
    before(function () {
      // need to be able to write to process.version
      // but also to have access to process methods
      // so copy them over to a writable object
      var tempProcess = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_lodash2['default'].toPairs(process)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var prop = _step$value[0];
          var value = _step$value[1];

          tempProcess[prop] = value;
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

      process = tempProcess;
    });
    after(function () {
      process = _process;
    });
    describe('checkNodeOk', function () {
      it('should fail if node is below 4', function () {
        process.version = 'v4.4.7';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.9.12';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.1';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.10.36';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.12.14';
        _libConfig.checkNodeOk.should['throw']();
      });
      it('should succeed if node is 5+', function () {
        process.version = 'v5.7.0';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 6+', function () {
        process.version = 'v6.3.1';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 7+', function () {
        process.version = 'v7.1.1';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 8+', function () {
        process.version = 'v8.1.2';
        _libConfig.checkNodeOk.should.not['throw']();
      });
    });

    describe('warnNodeDeprecations', function () {
      var spy = undefined;
      before(function () {
        spy = _sinon2['default'].spy(_libLogger2['default'], "warn");
      });
      beforeEach(function () {
        spy.reset();
      });
      it('should log a warning if node is below 4', function () {
        process.version = 'v0.9.12';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(1);
      });
      it('should log a warning if node is 0.12', function () {
        process.version = 'v0.12.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(1);
      });
      it('should not log a warning if node is 4+', function () {
        process.version = 'v4.4.7';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
      it('should not log a warning if node is 5+', function () {
        process.version = 'v5.7.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
      it('should not log a warning if node is 6+', function () {
        process.version = 'v6.3.1';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
    });
  });

  describe('server arguments', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var args = {};
    beforeEach(function () {
      // give all the defaults
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(parser.rawArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var rawArg = _step2.value;

          args[rawArg[1].dest] = rawArg[1].defaultValue;
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
    });
    describe('getNonDefaultArgs', function () {
      it('should show none if we have all the defaults', function () {
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(0);
      });
      it('should catch a non-default argument', function () {
        args.isolateSimDevice = true;
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(1);
        should.exist(nonDefaultArgs.isolateSimDevice);
      });
    });

    describe('getDeprecatedArgs', function () {
      it('should show none if we have no deprecated arguments', function () {
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(0);
      });
      it('should catch a deprecated argument', function () {
        args.showIOSLog = true;
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--show-ios-log']);
      });
      it('should catch a non-boolean deprecated argument', function () {
        args.calendarFormat = 'orwellian';
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--calendar-format']);
      });
    });
  });

  describe('checkValidPort', function () {
    it('should be false for port too high', function () {
      (0, _libConfig.checkValidPort)(65536).should.be['false'];
    });
    it('should be false for port too low', function () {
      (0, _libConfig.checkValidPort)(0).should.be['false'];
    });
    it('should be true for port 1', function () {
      (0, _libConfig.checkValidPort)(1).should.be['true'];
    });
    it('should be true for port 65535', function () {
      (0, _libConfig.checkValidPort)(65535).should.be['true'];
    });
  });

  describe('validateTmpDir', function () {
    it('should fail to use a tmp dir with incorrect permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/private/if_you_run_with_sudo_this_wont_fail').should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should fail to use an undefined tmp dir', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)().should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should be able to use a tmp dir with correct permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/tmp/test_tmp_dir/with/any/number/of/levels').should.not.be.rejected;

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });

  describe('parsing args with empty argv[1]', function () {
    var argv1 = undefined;

    before(function () {
      argv1 = process.argv[1];
    });

    after(function () {
      process.argv[1] = argv1;
    });

    it('should not fail if process.argv[1] is undefined', function () {
      process.argv[1] = undefined;
      var args = (0, _libParser2['default'])();
      args.prog.should.be.equal('Appium');
    });

    it('should set "prog" to process.argv[1]', function () {
      process.argv[1] = 'Hello World';
      var args = (0, _libParser2['default'])();
      args.prog.should.be.equal('Hello World');
    });
  });

  describe('validateServerArgs', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var defaultArgs = {};
    // give all the defaults
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _getIterator(parser.rawArgs), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var rawArg = _step3.value;

        defaultArgs[rawArg[1].dest] = rawArg[1].defaultValue;
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

    var args = {};
    beforeEach(function () {
      args = _lodash2['default'].clone(defaultArgs);
    });
    describe('mutually exclusive server arguments', function () {
      describe('noReset and fullReset', function () {
        it('should not allow both', function () {
          (function () {
            args.noReset = args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow noReset', function () {
          (function () {
            args.noReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow fullReset', function () {
          (function () {
            args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('ipa and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.ipa = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow ipa', function () {
          (function () {
            args.ipa = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow safari', function () {
          (function () {
            args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('app and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.app = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow app', function () {
          (function () {
            args.app = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('forceIphone and forceIpad', function () {
        it('should not allow both', function () {
          (function () {
            args.forceIphone = args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow forceIphone', function () {
          (function () {
            args.forceIphone = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow forceIpad', function () {
          (function () {
            args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('deviceName and defaultDevice', function () {
        it('should not allow both', function () {
          (function () {
            args.deviceName = args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow deviceName', function () {
          (function () {
            args.deviceName = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow defaultDevice', function () {
          (function () {
            args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
    describe('validated arguments', function () {
      // checking ports is already done.
      // the only argument left is `backendRetries`
      describe('backendRetries', function () {
        it('should fail with value less than 0', function () {
          args.backendRetries = -1;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should succeed with value of 0', function () {
          args.backendRetries = 0;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should succeed with value above 0', function () {
          args.backendRetries = 100;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFDNUMsY0FBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDMUIsV0FBQyxZQUFNO0FBQUMsK0NBQW1CLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztXQUFDLENBQUEsQ0FBRSxNQUFNLENBQUMsR0FBRyxTQUFNLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9jb25maWctc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGU6bW9jaGFcclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xyXG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xyXG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XHJcbmltcG9ydCB7IGdldEdpdFJldiwgZ2V0QXBwaXVtQ29uZmlnLCBjaGVja05vZGVPaywgd2Fybk5vZGVEZXByZWNhdGlvbnMsXHJcbiAgICAgICAgIGdldE5vbkRlZmF1bHRBcmdzLCBnZXREZXByZWNhdGVkQXJncywgdmFsaWRhdGVTZXJ2ZXJBcmdzLFxyXG4gICAgICAgICB2YWxpZGF0ZVRtcERpciwgc2hvd0NvbmZpZywgY2hlY2tWYWxpZFBvcnQgfSBmcm9tICcuLi9saWIvY29uZmlnJztcclxuaW1wb3J0IGdldFBhcnNlciBmcm9tICcuLi9saWIvcGFyc2VyJztcclxuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi9saWIvbG9nZ2VyJztcclxuXHJcblxyXG5sZXQgc2hvdWxkID0gY2hhaS5zaG91bGQoKTtcclxuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xyXG5cclxuXHJcbmRlc2NyaWJlKCdDb25maWcnLCAoKSA9PiB7XHJcbiAgZGVzY3JpYmUoJ2dldEdpdFJldicsICgpID0+IHtcclxuICAgIGl0KCdzaG91bGQgZ2V0IGEgcmVhc29uYWJsZSBnaXQgcmV2aXNpb24nLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGxldCByZXYgPSBhd2FpdCBnZXRHaXRSZXYoKTtcclxuICAgICAgcmV2LnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcclxuICAgICAgcmV2Lmxlbmd0aC5zaG91bGQuYmUuZXF1YWwoNDApO1xyXG4gICAgICByZXYubWF0Y2goL1swLTlhLWZdKy9pKVswXS5zaG91bGQuZXFsKHJldik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ0FwcGl1bSBjb25maWcnLCAoKSA9PiB7XHJcbiAgICBkZXNjcmliZSgnZ2V0QXBwaXVtQ29uZmlnJywgKCkgPT4ge1xyXG4gICAgICBpdCgnc2hvdWxkIGdldCBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjb25maWcgPSBhd2FpdCBnZXRBcHBpdW1Db25maWcoKTtcclxuICAgICAgICBjb25maWcuc2hvdWxkLmJlLmFuKCdvYmplY3QnKTtcclxuICAgICAgICBzaG91bGQuZXhpc3QoY29uZmlnWydnaXQtc2hhJ10pO1xyXG4gICAgICAgIHNob3VsZC5leGlzdChjb25maWcuYnVpbHQpO1xyXG4gICAgICAgIHNob3VsZC5leGlzdChjb25maWcudmVyc2lvbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2hvd0NvbmZpZycsICgpID0+IHtcclxuICAgICAgYmVmb3JlKCgpID0+IHtcclxuICAgICAgICBzaW5vbi5zcHkoY29uc29sZSwgXCJsb2dcIik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIGxvZyB0aGUgY29uZmlnIHRvIGNvbnNvbGUnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvbmZpZyA9IGF3YWl0IGdldEFwcGl1bUNvbmZpZygpO1xyXG4gICAgICAgIGF3YWl0IHNob3dDb25maWcoKTtcclxuICAgICAgICBjb25zb2xlLmxvZy5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgY29uc29sZS5sb2cuZ2V0Q2FsbCgwKS5hcmdzWzBdLnNob3VsZC5jb250YWluKEpTT04uc3RyaW5naWZ5KGNvbmZpZykpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ25vZGUuanMgY29uZmlnJywgKCkgPT4ge1xyXG4gICAgbGV0IF9wcm9jZXNzID0gcHJvY2VzcztcclxuICAgIGJlZm9yZSgoKSA9PiB7XHJcbiAgICAgIC8vIG5lZWQgdG8gYmUgYWJsZSB0byB3cml0ZSB0byBwcm9jZXNzLnZlcnNpb25cclxuICAgICAgLy8gYnV0IGFsc28gdG8gaGF2ZSBhY2Nlc3MgdG8gcHJvY2VzcyBtZXRob2RzXHJcbiAgICAgIC8vIHNvIGNvcHkgdGhlbSBvdmVyIHRvIGEgd3JpdGFibGUgb2JqZWN0XHJcbiAgICAgIGxldCB0ZW1wUHJvY2VzcyA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBbcHJvcCwgdmFsdWVdIG9mIF8udG9QYWlycyhwcm9jZXNzKSkge1xyXG4gICAgICAgIHRlbXBQcm9jZXNzW3Byb3BdID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcHJvY2VzcyA9IHRlbXBQcm9jZXNzO1xyXG4gICAgfSk7XHJcbiAgICBhZnRlcigoKSA9PiB7XHJcbiAgICAgIHByb2Nlc3MgPSBfcHJvY2VzcztcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2NoZWNrTm9kZU9rJywgKCkgPT4ge1xyXG4gICAgICBpdCgnc2hvdWxkIGZhaWwgaWYgbm9kZSBpcyBiZWxvdyA0JywgKCkgPT4ge1xyXG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2NC40LjcnO1xyXG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xyXG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2MC45LjEyJztcclxuICAgICAgICBjaGVja05vZGVPay5zaG91bGQudGhyb3coKTtcclxuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMSc7XHJcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLnRocm93KCk7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YwLjEwLjM2JztcclxuICAgICAgICBjaGVja05vZGVPay5zaG91bGQudGhyb3coKTtcclxuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMTIuMTQnO1xyXG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgNSsnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y1LjcuMCc7XHJcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgNisnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y2LjMuMSc7XHJcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgNysnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y3LjEuMSc7XHJcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgOCsnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y4LjEuMic7XHJcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3YXJuTm9kZURlcHJlY2F0aW9ucycsICgpID0+IHtcclxuICAgICAgbGV0IHNweTtcclxuICAgICAgYmVmb3JlKCgpID0+IHtcclxuICAgICAgICBzcHkgPSBzaW5vbi5zcHkobG9nZ2VyLCBcIndhcm5cIik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICBzcHkucmVzZXQoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIGJlbG93IDQnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YwLjkuMTInO1xyXG4gICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zKCk7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgxKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIDAuMTInLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YwLjEyLjAnO1xyXG4gICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zKCk7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgxKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGl0KCdzaG91bGQgbm90IGxvZyBhIHdhcm5pbmcgaWYgbm9kZSBpcyA0KycsICgpID0+IHtcclxuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjQuNC43JztcclxuICAgICAgICB3YXJuTm9kZURlcHJlY2F0aW9ucygpO1xyXG4gICAgICAgIGxvZ2dlci53YXJuLmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIG5vdCBsb2cgYSB3YXJuaW5nIGlmIG5vZGUgaXMgNSsnLCAoKSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y1LjcuMCc7XHJcbiAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcclxuICAgICAgICBsb2dnZXIud2Fybi5jYWxsQ291bnQuc2hvdWxkLmVxdWFsKDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBub3QgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIDYrJywgKCkgPT4ge1xyXG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2Ni4zLjEnO1xyXG4gICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zKCk7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ3NlcnZlciBhcmd1bWVudHMnLCAoKSA9PiB7XHJcbiAgICBsZXQgcGFyc2VyID0gZ2V0UGFyc2VyKCk7XHJcbiAgICBwYXJzZXIuZGVidWcgPSB0cnVlOyAvLyB0aHJvdyBpbnN0ZWFkIG9mIGV4aXQgb24gZXJyb3I7IHBhc3MgYXMgb3B0aW9uIGluc3RlYWQ/XHJcbiAgICBsZXQgYXJncyA9IHt9O1xyXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgIC8vIGdpdmUgYWxsIHRoZSBkZWZhdWx0c1xyXG4gICAgICBmb3IgKGxldCByYXdBcmcgb2YgcGFyc2VyLnJhd0FyZ3MpIHtcclxuICAgICAgICBhcmdzW3Jhd0FyZ1sxXS5kZXN0XSA9IHJhd0FyZ1sxXS5kZWZhdWx0VmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2dldE5vbkRlZmF1bHRBcmdzJywgKCkgPT4ge1xyXG4gICAgICBpdCgnc2hvdWxkIHNob3cgbm9uZSBpZiB3ZSBoYXZlIGFsbCB0aGUgZGVmYXVsdHMnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IG5vbkRlZmF1bHRBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICBfLmtleXMobm9uRGVmYXVsdEFyZ3MpLmxlbmd0aC5zaG91bGQuZXF1YWwoMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdCgnc2hvdWxkIGNhdGNoIGEgbm9uLWRlZmF1bHQgYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgYXJncy5pc29sYXRlU2ltRGV2aWNlID0gdHJ1ZTtcclxuICAgICAgICBsZXQgbm9uRGVmYXVsdEFyZ3MgPSBnZXROb25EZWZhdWx0QXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgIF8ua2V5cyhub25EZWZhdWx0QXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgxKTtcclxuICAgICAgICBzaG91bGQuZXhpc3Qobm9uRGVmYXVsdEFyZ3MuaXNvbGF0ZVNpbURldmljZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldERlcHJlY2F0ZWRBcmdzJywgKCkgPT4ge1xyXG4gICAgICBpdCgnc2hvdWxkIHNob3cgbm9uZSBpZiB3ZSBoYXZlIG5vIGRlcHJlY2F0ZWQgYXJndW1lbnRzJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XHJcbiAgICAgICAgXy5rZXlzKGRlcHJlY2F0ZWRBcmdzKS5sZW5ndGguc2hvdWxkLmVxdWFsKDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBjYXRjaCBhIGRlcHJlY2F0ZWQgYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgYXJncy5zaG93SU9TTG9nID0gdHJ1ZTtcclxuICAgICAgICBsZXQgZGVwcmVjYXRlZEFyZ3MgPSBnZXREZXByZWNhdGVkQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgIF8ua2V5cyhkZXByZWNhdGVkQXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgxKTtcclxuICAgICAgICBzaG91bGQuZXhpc3QoZGVwcmVjYXRlZEFyZ3NbJy0tc2hvdy1pb3MtbG9nJ10pO1xyXG4gICAgICB9KTtcclxuICAgICAgaXQoJ3Nob3VsZCBjYXRjaCBhIG5vbi1ib29sZWFuIGRlcHJlY2F0ZWQgYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgYXJncy5jYWxlbmRhckZvcm1hdCA9ICdvcndlbGxpYW4nO1xyXG4gICAgICAgIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XHJcbiAgICAgICAgXy5rZXlzKGRlcHJlY2F0ZWRBcmdzKS5sZW5ndGguc2hvdWxkLmVxdWFsKDEpO1xyXG4gICAgICAgIHNob3VsZC5leGlzdChkZXByZWNhdGVkQXJnc1snLS1jYWxlbmRhci1mb3JtYXQnXSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCdjaGVja1ZhbGlkUG9ydCcsICgpID0+IHtcclxuICAgIGl0KCdzaG91bGQgYmUgZmFsc2UgZm9yIHBvcnQgdG9vIGhpZ2gnLCAoKSA9PiB7XHJcbiAgICAgIGNoZWNrVmFsaWRQb3J0KDY1NTM2KS5zaG91bGQuYmUuZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZmFsc2UgZm9yIHBvcnQgdG9vIGxvdycsICgpID0+IHtcclxuICAgICAgY2hlY2tWYWxpZFBvcnQoMCkuc2hvdWxkLmJlLmZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIHRydWUgZm9yIHBvcnQgMScsICgpID0+IHtcclxuICAgICAgY2hlY2tWYWxpZFBvcnQoMSkuc2hvdWxkLmJlLnRydWU7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgdHJ1ZSBmb3IgcG9ydCA2NTUzNScsICgpID0+IHtcclxuICAgICAgY2hlY2tWYWxpZFBvcnQoNjU1MzUpLnNob3VsZC5iZS50cnVlO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCd2YWxpZGF0ZVRtcERpcicsICgpID0+IHtcclxuICAgIGl0KCdzaG91bGQgZmFpbCB0byB1c2UgYSB0bXAgZGlyIHdpdGggaW5jb3JyZWN0IHBlcm1pc3Npb25zJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICB2YWxpZGF0ZVRtcERpcignL3ByaXZhdGUvaWZfeW91X3J1bl93aXRoX3N1ZG9fdGhpc193b250X2ZhaWwnKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKC9jb3VsZCBub3QgZW5zdXJlLyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgZmFpbCB0byB1c2UgYW4gdW5kZWZpbmVkIHRtcCBkaXInLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHZhbGlkYXRlVG1wRGlyKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCgvY291bGQgbm90IGVuc3VyZS8pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gdXNlIGEgdG1wIGRpciB3aXRoIGNvcnJlY3QgcGVybWlzc2lvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHZhbGlkYXRlVG1wRGlyKCcvdG1wL3Rlc3RfdG1wX2Rpci93aXRoL2FueS9udW1iZXIvb2YvbGV2ZWxzJykuc2hvdWxkLm5vdC5iZS5yZWplY3RlZDtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgncGFyc2luZyBhcmdzIHdpdGggZW1wdHkgYXJndlsxXScsICgpID0+IHtcclxuICAgIGxldCBhcmd2MTtcclxuXHJcbiAgICBiZWZvcmUoKCkgPT4ge1xyXG4gICAgICBhcmd2MSA9IHByb2Nlc3MuYXJndlsxXTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFmdGVyKCgpID0+IHtcclxuICAgICAgcHJvY2Vzcy5hcmd2WzFdID0gYXJndjE7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIGlmIHByb2Nlc3MuYXJndlsxXSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgIHByb2Nlc3MuYXJndlsxXSA9IHVuZGVmaW5lZDtcclxuICAgICAgbGV0IGFyZ3MgPSBnZXRQYXJzZXIoKTtcclxuICAgICAgYXJncy5wcm9nLnNob3VsZC5iZS5lcXVhbCgnQXBwaXVtJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIHNldCBcInByb2dcIiB0byBwcm9jZXNzLmFyZ3ZbMV0nLCAoKSA9PiB7XHJcbiAgICAgIHByb2Nlc3MuYXJndlsxXSA9ICdIZWxsbyBXb3JsZCc7XHJcbiAgICAgIGxldCBhcmdzID0gZ2V0UGFyc2VyKCk7XHJcbiAgICAgIGFyZ3MucHJvZy5zaG91bGQuYmUuZXF1YWwoJ0hlbGxvIFdvcmxkJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ3ZhbGlkYXRlU2VydmVyQXJncycsICgpID0+IHtcclxuICAgIGxldCBwYXJzZXIgPSBnZXRQYXJzZXIoKTtcclxuICAgIHBhcnNlci5kZWJ1ZyA9IHRydWU7IC8vIHRocm93IGluc3RlYWQgb2YgZXhpdCBvbiBlcnJvcjsgcGFzcyBhcyBvcHRpb24gaW5zdGVhZD9cclxuICAgIGNvbnN0IGRlZmF1bHRBcmdzID0ge307XHJcbiAgICAvLyBnaXZlIGFsbCB0aGUgZGVmYXVsdHNcclxuICAgIGZvciAobGV0IHJhd0FyZyBvZiBwYXJzZXIucmF3QXJncykge1xyXG4gICAgICBkZWZhdWx0QXJnc1tyYXdBcmdbMV0uZGVzdF0gPSByYXdBcmdbMV0uZGVmYXVsdFZhbHVlO1xyXG4gICAgfVxyXG4gICAgbGV0IGFyZ3MgPSB7fTtcclxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICBhcmdzID0gXy5jbG9uZShkZWZhdWx0QXJncyk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdtdXR1YWxseSBleGNsdXNpdmUgc2VydmVyIGFyZ3VtZW50cycsICgpID0+IHtcclxuICAgICAgZGVzY3JpYmUoJ25vUmVzZXQgYW5kIGZ1bGxSZXNldCcsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5ub1Jlc2V0ID0gYXJncy5mdWxsUmVzZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbm9SZXNldCcsICgpID0+IHtcclxuICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFyZ3Mubm9SZXNldCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZnVsbFJlc2V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5mdWxsUmVzZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRlc2NyaWJlKCdpcGEgYW5kIHNhZmFyaScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5pcGEgPSBhcmdzLnNhZmFyaSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLnRocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBpcGEnLCAoKSA9PiB7XHJcbiAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcmdzLmlwYSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgc2FmYXJpJywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5zYWZhcmkgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRlc2NyaWJlKCdhcHAgYW5kIHNhZmFyaScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5hcHAgPSBhcmdzLnNhZmFyaSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLnRocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhcHAnLCAoKSA9PiB7XHJcbiAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcmdzLmFwcCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgZGVzY3JpYmUoJ2ZvcmNlSXBob25lIGFuZCBmb3JjZUlwYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYm90aCcsICgpID0+IHtcclxuICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yY2VJcGhvbmUgPSBhcmdzLmZvcmNlSXBhZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgICAgICAgfSkuc2hvdWxkLnRocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBmb3JjZUlwaG9uZScsICgpID0+IHtcclxuICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yY2VJcGhvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGZvcmNlSXBhZCcsICgpID0+IHtcclxuICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yY2VJcGFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XHJcbiAgICAgICAgICB9KS5zaG91bGQubm90LnRocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkZXNjcmliZSgnZGV2aWNlTmFtZSBhbmQgZGVmYXVsdERldmljZScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgKCkgPT4ge1xyXG4gICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgYXJncy5kZXZpY2VOYW1lID0gYXJncy5kZWZhdWx0RGV2aWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XHJcbiAgICAgICAgICB9KS5zaG91bGQudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRldmljZU5hbWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcmdzLmRldmljZU5hbWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlZmF1bHREZXZpY2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcmdzLmRlZmF1bHREZXZpY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcclxuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCd2YWxpZGF0ZWQgYXJndW1lbnRzJywgKCkgPT4ge1xyXG4gICAgICAvLyBjaGVja2luZyBwb3J0cyBpcyBhbHJlYWR5IGRvbmUuXHJcbiAgICAgIC8vIHRoZSBvbmx5IGFyZ3VtZW50IGxlZnQgaXMgYGJhY2tlbmRSZXRyaWVzYFxyXG4gICAgICBkZXNjcmliZSgnYmFja2VuZFJldHJpZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBmYWlsIHdpdGggdmFsdWUgbGVzcyB0aGFuIDAnLCAoKSA9PiB7XHJcbiAgICAgICAgICBhcmdzLmJhY2tlbmRSZXRyaWVzID0gLTE7XHJcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc3VjY2VlZCB3aXRoIHZhbHVlIG9mIDAnLCAoKSA9PiB7XHJcbiAgICAgICAgICBhcmdzLmJhY2tlbmRSZXRyaWVzID0gMDtcclxuICAgICAgICAgICgoKSA9PiB7dmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7fSkuc2hvdWxkLm5vdC50aHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc3VjY2VlZCB3aXRoIHZhbHVlIGFib3ZlIDAnLCAoKSA9PiB7XHJcbiAgICAgICAgICBhcmdzLmJhY2tlbmRSZXRyaWVzID0gMTAwO1xyXG4gICAgICAgICAgKCgpID0+IHt2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTt9KS5zaG91bGQubm90LnRocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
