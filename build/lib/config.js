'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appiumSupport = require('appium-support');

var _teen_process = require('teen_process');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _packageJson = require('../../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

// eslint-disable-line import/no-unresolved

var APPIUM_VER = _packageJson2['default'].version;

function getNodeVersion() {
  // expect v<major>.<minor>.<patch>
  // we will pull out `major` and `minor`
  var version = process.version.match(/^v(\d+)\.(\d+)/);
  return [Number(version[1]), Number(version[2])];
}

function getGitRev() {
  var cwd, rev, _ref, stdout;

  return _regeneratorRuntime.async(function getGitRev$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        cwd = _path2['default'].resolve(__dirname, "..", "..");
        rev = null;
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)("git", ["rev-parse", "HEAD"], { cwd: cwd }));

      case 5:
        _ref = context$1$0.sent;
        stdout = _ref.stdout;

        rev = stdout.trim();
        context$1$0.next = 12;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](2);

      case 12:
        return context$1$0.abrupt('return', rev);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2, 10]]);
}

function getAppiumConfig() {
  var stat, built, config;
  return _regeneratorRuntime.async(function getAppiumConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.stat(_path2['default'].resolve(__dirname, '..')));

      case 2:
        stat = context$1$0.sent;
        built = stat.mtime.getTime();
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(getGitRev());

      case 6:
        context$1$0.t0 = context$1$0.sent;
        context$1$0.t1 = built;
        context$1$0.t2 = APPIUM_VER;
        config = {
          'git-sha': context$1$0.t0,
          built: context$1$0.t1,
          version: context$1$0.t2
        };
        return context$1$0.abrupt('return', config);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function checkNodeOk() {
  var _getNodeVersion = getNodeVersion();

  var _getNodeVersion2 = _slicedToArray(_getNodeVersion, 2);

  var major = _getNodeVersion2[0];
  var minor = _getNodeVersion2[1];

  if (major < 5) {
    var msg = 'Node version must be >= 5. Currently ' + major + '.' + minor;
    _logger2['default'].errorAndThrow(msg);
  }
}

function warnNodeDeprecations() {
  var _getNodeVersion3 = getNodeVersion();

  var _getNodeVersion32 = _slicedToArray(_getNodeVersion3, 1);

  var major = _getNodeVersion32[0];

  if (major < 4) {
    _logger2['default'].warn("Appium support for versions of node < 4 has been " + "deprecated and will be removed in a future version. Please " + "upgrade!");
  }
}

function showConfig() {
  var config;
  return _regeneratorRuntime.async(function showConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(getAppiumConfig());

      case 2:
        config = context$1$0.sent;

        console.log(JSON.stringify(config)); // eslint-disable-line no-console

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getNonDefaultArgs(parser, args) {
  var nonDefaults = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(parser.rawArgs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rawArg = _step.value;

      var arg = rawArg[1].dest;
      if (args[arg] && args[arg] !== rawArg[1].defaultValue) {
        nonDefaults[arg] = args[arg];
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

  return nonDefaults;
}

function getDeprecatedArgs(parser, args) {
  // go through the server command line arguments and figure
  // out which of the ones used are deprecated
  var deprecated = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(parser.rawArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var rawArg = _step2.value;

      var arg = rawArg[1].dest;
      var defaultValue = rawArg[1].defaultValue;
      var isDeprecated = !!rawArg[1].deprecatedFor;
      if (args[arg] && args[arg] !== defaultValue && isDeprecated) {
        deprecated[rawArg[0]] = rawArg[1].deprecatedFor;
      }
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

  return deprecated;
}

function checkValidPort(port, portName) {
  if (port > 0 && port < 65536) return true; // eslint-disable-line curly
  _logger2['default'].error('Port \'' + portName + '\' must be greater than 0 and less than 65536. Currently ' + port);
  return false;
}

function validateServerArgs(parser, args) {
  // arguments that cannot both be set
  var exclusives = [['noReset', 'fullReset'], ['ipa', 'safari'], ['app', 'safari'], ['forceIphone', 'forceIpad'], ['deviceName', 'defaultDevice']];

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(exclusives), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var exSet = _step3.value;

      var numFoundInArgs = 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _getIterator(exSet), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var opt = _step5.value;

          if (_lodash2['default'].has(args, opt) && args[opt]) {
            numFoundInArgs++;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (numFoundInArgs > 1) {
        throw new Error('You can\'t pass in more than one argument from the ' + ('set ' + JSON.stringify(exSet) + ', since they are ') + 'mutually exclusive');
      }
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

  var validations = {
    port: checkValidPort,
    callbackPort: checkValidPort,
    bootstrapPort: checkValidPort,
    selendroidPort: checkValidPort,
    chromedriverPort: checkValidPort,
    robotPort: checkValidPort,
    backendRetries: function backendRetries(r) {
      return r >= 0;
    }
  };

  var nonDefaultArgs = getNonDefaultArgs(parser, args);

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = _getIterator(_lodash2['default'].toPairs(validations)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2);

      var arg = _step4$value[0];
      var validator = _step4$value[1];

      if (_lodash2['default'].has(nonDefaultArgs, arg)) {
        if (!validator(args[arg], arg)) {
          throw new Error('Invalid argument for param ' + arg + ': ' + args[arg]);
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4['return']) {
        _iterator4['return']();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}

function validateTmpDir(tmpDir) {
  return _regeneratorRuntime.async(function validateTmpDir$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _appiumSupport.mkdirp)(tmpDir));

      case 3:
        context$1$0.next = 8;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);
        throw new Error('We could not ensure that the temp dir you specified ' + ('(' + tmpDir + ') exists. Please make sure it\'s writeable.'));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 5]]);
}

exports.getAppiumConfig = getAppiumConfig;
exports.validateServerArgs = validateServerArgs;
exports.checkNodeOk = checkNodeOk;
exports.showConfig = showConfig;
exports.warnNodeDeprecations = warnNodeDeprecations;
exports.validateTmpDir = validateTmpDir;
exports.getNonDefaultArgs = getNonDefaultArgs;
exports.getDeprecatedArgs = getDeprecatedArgs;
exports.getGitRev = getGitRev;
exports.checkValidPort = checkValidPort;
exports.APPIUM_VER = APPIUM_VER;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM5QixnQkFBTSxJQUFJLEtBQUssaUNBQStCLEdBQUcsVUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUcsQ0FBQztTQUNwRTtPQUNGO0tBQ0Y7Ozs7Ozs7Ozs7Ozs7OztDQUNGOztBQUVELFNBQWUsY0FBYyxDQUFFLE1BQU07Ozs7Ozt5Q0FFM0IsMkJBQU8sTUFBTSxDQUFDOzs7Ozs7Ozs7Y0FFZCxJQUFJLEtBQUssQ0FBQyxnRUFDSSxNQUFNLGlEQUE0QyxDQUFDOzs7Ozs7O0NBRTFFOztRQUVRLGVBQWUsR0FBZixlQUFlO1FBQUUsa0JBQWtCLEdBQWxCLGtCQUFrQjtRQUFFLFdBQVcsR0FBWCxXQUFXO1FBQUUsVUFBVSxHQUFWLFVBQVU7UUFDNUQsb0JBQW9CLEdBQXBCLG9CQUFvQjtRQUFFLGNBQWMsR0FBZCxjQUFjO1FBQUUsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQUN2RCxpQkFBaUIsR0FBakIsaUJBQWlCO1FBQUUsU0FBUyxHQUFULFNBQVM7UUFBRSxjQUFjLEdBQWQsY0FBYztRQUFFLFVBQVUsR0FBVixVQUFVIiwiZmlsZSI6ImxpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgbWtkaXJwLCBmcyB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcclxuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ3RlZW5fcHJvY2Vzcyc7XHJcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xyXG5pbXBvcnQgcGtnT2JqIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcclxuXHJcblxyXG5jb25zdCBBUFBJVU1fVkVSID0gcGtnT2JqLnZlcnNpb247XHJcblxyXG5mdW5jdGlvbiBnZXROb2RlVmVyc2lvbiAoKSB7XHJcbiAgLy8gZXhwZWN0IHY8bWFqb3I+LjxtaW5vcj4uPHBhdGNoPlxyXG4gIC8vIHdlIHdpbGwgcHVsbCBvdXQgYG1ham9yYCBhbmQgYG1pbm9yYFxyXG4gIGxldCB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9edihcXGQrKVxcLihcXGQrKS8pO1xyXG4gIHJldHVybiBbTnVtYmVyKHZlcnNpb25bMV0pLCBOdW1iZXIodmVyc2lvblsyXSldO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRHaXRSZXYgKCkge1xyXG4gIGxldCBjd2QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIik7XHJcbiAgbGV0IHJldiA9IG51bGw7XHJcbiAgdHJ5IHtcclxuICAgIGxldCB7c3Rkb3V0fSA9IGF3YWl0IGV4ZWMoXCJnaXRcIiwgW1wicmV2LXBhcnNlXCIsIFwiSEVBRFwiXSwge2N3ZH0pO1xyXG4gICAgcmV2ID0gc3Rkb3V0LnRyaW0oKTtcclxuICB9IGNhdGNoIChpZ24pIHt9XHJcbiAgcmV0dXJuIHJldjtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0QXBwaXVtQ29uZmlnICgpIHtcclxuICBsZXQgc3RhdCA9IGF3YWl0IGZzLnN0YXQocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJykpO1xyXG4gIGxldCBidWlsdCA9IHN0YXQubXRpbWUuZ2V0VGltZSgpO1xyXG4gIGxldCBjb25maWcgPSB7XHJcbiAgICAnZ2l0LXNoYSc6IGF3YWl0IGdldEdpdFJldigpLFxyXG4gICAgYnVpbHQsXHJcbiAgICB2ZXJzaW9uOiBBUFBJVU1fVkVSLFxyXG4gIH07XHJcbiAgcmV0dXJuIGNvbmZpZztcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tOb2RlT2sgKCkge1xyXG4gIGxldCBbbWFqb3IsIG1pbm9yXSA9IGdldE5vZGVWZXJzaW9uKCk7XHJcbiAgaWYgKG1ham9yIDwgNSkge1xyXG4gICAgbGV0IG1zZyA9IGBOb2RlIHZlcnNpb24gbXVzdCBiZSA+PSA1LiBDdXJyZW50bHkgJHttYWpvcn0uJHttaW5vcn1gO1xyXG4gICAgbG9nZ2VyLmVycm9yQW5kVGhyb3cobXNnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdhcm5Ob2RlRGVwcmVjYXRpb25zICgpIHtcclxuICBsZXQgW21ham9yXSA9IGdldE5vZGVWZXJzaW9uKCk7XHJcbiAgaWYgKG1ham9yIDwgNCkge1xyXG4gICAgbG9nZ2VyLndhcm4oXCJBcHBpdW0gc3VwcG9ydCBmb3IgdmVyc2lvbnMgb2Ygbm9kZSA8IDQgaGFzIGJlZW4gXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYSBmdXR1cmUgdmVyc2lvbi4gUGxlYXNlIFwiICtcclxuICAgICAgICAgICAgICAgIFwidXBncmFkZSFcIik7XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzaG93Q29uZmlnICgpIHtcclxuICBsZXQgY29uZmlnID0gYXdhaXQgZ2V0QXBwaXVtQ29uZmlnKCk7XHJcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROb25EZWZhdWx0QXJncyAocGFyc2VyLCBhcmdzKSB7XHJcbiAgbGV0IG5vbkRlZmF1bHRzID0ge307XHJcbiAgZm9yIChsZXQgcmF3QXJnIG9mIHBhcnNlci5yYXdBcmdzKSB7XHJcbiAgICBsZXQgYXJnID0gcmF3QXJnWzFdLmRlc3Q7XHJcbiAgICBpZiAoYXJnc1thcmddICYmIGFyZ3NbYXJnXSAhPT0gcmF3QXJnWzFdLmRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICBub25EZWZhdWx0c1thcmddID0gYXJnc1thcmddO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbm9uRGVmYXVsdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlcHJlY2F0ZWRBcmdzIChwYXJzZXIsIGFyZ3MpIHtcclxuICAvLyBnbyB0aHJvdWdoIHRoZSBzZXJ2ZXIgY29tbWFuZCBsaW5lIGFyZ3VtZW50cyBhbmQgZmlndXJlXHJcbiAgLy8gb3V0IHdoaWNoIG9mIHRoZSBvbmVzIHVzZWQgYXJlIGRlcHJlY2F0ZWRcclxuICBsZXQgZGVwcmVjYXRlZCA9IHt9O1xyXG4gIGZvciAobGV0IHJhd0FyZyBvZiBwYXJzZXIucmF3QXJncykge1xyXG4gICAgbGV0IGFyZyA9IHJhd0FyZ1sxXS5kZXN0O1xyXG4gICAgbGV0IGRlZmF1bHRWYWx1ZSA9IHJhd0FyZ1sxXS5kZWZhdWx0VmFsdWU7XHJcbiAgICBsZXQgaXNEZXByZWNhdGVkID0gISFyYXdBcmdbMV0uZGVwcmVjYXRlZEZvcjtcclxuICAgIGlmIChhcmdzW2FyZ10gJiYgYXJnc1thcmddICE9PSBkZWZhdWx0VmFsdWUgJiYgaXNEZXByZWNhdGVkKSB7XHJcbiAgICAgIGRlcHJlY2F0ZWRbcmF3QXJnWzBdXSA9IHJhd0FyZ1sxXS5kZXByZWNhdGVkRm9yO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZGVwcmVjYXRlZDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tWYWxpZFBvcnQgKHBvcnQsIHBvcnROYW1lKSB7XHJcbiAgaWYgKHBvcnQgPiAwICYmIHBvcnQgPCA2NTUzNikgcmV0dXJuIHRydWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY3VybHlcclxuICBsb2dnZXIuZXJyb3IoYFBvcnQgJyR7cG9ydE5hbWV9JyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIGFuZCBsZXNzIHRoYW4gNjU1MzYuIEN1cnJlbnRseSAke3BvcnR9YCk7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZVNlcnZlckFyZ3MgKHBhcnNlciwgYXJncykge1xyXG4gIC8vIGFyZ3VtZW50cyB0aGF0IGNhbm5vdCBib3RoIGJlIHNldFxyXG4gIGxldCBleGNsdXNpdmVzID0gW1xyXG4gICAgWydub1Jlc2V0JywgJ2Z1bGxSZXNldCddLFxyXG4gICAgWydpcGEnLCAnc2FmYXJpJ10sXHJcbiAgICBbJ2FwcCcsICdzYWZhcmknXSxcclxuICAgIFsnZm9yY2VJcGhvbmUnLCAnZm9yY2VJcGFkJ10sXHJcbiAgICBbJ2RldmljZU5hbWUnLCAnZGVmYXVsdERldmljZSddXHJcbiAgXTtcclxuXHJcbiAgZm9yIChsZXQgZXhTZXQgb2YgZXhjbHVzaXZlcykge1xyXG4gICAgbGV0IG51bUZvdW5kSW5BcmdzID0gMDtcclxuICAgIGZvciAobGV0IG9wdCBvZiBleFNldCkge1xyXG4gICAgICBpZiAoXy5oYXMoYXJncywgb3B0KSAmJiBhcmdzW29wdF0pIHtcclxuICAgICAgICBudW1Gb3VuZEluQXJncysrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobnVtRm91bmRJbkFyZ3MgPiAxKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgWW91IGNhbid0IHBhc3MgaW4gbW9yZSB0aGFuIG9uZSBhcmd1bWVudCBmcm9tIHRoZSBgICtcclxuICAgICAgICAgICAgICAgICAgICAgIGBzZXQgJHtKU09OLnN0cmluZ2lmeShleFNldCl9LCBzaW5jZSB0aGV5IGFyZSBgICtcclxuICAgICAgICAgICAgICAgICAgICAgIGBtdXR1YWxseSBleGNsdXNpdmVgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHZhbGlkYXRpb25zID0ge1xyXG4gICAgcG9ydDogY2hlY2tWYWxpZFBvcnQsXHJcbiAgICBjYWxsYmFja1BvcnQ6IGNoZWNrVmFsaWRQb3J0LFxyXG4gICAgYm9vdHN0cmFwUG9ydDogY2hlY2tWYWxpZFBvcnQsXHJcbiAgICBzZWxlbmRyb2lkUG9ydDogY2hlY2tWYWxpZFBvcnQsXHJcbiAgICBjaHJvbWVkcml2ZXJQb3J0OiBjaGVja1ZhbGlkUG9ydCxcclxuICAgIHJvYm90UG9ydDogY2hlY2tWYWxpZFBvcnQsXHJcbiAgICBiYWNrZW5kUmV0cmllczogKHIpID0+IHsgcmV0dXJuIHIgPj0gMDsgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG5vbkRlZmF1bHRBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcclxuXHJcbiAgZm9yIChsZXQgW2FyZywgdmFsaWRhdG9yXSBvZiBfLnRvUGFpcnModmFsaWRhdGlvbnMpKSB7XHJcbiAgICBpZiAoXy5oYXMobm9uRGVmYXVsdEFyZ3MsIGFyZykpIHtcclxuICAgICAgaWYgKCF2YWxpZGF0b3IoYXJnc1thcmddLCBhcmcpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFyZ3VtZW50IGZvciBwYXJhbSAke2FyZ306ICR7YXJnc1thcmddfWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVRtcERpciAodG1wRGlyKSB7XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IG1rZGlycCh0bXBEaXIpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgV2UgY291bGQgbm90IGVuc3VyZSB0aGF0IHRoZSB0ZW1wIGRpciB5b3Ugc3BlY2lmaWVkIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGAoJHt0bXBEaXJ9KSBleGlzdHMuIFBsZWFzZSBtYWtlIHN1cmUgaXQncyB3cml0ZWFibGUuYCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBnZXRBcHBpdW1Db25maWcsIHZhbGlkYXRlU2VydmVyQXJncywgY2hlY2tOb2RlT2ssIHNob3dDb25maWcsXHJcbiAgICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zLCB2YWxpZGF0ZVRtcERpciwgZ2V0Tm9uRGVmYXVsdEFyZ3MsXHJcbiAgICAgICAgIGdldERlcHJlY2F0ZWRBcmdzLCBnZXRHaXRSZXYsIGNoZWNrVmFsaWRQb3J0LCBBUFBJVU1fVkVSIH07XHJcbiJdLCJzb3VyY2VSb290IjoiLi5cXC4uIn0=
