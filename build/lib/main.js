#!/usr/bin/env node

require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _logsink = require('./logsink');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

// logger needs to remain first of imports

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumBaseDriver = require('appium-base-driver');

var _asyncbox = require('asyncbox');

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _config = require('./config');

var _appium = require('./appium');

var _appium2 = _interopRequireDefault(_appium);

var _gridRegister = require('./grid-register');

var _gridRegister2 = _interopRequireDefault(_gridRegister);

var _utils = require('./utils');

function preflightChecks(parser, args) {
  var throwInsteadOfExit = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  return _regeneratorRuntime.async(function preflightChecks$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;

        (0, _config.checkNodeOk)();
        if (args.asyncTrace) {
          require('longjohn').async_trace_limit = -1;
        }

        if (!args.showConfig) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _config.showConfig)());

      case 6:
        process.exit(0);

      case 7:
        (0, _config.warnNodeDeprecations)();
        (0, _config.validateServerArgs)(parser, args);

        if (!args.tmpDir) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap((0, _config.validateTmpDir)(args.tmpDir));

      case 12:
        context$1$0.next = 20;
        break;

      case 14:
        context$1$0.prev = 14;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].error(context$1$0.t0.message.red);

        if (!throwInsteadOfExit) {
          context$1$0.next = 19;
          break;
        }

        throw context$1$0.t0;

      case 19:

        process.exit(1);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 14]]);
}

function logDeprecationWarning(deprecatedArgs) {
  _logger2['default'].warn('Deprecated server args:');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(_lodash2['default'].toPairs(deprecatedArgs)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var arg = _step$value[0];
      var realArg = _step$value[1];

      _logger2['default'].warn('  ' + arg.red + ' => ' + realArg);
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
}

function logNonDefaultArgsWarning(args) {
  _logger2['default'].info('Non-default server args:');
  (0, _utils.inspectObject)(args);
}

function logDefaultCapabilitiesWarning(caps) {
  _logger2['default'].info('Default capabilities, which will be added to each request ' + 'unless overridden by desired capabilities:');
  (0, _utils.inspectObject)(caps);
}

function logStartupInfo(parser, args) {
  var welcome, appiumRev, showArgs, deprecatedArgs;
  return _regeneratorRuntime.async(function logStartupInfo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        welcome = 'Welcome to Appium v' + _config.APPIUM_VER;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _config.getGitRev)());

      case 3:
        appiumRev = context$1$0.sent;

        if (appiumRev) {
          welcome += ' (REV ' + appiumRev + ')';
        }
        _logger2['default'].info(welcome);

        showArgs = (0, _config.getNonDefaultArgs)(parser, args);

        if (_lodash2['default'].size(showArgs)) {
          logNonDefaultArgsWarning(showArgs);
        }
        deprecatedArgs = (0, _config.getDeprecatedArgs)(parser, args);

        if (_lodash2['default'].size(deprecatedArgs)) {
          logDeprecationWarning(deprecatedArgs);
        }
        if (!_lodash2['default'].isEmpty(args.defaultCapabilities)) {
          logDefaultCapabilitiesWarning(args.defaultCapabilities);
        }
        // TODO: bring back loglevel reporting below once logger is flushed out
        //logger.info('Console LogLevel: ' + logger.transports.console.level);
        //if (logger.transports.file) {
        //logger.info('File LogLevel: ' + logger.transports.file.level);
        //}

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function logServerPort(address, port) {
  var logMessage = 'Appium REST http interface listener started on ' + (address + ':' + port);
  _logger2['default'].info(logMessage);
}

function initHeapdump(args) {
  if (args.heapdumpEnabled) {
    require('heapdump');
  }
}

function main() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var parser, throwInsteadOfExit, router, server;
  return _regeneratorRuntime.async(function main$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        parser = (0, _parser2['default'])();
        throwInsteadOfExit = false;

        if (args) {
          // a containing package passed in their own args, let's fill them out
          // with defaults
          args = _Object$assign({}, (0, _parser.getDefaultArgs)(), args);

          // if we have a containing package instead of running as a CLI process,
          // that package might not appreciate us calling 'process.exit' willy-
          // nilly, so give it the option to have us throw instead of exit
          if (args.throwInsteadOfExit) {
            throwInsteadOfExit = true;
            // but remove it since it's not a real server arg per se
            delete args.throwInsteadOfExit;
          }
        } else {
          // otherwise parse from CLI
          args = parser.parseArgs();
        }
        initHeapdump(args);
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _logsink.init)(args));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(preflightChecks(parser, args, throwInsteadOfExit));

      case 8:
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(logStartupInfo(parser, args));

      case 10:
        router = (0, _appium2['default'])(args);
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap((0, _appiumBaseDriver.server)(router, args.port, args.address));

      case 13:
        server = context$1$0.sent;
        context$1$0.prev = 14;

        if (!(args.nodeconfig !== null)) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap((0, _gridRegister2['default'])(args.nodeconfig, args.address, args.port));

      case 18:
        context$1$0.next = 25;
        break;

      case 20:
        context$1$0.prev = 20;
        context$1$0.t0 = context$1$0['catch'](14);
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(server.close());

      case 24:
        throw context$1$0.t0;

      case 25:

        process.once('SIGINT', function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].info('Received SIGINT - shutting down');
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(server.close());

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        });

        process.once('SIGTERM', function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].info('Received SIGTERM - shutting down');
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(server.close());

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        });

        logServerPort(args.address, args.port);

        return context$1$0.abrupt('return', server);

      case 29:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[14, 20]]);
}

if (require.main === module) {
  (0, _asyncbox.asyncify)(main);
}

exports.main = main;

// TODO prelaunch if args.launch is set
// TODO: startAlertSocket(server, appiumServer);

// configure as node on grid, if necessary
//# sourceMappingURL=data:application/json;charset=utf8;base64,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SSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7Ozs7eUNBR3hELE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7QUFJdEIsZUFBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Ozs7QUFDckIsb0NBQU8sSUFBSSxtQ0FBbUMsQ0FBQzs7aURBQ3pDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7U0FDckIsQ0FBQyxDQUFDOztBQUVILGVBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFOzs7O0FBQ3RCLG9DQUFPLElBQUksb0NBQW9DLENBQUM7O2lEQUMxQyxNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O1NBQ3JCLENBQUMsQ0FBQzs7QUFFSCxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs0Q0FFaEMsTUFBTTs7Ozs7OztDQUNkOztBQUVELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDM0IsMEJBQVMsSUFBSSxDQUFDLENBQUM7Q0FDaEI7O1FBRVEsSUFBSSxHQUFKLElBQUkiLCJmaWxlIjoibGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLy8gdHJhbnNwaWxlOm1haW5cclxuXHJcbmltcG9ydCB7IGluaXQgYXMgbG9nc2lua0luaXQgfSBmcm9tICcuL2xvZ3NpbmsnO1xyXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJzsgLy8gbG9nZ2VyIG5lZWRzIHRvIHJlbWFpbiBmaXJzdCBvZiBpbXBvcnRzXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IHNlcnZlciBhcyBiYXNlU2VydmVyIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcclxuaW1wb3J0IHsgYXN5bmNpZnkgfSBmcm9tICdhc3luY2JveCc7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgZ2V0UGFyc2VyLCBnZXREZWZhdWx0QXJncyB9IGZyb20gJy4vcGFyc2VyJztcclxuaW1wb3J0IHsgc2hvd0NvbmZpZywgY2hlY2tOb2RlT2ssIHZhbGlkYXRlU2VydmVyQXJncyxcclxuICAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMsIHZhbGlkYXRlVG1wRGlyLCBnZXROb25EZWZhdWx0QXJncyxcclxuICAgICAgICAgZ2V0RGVwcmVjYXRlZEFyZ3MsIGdldEdpdFJldiwgQVBQSVVNX1ZFUiB9IGZyb20gJy4vY29uZmlnJztcclxuaW1wb3J0IGdldEFwcGl1bVJvdXRlciBmcm9tICcuL2FwcGl1bSc7XHJcbmltcG9ydCByZWdpc3Rlck5vZGUgZnJvbSAnLi9ncmlkLXJlZ2lzdGVyJztcclxuaW1wb3J0IHsgaW5zcGVjdE9iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByZWZsaWdodENoZWNrcyAocGFyc2VyLCBhcmdzLCB0aHJvd0luc3RlYWRPZkV4aXQgPSBmYWxzZSkge1xyXG4gIHRyeSB7XHJcbiAgICBjaGVja05vZGVPaygpO1xyXG4gICAgaWYgKGFyZ3MuYXN5bmNUcmFjZSkge1xyXG4gICAgICByZXF1aXJlKCdsb25nam9obicpLmFzeW5jX3RyYWNlX2xpbWl0ID0gLTE7XHJcbiAgICB9XHJcbiAgICBpZiAoYXJncy5zaG93Q29uZmlnKSB7XHJcbiAgICAgIGF3YWl0IHNob3dDb25maWcoKTtcclxuICAgICAgcHJvY2Vzcy5leGl0KDApO1xyXG4gICAgfVxyXG4gICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcclxuICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gICAgaWYgKGFyZ3MudG1wRGlyKSB7XHJcbiAgICAgIGF3YWl0IHZhbGlkYXRlVG1wRGlyKGFyZ3MudG1wRGlyKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGxvZ2dlci5lcnJvcihlcnIubWVzc2FnZS5yZWQpO1xyXG4gICAgaWYgKHRocm93SW5zdGVhZE9mRXhpdCkge1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nRGVwcmVjYXRpb25XYXJuaW5nIChkZXByZWNhdGVkQXJncykge1xyXG4gIGxvZ2dlci53YXJuKCdEZXByZWNhdGVkIHNlcnZlciBhcmdzOicpO1xyXG4gIGZvciAobGV0IFthcmcsIHJlYWxBcmddIG9mIF8udG9QYWlycyhkZXByZWNhdGVkQXJncykpIHtcclxuICAgIGxvZ2dlci53YXJuKGAgICR7YXJnLnJlZH0gPT4gJHtyZWFsQXJnfWApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nTm9uRGVmYXVsdEFyZ3NXYXJuaW5nIChhcmdzKSB7XHJcbiAgbG9nZ2VyLmluZm8oJ05vbi1kZWZhdWx0IHNlcnZlciBhcmdzOicpO1xyXG4gIGluc3BlY3RPYmplY3QoYXJncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ0RlZmF1bHRDYXBhYmlsaXRpZXNXYXJuaW5nIChjYXBzKSB7XHJcbiAgbG9nZ2VyLmluZm8oJ0RlZmF1bHQgY2FwYWJpbGl0aWVzLCB3aGljaCB3aWxsIGJlIGFkZGVkIHRvIGVhY2ggcmVxdWVzdCAnICtcclxuICAgICAgICAgICAgICAndW5sZXNzIG92ZXJyaWRkZW4gYnkgZGVzaXJlZCBjYXBhYmlsaXRpZXM6Jyk7XHJcbiAgaW5zcGVjdE9iamVjdChjYXBzKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9nU3RhcnR1cEluZm8gKHBhcnNlciwgYXJncykge1xyXG4gIGxldCB3ZWxjb21lID0gYFdlbGNvbWUgdG8gQXBwaXVtIHYke0FQUElVTV9WRVJ9YDtcclxuICBsZXQgYXBwaXVtUmV2ID0gYXdhaXQgZ2V0R2l0UmV2KCk7XHJcbiAgaWYgKGFwcGl1bVJldikge1xyXG4gICAgd2VsY29tZSArPSBgIChSRVYgJHthcHBpdW1SZXZ9KWA7XHJcbiAgfVxyXG4gIGxvZ2dlci5pbmZvKHdlbGNvbWUpO1xyXG5cclxuICBsZXQgc2hvd0FyZ3MgPSBnZXROb25EZWZhdWx0QXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gIGlmIChfLnNpemUoc2hvd0FyZ3MpKSB7XHJcbiAgICBsb2dOb25EZWZhdWx0QXJnc1dhcm5pbmcoc2hvd0FyZ3MpO1xyXG4gIH1cclxuICBsZXQgZGVwcmVjYXRlZEFyZ3MgPSBnZXREZXByZWNhdGVkQXJncyhwYXJzZXIsIGFyZ3MpO1xyXG4gIGlmIChfLnNpemUoZGVwcmVjYXRlZEFyZ3MpKSB7XHJcbiAgICBsb2dEZXByZWNhdGlvbldhcm5pbmcoZGVwcmVjYXRlZEFyZ3MpO1xyXG4gIH1cclxuICBpZiAoIV8uaXNFbXB0eShhcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMpKSB7XHJcbiAgICBsb2dEZWZhdWx0Q2FwYWJpbGl0aWVzV2FybmluZyhhcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMpO1xyXG4gIH1cclxuICAvLyBUT0RPOiBicmluZyBiYWNrIGxvZ2xldmVsIHJlcG9ydGluZyBiZWxvdyBvbmNlIGxvZ2dlciBpcyBmbHVzaGVkIG91dFxyXG4gIC8vbG9nZ2VyLmluZm8oJ0NvbnNvbGUgTG9nTGV2ZWw6ICcgKyBsb2dnZXIudHJhbnNwb3J0cy5jb25zb2xlLmxldmVsKTtcclxuICAvL2lmIChsb2dnZXIudHJhbnNwb3J0cy5maWxlKSB7XHJcbiAgICAvL2xvZ2dlci5pbmZvKCdGaWxlIExvZ0xldmVsOiAnICsgbG9nZ2VyLnRyYW5zcG9ydHMuZmlsZS5sZXZlbCk7XHJcbiAgLy99XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ1NlcnZlclBvcnQgKGFkZHJlc3MsIHBvcnQpIHtcclxuICBsZXQgbG9nTWVzc2FnZSA9IGBBcHBpdW0gUkVTVCBodHRwIGludGVyZmFjZSBsaXN0ZW5lciBzdGFydGVkIG9uIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgYCR7YWRkcmVzc306JHtwb3J0fWA7XHJcbiAgbG9nZ2VyLmluZm8obG9nTWVzc2FnZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRIZWFwZHVtcCAoYXJncykge1xyXG4gIGlmIChhcmdzLmhlYXBkdW1wRW5hYmxlZCkge1xyXG4gICAgcmVxdWlyZSgnaGVhcGR1bXAnKTtcclxuICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4gKGFyZ3MgPSBudWxsKSB7XHJcbiAgbGV0IHBhcnNlciA9IGdldFBhcnNlcigpO1xyXG4gIGxldCB0aHJvd0luc3RlYWRPZkV4aXQgPSBmYWxzZTtcclxuICBpZiAoYXJncykge1xyXG4gICAgLy8gYSBjb250YWluaW5nIHBhY2thZ2UgcGFzc2VkIGluIHRoZWlyIG93biBhcmdzLCBsZXQncyBmaWxsIHRoZW0gb3V0XHJcbiAgICAvLyB3aXRoIGRlZmF1bHRzXHJcbiAgICBhcmdzID0gT2JqZWN0LmFzc2lnbih7fSwgZ2V0RGVmYXVsdEFyZ3MoKSwgYXJncyk7XHJcblxyXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGNvbnRhaW5pbmcgcGFja2FnZSBpbnN0ZWFkIG9mIHJ1bm5pbmcgYXMgYSBDTEkgcHJvY2VzcyxcclxuICAgIC8vIHRoYXQgcGFja2FnZSBtaWdodCBub3QgYXBwcmVjaWF0ZSB1cyBjYWxsaW5nICdwcm9jZXNzLmV4aXQnIHdpbGx5LVxyXG4gICAgLy8gbmlsbHksIHNvIGdpdmUgaXQgdGhlIG9wdGlvbiB0byBoYXZlIHVzIHRocm93IGluc3RlYWQgb2YgZXhpdFxyXG4gICAgaWYgKGFyZ3MudGhyb3dJbnN0ZWFkT2ZFeGl0KSB7XHJcbiAgICAgIHRocm93SW5zdGVhZE9mRXhpdCA9IHRydWU7XHJcbiAgICAgIC8vIGJ1dCByZW1vdmUgaXQgc2luY2UgaXQncyBub3QgYSByZWFsIHNlcnZlciBhcmcgcGVyIHNlXHJcbiAgICAgIGRlbGV0ZSBhcmdzLnRocm93SW5zdGVhZE9mRXhpdDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gb3RoZXJ3aXNlIHBhcnNlIGZyb20gQ0xJXHJcbiAgICBhcmdzID0gcGFyc2VyLnBhcnNlQXJncygpO1xyXG4gIH1cclxuICBpbml0SGVhcGR1bXAoYXJncyk7XHJcbiAgYXdhaXQgbG9nc2lua0luaXQoYXJncyk7XHJcbiAgYXdhaXQgcHJlZmxpZ2h0Q2hlY2tzKHBhcnNlciwgYXJncywgdGhyb3dJbnN0ZWFkT2ZFeGl0KTtcclxuICBhd2FpdCBsb2dTdGFydHVwSW5mbyhwYXJzZXIsIGFyZ3MpO1xyXG4gIGxldCByb3V0ZXIgPSBnZXRBcHBpdW1Sb3V0ZXIoYXJncyk7XHJcbiAgbGV0IHNlcnZlciA9IGF3YWl0IGJhc2VTZXJ2ZXIocm91dGVyLCBhcmdzLnBvcnQsIGFyZ3MuYWRkcmVzcyk7XHJcbiAgdHJ5IHtcclxuICAgIC8vIFRPRE8gcHJlbGF1bmNoIGlmIGFyZ3MubGF1bmNoIGlzIHNldFxyXG4gICAgLy8gVE9ETzogc3RhcnRBbGVydFNvY2tldChzZXJ2ZXIsIGFwcGl1bVNlcnZlcik7XHJcblxyXG4gICAgLy8gY29uZmlndXJlIGFzIG5vZGUgb24gZ3JpZCwgaWYgbmVjZXNzYXJ5XHJcbiAgICBpZiAoYXJncy5ub2RlY29uZmlnICE9PSBudWxsKSB7XHJcbiAgICAgIGF3YWl0IHJlZ2lzdGVyTm9kZShhcmdzLm5vZGVjb25maWcsIGFyZ3MuYWRkcmVzcywgYXJncy5wb3J0KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGF3YWl0IHNlcnZlci5jbG9zZSgpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH1cclxuXHJcbiAgcHJvY2Vzcy5vbmNlKCdTSUdJTlQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsb2dnZXIuaW5mbyhgUmVjZWl2ZWQgU0lHSU5UIC0gc2h1dHRpbmcgZG93bmApO1xyXG4gICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XHJcbiAgfSk7XHJcblxyXG4gIHByb2Nlc3Mub25jZSgnU0lHVEVSTScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxvZ2dlci5pbmZvKGBSZWNlaXZlZCBTSUdURVJNIC0gc2h1dHRpbmcgZG93bmApO1xyXG4gICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XHJcbiAgfSk7XHJcblxyXG4gIGxvZ1NlcnZlclBvcnQoYXJncy5hZGRyZXNzLCBhcmdzLnBvcnQpO1xyXG5cclxuICByZXR1cm4gc2VydmVyO1xyXG59XHJcblxyXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcclxuICBhc3luY2lmeShtYWluKTtcclxufVxyXG5cclxuZXhwb3J0IHsgbWFpbiB9O1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
