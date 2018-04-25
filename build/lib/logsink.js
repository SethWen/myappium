'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _appiumSupport = require('appium-support');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// set up distributed logging before everything else
_appiumSupport.logger.patchLogger(_npmlog2['default']);
global._global_npmlog = _npmlog2['default'];

// npmlog is used only for emitting, we use winston for output
_npmlog2['default'].level = "silent";
var levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1
};

var colors = {
  info: 'cyan',
  debug: 'grey',
  warn: 'yellow',
  error: 'red'
};

var npmToWinstonLevels = {
  silly: 'debug',
  verbose: 'debug',
  debug: 'debug',
  info: 'info',
  http: 'info',
  warn: 'warn',
  error: 'error'
};

var log = null;
var timeZone = null;

function timestamp() {
  var date = new Date();
  if (!timeZone) {
    date = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
  }
  return (0, _dateformat2['default'])(date, "yyyy-mm-dd HH:MM:ss:l");
}

// Strip the color marking within messages.
// We need to patch the transports, because the stripColor functionality in
// Winston is wrongly implemented at the logger level, and we want to avoid
// having to create 2 loggers.
function applyStripColorPatch(transport) {
  var _log = transport.log.bind(transport);
  transport.log = function (level, msg, meta, callback) {
    // eslint-disable-line promise/prefer-await-to-callbacks
    var code = /\u001b\[(\d+(;\d+)*)?m/g;
    msg = ('' + msg).replace(code, '');
    _log(level, msg, meta, callback);
  };
}

function _createConsoleTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.Console({
    name: "console",
    timestamp: args.logTimestamp ? timestamp : undefined,
    colorize: !args.logNoColors,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    formatter: function formatter(options) {
      var meta = options.meta && _Object$keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '';
      var timestampPrefix = '';
      if (options.timestamp) {
        timestampPrefix = options.timestamp() + ' - ';
      }
      return '' + timestampPrefix + (options.message || '') + meta;
    }
  });
  if (args.logNoColors) {
    applyStripColorPatch(transport);
  }

  return transport;
}

function _createFileTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.File({
    name: "file",
    timestamp: timestamp,
    filename: args.log,
    maxFiles: 1,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createHttpTransport(args, logLvl) {
  var host = null,
      port = null;

  if (args.webhook.match(':')) {
    var hostAndPort = args.webhook.split(':');
    host = hostAndPort[0];
    port = parseInt(hostAndPort[1], 10);
  }

  var transport = new _winston2['default'].transports.Http({
    name: "http",
    host: host || '127.0.0.1',
    port: port || 9003,
    path: '/',
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createTransports(args) {
  var transports, consoleLogLevel, fileLogLevel, lvlPair;
  return _regeneratorRuntime.async(function _createTransports$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        transports = [];
        consoleLogLevel = null;
        fileLogLevel = null;

        if (args.loglevel && args.loglevel.match(":")) {
          lvlPair = args.loglevel.split(':');

          consoleLogLevel = lvlPair[0] || consoleLogLevel;
          fileLogLevel = lvlPair[1] || fileLogLevel;
        } else {
          consoleLogLevel = fileLogLevel = args.loglevel;
        }

        transports.push(_createConsoleTransport(args, consoleLogLevel));

        if (!args.log) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.prev = 6;
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(args.log));

      case 9:
        if (!context$1$0.sent) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(args.log));

      case 12:

        transports.push(_createFileTransport(args, fileLogLevel));
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](6);

        // eslint-disable-next-line no-console
        console.log('Tried to attach logging to file ' + args.log + ' but an error ' + ('occurred: ' + context$1$0.t0.message));

      case 18:

        if (args.webhook) {
          try {
            transports.push(_createHttpTransport(args, fileLogLevel));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Tried to attach logging to Http at ' + args.webhook + ' but ' + ('an error occurred: ' + e.message));
          }
        }

        return context$1$0.abrupt('return', transports);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 15]]);
}

function init(args) {
  return _regeneratorRuntime.async(function init$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // set de facto param passed to timestamp function
        timeZone = args.localTimezone;

        // by not adding colors here and not setting 'colorize' in transports
        // when logNoColors === true, console output is fully stripped of color.
        if (!args.logNoColors) {
          _winston2['default'].addColors(colors);
        }

        // clean up in case we have initted before since npmlog is a global
        // object
        clear();

        context$1$0.t0 = _winston2['default'].Logger;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_createTransports(args));

      case 6:
        context$1$0.t1 = context$1$0.sent;
        context$1$0.t2 = {
          transports: context$1$0.t1
        };
        log = new context$1$0.t0(context$1$0.t2);

        // Capture logs emitted via npmlog and pass them through winston
        _npmlog2['default'].on('log', function (logObj) {
          var winstonLevel = npmToWinstonLevels[logObj.level] || 'info';
          var msg = logObj.message;
          if (logObj.prefix) {
            var prefix = '[' + logObj.prefix + ']';
            msg = prefix.magenta + ' ' + msg;
          }
          log[winstonLevel](msg);
          if (args.logHandler && typeof args.logHandler === "function") {
            args.logHandler(logObj.level, msg);
          }
        });

        log.setLevels(levels);

        // 8/19/14 this is a hack to force Winston to print debug messages to stdout rather than stderr.
        // TODO: remove this if winston provides an API for directing streams.
        if (levels[log.transports.console.level] === levels.debug) {
          log.debug = function (msg) {
            log.info('[debug] ' + msg);
          };
        }

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function clear() {
  if (log) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_lodash2['default'].keys(log.transports)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var transport = _step.value;

        log.remove(transport);
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
  _npmlog2['default'].removeAllListeners('log');
}

exports.init = init;
exports.clear = clear;
exports['default'] = init;

// --log-level arg can optionally provide diff logging levels for console and file, separated by a colon

// if we don't delete the log file, winston will always append and it will grow infinitely large;
// winston allows for limiting log file size, but as of 9.2.14 there's a serious bug when using
// maxFiles and maxSize together. https://github.com/flatiron/winston/issues/397
//# sourceMappingURL=data:application/json;charset=utf8;base64,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aW1wb3J0IG5wbWxvZyBmcm9tICducG1sb2cnO1xyXG5pbXBvcnQgd2luc3RvbiAgZnJvbSAnd2luc3Rvbic7XHJcbmltcG9ydCB7IGZzLCBsb2dnZXIgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XHJcbmltcG9ydCBkYXRlZm9ybWF0IGZyb20gJ2RhdGVmb3JtYXQnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuLy8gc2V0IHVwIGRpc3RyaWJ1dGVkIGxvZ2dpbmcgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZVxyXG5sb2dnZXIucGF0Y2hMb2dnZXIobnBtbG9nKTtcclxuZ2xvYmFsLl9nbG9iYWxfbnBtbG9nID0gbnBtbG9nO1xyXG5cclxuLy8gbnBtbG9nIGlzIHVzZWQgb25seSBmb3IgZW1pdHRpbmcsIHdlIHVzZSB3aW5zdG9uIGZvciBvdXRwdXRcclxubnBtbG9nLmxldmVsID0gXCJzaWxlbnRcIjtcclxuY29uc3QgbGV2ZWxzID0ge1xyXG4gIGRlYnVnOiA0LFxyXG4gIGluZm86IDMsXHJcbiAgd2FybjogMixcclxuICBlcnJvcjogMSxcclxufTtcclxuXHJcbmNvbnN0IGNvbG9ycyA9IHtcclxuICBpbmZvOiAnY3lhbicsXHJcbiAgZGVidWc6ICdncmV5JyxcclxuICB3YXJuOiAneWVsbG93JyxcclxuICBlcnJvcjogJ3JlZCcsXHJcbn07XHJcblxyXG5jb25zdCBucG1Ub1dpbnN0b25MZXZlbHMgPSB7XHJcbiAgc2lsbHk6ICdkZWJ1ZycsXHJcbiAgdmVyYm9zZTogJ2RlYnVnJyxcclxuICBkZWJ1ZzogJ2RlYnVnJyxcclxuICBpbmZvOiAnaW5mbycsXHJcbiAgaHR0cDogJ2luZm8nLFxyXG4gIHdhcm46ICd3YXJuJyxcclxuICBlcnJvcjogJ2Vycm9yJyxcclxufTtcclxuXHJcbmxldCBsb2cgPSBudWxsO1xyXG5sZXQgdGltZVpvbmUgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgaWYgKCF0aW1lWm9uZSkge1xyXG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUudmFsdWVPZigpICsgZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDApO1xyXG4gIH1cclxuICByZXR1cm4gZGF0ZWZvcm1hdChkYXRlLCBcInl5eXktbW0tZGQgSEg6TU06c3M6bFwiKTtcclxufVxyXG5cclxuLy8gU3RyaXAgdGhlIGNvbG9yIG1hcmtpbmcgd2l0aGluIG1lc3NhZ2VzLlxyXG4vLyBXZSBuZWVkIHRvIHBhdGNoIHRoZSB0cmFuc3BvcnRzLCBiZWNhdXNlIHRoZSBzdHJpcENvbG9yIGZ1bmN0aW9uYWxpdHkgaW5cclxuLy8gV2luc3RvbiBpcyB3cm9uZ2x5IGltcGxlbWVudGVkIGF0IHRoZSBsb2dnZXIgbGV2ZWwsIGFuZCB3ZSB3YW50IHRvIGF2b2lkXHJcbi8vIGhhdmluZyB0byBjcmVhdGUgMiBsb2dnZXJzLlxyXG5mdW5jdGlvbiBhcHBseVN0cmlwQ29sb3JQYXRjaCAodHJhbnNwb3J0KSB7XHJcbiAgbGV0IF9sb2cgPSB0cmFuc3BvcnQubG9nLmJpbmQodHJhbnNwb3J0KTtcclxuICB0cmFuc3BvcnQubG9nID0gZnVuY3Rpb24gKGxldmVsLCBtc2csIG1ldGEsIGNhbGxiYWNrKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJvbWlzZS9wcmVmZXItYXdhaXQtdG8tY2FsbGJhY2tzXHJcbiAgICBsZXQgY29kZSA9IC9cXHUwMDFiXFxbKFxcZCsoO1xcZCspKik/bS9nO1xyXG4gICAgbXNnID0gKCcnICsgbXNnKS5yZXBsYWNlKGNvZGUsICcnKTtcclxuICAgIF9sb2cobGV2ZWwsIG1zZywgbWV0YSwgY2FsbGJhY2spO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jcmVhdGVDb25zb2xlVHJhbnNwb3J0IChhcmdzLCBsb2dMdmwpIHtcclxuICBsZXQgdHJhbnNwb3J0ID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSkoe1xyXG4gICAgbmFtZTogXCJjb25zb2xlXCIsXHJcbiAgICB0aW1lc3RhbXA6IGFyZ3MubG9nVGltZXN0YW1wID8gdGltZXN0YW1wIDogdW5kZWZpbmVkLFxyXG4gICAgY29sb3JpemU6ICFhcmdzLmxvZ05vQ29sb3JzLFxyXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcclxuICAgIGV4aXRPbkVycm9yOiBmYWxzZSxcclxuICAgIGpzb246IGZhbHNlLFxyXG4gICAgbGV2ZWw6IGxvZ0x2bCxcclxuICAgIGZvcm1hdHRlciAob3B0aW9ucykge1xyXG4gICAgICBsZXQgbWV0YSA9IG9wdGlvbnMubWV0YSAmJiBPYmplY3Qua2V5cyhvcHRpb25zLm1ldGEpLmxlbmd0aCA/IGBcXG5cXHQke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubWV0YSl9YCA6ICcnO1xyXG4gICAgICBsZXQgdGltZXN0YW1wUHJlZml4ID0gJyc7XHJcbiAgICAgIGlmIChvcHRpb25zLnRpbWVzdGFtcCkge1xyXG4gICAgICAgIHRpbWVzdGFtcFByZWZpeCA9IGAke29wdGlvbnMudGltZXN0YW1wKCl9IC0gYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYCR7dGltZXN0YW1wUHJlZml4fSR7b3B0aW9ucy5tZXNzYWdlIHx8ICcnfSR7bWV0YX1gO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGlmIChhcmdzLmxvZ05vQ29sb3JzKSB7XHJcbiAgICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRyYW5zcG9ydDtcclxufVxyXG5cclxuZnVuY3Rpb24gX2NyZWF0ZUZpbGVUcmFuc3BvcnQgKGFyZ3MsIGxvZ0x2bCkge1xyXG4gIGxldCB0cmFuc3BvcnQgPSBuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKSh7XHJcbiAgICBuYW1lOiBcImZpbGVcIixcclxuICAgIHRpbWVzdGFtcCxcclxuICAgIGZpbGVuYW1lOiBhcmdzLmxvZyxcclxuICAgIG1heEZpbGVzOiAxLFxyXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcclxuICAgIGV4aXRPbkVycm9yOiBmYWxzZSxcclxuICAgIGpzb246IGZhbHNlLFxyXG4gICAgbGV2ZWw6IGxvZ0x2bCxcclxuICB9KTtcclxuICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xyXG4gIHJldHVybiB0cmFuc3BvcnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jcmVhdGVIdHRwVHJhbnNwb3J0IChhcmdzLCBsb2dMdmwpIHtcclxuICBsZXQgaG9zdCA9IG51bGwsXHJcbiAgICAgIHBvcnQgPSBudWxsO1xyXG5cclxuICBpZiAoYXJncy53ZWJob29rLm1hdGNoKCc6JykpIHtcclxuICAgIGxldCBob3N0QW5kUG9ydCA9IGFyZ3Mud2ViaG9vay5zcGxpdCgnOicpO1xyXG4gICAgaG9zdCA9IGhvc3RBbmRQb3J0WzBdO1xyXG4gICAgcG9ydCA9IHBhcnNlSW50KGhvc3RBbmRQb3J0WzFdLCAxMCk7XHJcbiAgfVxyXG5cclxuICBsZXQgdHJhbnNwb3J0ID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuSHR0cCkoe1xyXG4gICAgbmFtZTogXCJodHRwXCIsXHJcbiAgICBob3N0OiBob3N0IHx8ICcxMjcuMC4wLjEnLFxyXG4gICAgcG9ydDogcG9ydCB8fCA5MDAzLFxyXG4gICAgcGF0aDogJy8nLFxyXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcclxuICAgIGV4aXRPbkVycm9yOiBmYWxzZSxcclxuICAgIGpzb246IGZhbHNlLFxyXG4gICAgbGV2ZWw6IGxvZ0x2bCxcclxuICB9KTtcclxuICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xyXG4gIHJldHVybiB0cmFuc3BvcnQ7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIF9jcmVhdGVUcmFuc3BvcnRzIChhcmdzKSB7XHJcbiAgbGV0IHRyYW5zcG9ydHMgPSBbXTtcclxuICBsZXQgY29uc29sZUxvZ0xldmVsID0gbnVsbDtcclxuICBsZXQgZmlsZUxvZ0xldmVsID0gbnVsbDtcclxuXHJcbiAgaWYgKGFyZ3MubG9nbGV2ZWwgJiYgYXJncy5sb2dsZXZlbC5tYXRjaChcIjpcIikpIHtcclxuICAgIC8vIC0tbG9nLWxldmVsIGFyZyBjYW4gb3B0aW9uYWxseSBwcm92aWRlIGRpZmYgbG9nZ2luZyBsZXZlbHMgZm9yIGNvbnNvbGUgYW5kIGZpbGUsIHNlcGFyYXRlZCBieSBhIGNvbG9uXHJcbiAgICBsZXQgbHZsUGFpciA9IGFyZ3MubG9nbGV2ZWwuc3BsaXQoJzonKTtcclxuICAgIGNvbnNvbGVMb2dMZXZlbCA9ICBsdmxQYWlyWzBdIHx8IGNvbnNvbGVMb2dMZXZlbDtcclxuICAgIGZpbGVMb2dMZXZlbCA9IGx2bFBhaXJbMV0gfHwgZmlsZUxvZ0xldmVsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlTG9nTGV2ZWwgPSBmaWxlTG9nTGV2ZWwgPSBhcmdzLmxvZ2xldmVsO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNwb3J0cy5wdXNoKF9jcmVhdGVDb25zb2xlVHJhbnNwb3J0KGFyZ3MsIGNvbnNvbGVMb2dMZXZlbCkpO1xyXG5cclxuICBpZiAoYXJncy5sb2cpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIGlmIHdlIGRvbid0IGRlbGV0ZSB0aGUgbG9nIGZpbGUsIHdpbnN0b24gd2lsbCBhbHdheXMgYXBwZW5kIGFuZCBpdCB3aWxsIGdyb3cgaW5maW5pdGVseSBsYXJnZTtcclxuICAgICAgLy8gd2luc3RvbiBhbGxvd3MgZm9yIGxpbWl0aW5nIGxvZyBmaWxlIHNpemUsIGJ1dCBhcyBvZiA5LjIuMTQgdGhlcmUncyBhIHNlcmlvdXMgYnVnIHdoZW4gdXNpbmdcclxuICAgICAgLy8gbWF4RmlsZXMgYW5kIG1heFNpemUgdG9nZXRoZXIuIGh0dHBzOi8vZ2l0aHViLmNvbS9mbGF0aXJvbi93aW5zdG9uL2lzc3Vlcy8zOTdcclxuICAgICAgaWYgKGF3YWl0IGZzLmV4aXN0cyhhcmdzLmxvZykpIHtcclxuICAgICAgICBhd2FpdCBmcy51bmxpbmsoYXJncy5sb2cpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0cmFuc3BvcnRzLnB1c2goX2NyZWF0ZUZpbGVUcmFuc3BvcnQoYXJncywgZmlsZUxvZ0xldmVsKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgIGNvbnNvbGUubG9nKGBUcmllZCB0byBhdHRhY2ggbG9nZ2luZyB0byBmaWxlICR7YXJncy5sb2d9IGJ1dCBhbiBlcnJvciBgICtcclxuICAgICAgICAgICAgICAgICAgYG9jY3VycmVkOiAke2UubWVzc2FnZX1gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChhcmdzLndlYmhvb2spIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRyYW5zcG9ydHMucHVzaChfY3JlYXRlSHR0cFRyYW5zcG9ydChhcmdzLCBmaWxlTG9nTGV2ZWwpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgY29uc29sZS5sb2coYFRyaWVkIHRvIGF0dGFjaCBsb2dnaW5nIHRvIEh0dHAgYXQgJHthcmdzLndlYmhvb2t9IGJ1dCBgICtcclxuICAgICAgICAgICAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkOiAke2UubWVzc2FnZX1gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0cmFuc3BvcnRzO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBpbml0IChhcmdzKSB7XHJcbiAgLy8gc2V0IGRlIGZhY3RvIHBhcmFtIHBhc3NlZCB0byB0aW1lc3RhbXAgZnVuY3Rpb25cclxuICB0aW1lWm9uZSA9IGFyZ3MubG9jYWxUaW1lem9uZTtcclxuXHJcbiAgLy8gYnkgbm90IGFkZGluZyBjb2xvcnMgaGVyZSBhbmQgbm90IHNldHRpbmcgJ2NvbG9yaXplJyBpbiB0cmFuc3BvcnRzXHJcbiAgLy8gd2hlbiBsb2dOb0NvbG9ycyA9PT0gdHJ1ZSwgY29uc29sZSBvdXRwdXQgaXMgZnVsbHkgc3RyaXBwZWQgb2YgY29sb3IuXHJcbiAgaWYgKCFhcmdzLmxvZ05vQ29sb3JzKSB7XHJcbiAgICB3aW5zdG9uLmFkZENvbG9ycyhjb2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgLy8gY2xlYW4gdXAgaW4gY2FzZSB3ZSBoYXZlIGluaXR0ZWQgYmVmb3JlIHNpbmNlIG5wbWxvZyBpcyBhIGdsb2JhbFxyXG4gIC8vIG9iamVjdFxyXG4gIGNsZWFyKCk7XHJcblxyXG4gIGxvZyA9IG5ldyAod2luc3Rvbi5Mb2dnZXIpKHtcclxuICAgIHRyYW5zcG9ydHM6IGF3YWl0IF9jcmVhdGVUcmFuc3BvcnRzKGFyZ3MpXHJcbiAgfSk7XHJcblxyXG4gIC8vIENhcHR1cmUgbG9ncyBlbWl0dGVkIHZpYSBucG1sb2cgYW5kIHBhc3MgdGhlbSB0aHJvdWdoIHdpbnN0b25cclxuICBucG1sb2cub24oJ2xvZycsIChsb2dPYmopID0+IHtcclxuICAgIGxldCB3aW5zdG9uTGV2ZWwgPSBucG1Ub1dpbnN0b25MZXZlbHNbbG9nT2JqLmxldmVsXSB8fCAnaW5mbyc7XHJcbiAgICBsZXQgbXNnID0gbG9nT2JqLm1lc3NhZ2U7XHJcbiAgICBpZiAobG9nT2JqLnByZWZpeCkge1xyXG4gICAgICBsZXQgcHJlZml4ID0gYFske2xvZ09iai5wcmVmaXh9XWA7XHJcbiAgICAgIG1zZyA9IGAke3ByZWZpeC5tYWdlbnRhfSAke21zZ31gO1xyXG4gICAgfVxyXG4gICAgbG9nW3dpbnN0b25MZXZlbF0obXNnKTtcclxuICAgIGlmIChhcmdzLmxvZ0hhbmRsZXIgJiYgdHlwZW9mIGFyZ3MubG9nSGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIGFyZ3MubG9nSGFuZGxlcihsb2dPYmoubGV2ZWwsIG1zZyk7XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuXHJcbiAgbG9nLnNldExldmVscyhsZXZlbHMpO1xyXG5cclxuICAvLyA4LzE5LzE0IHRoaXMgaXMgYSBoYWNrIHRvIGZvcmNlIFdpbnN0b24gdG8gcHJpbnQgZGVidWcgbWVzc2FnZXMgdG8gc3Rkb3V0IHJhdGhlciB0aGFuIHN0ZGVyci5cclxuICAvLyBUT0RPOiByZW1vdmUgdGhpcyBpZiB3aW5zdG9uIHByb3ZpZGVzIGFuIEFQSSBmb3IgZGlyZWN0aW5nIHN0cmVhbXMuXHJcbiAgaWYgKGxldmVsc1tsb2cudHJhbnNwb3J0cy5jb25zb2xlLmxldmVsXSA9PT0gbGV2ZWxzLmRlYnVnKSB7XHJcbiAgICBsb2cuZGVidWcgPSBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgIGxvZy5pbmZvKCdbZGVidWddICcgKyBtc2cpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyICgpIHtcclxuICBpZiAobG9nKSB7XHJcbiAgICBmb3IgKGxldCB0cmFuc3BvcnQgb2YgXy5rZXlzKGxvZy50cmFuc3BvcnRzKSkge1xyXG4gICAgICBsb2cucmVtb3ZlKHRyYW5zcG9ydCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG5wbWxvZy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2xvZycpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgaW5pdCwgY2xlYXIgfTtcclxuZXhwb3J0IGRlZmF1bHQgaW5pdDtcclxuIl0sInNvdXJjZVJvb3QiOiIuLlxcLi4ifQ==
