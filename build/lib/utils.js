'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function inspectObject(args) {
  function getValueArray(obj) {
    var indent = arguments.length <= 1 || arguments[1] === undefined ? '  ' : arguments[1];

    if (!_lodash2['default'].isObject(obj)) {
      return [obj];
    }

    var strArr = ['{'];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_lodash2['default'].toPairs(obj)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2);

        var arg = _step$value[0];
        var value = _step$value[1];

        if (!_lodash2['default'].isObject(value)) {
          strArr.push(indent + '  ' + arg + ': ' + value);
        } else {
          value = getValueArray(value, indent + '  ');
          strArr.push(indent + '  ' + arg + ': ' + value.shift());
          strArr.push.apply(strArr, _toConsumableArray(value));
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

    strArr.push(indent + '}');
    return strArr;
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(_lodash2['default'].toPairs(args)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var arg = _step2$value[0];
      var value = _step2$value[1];

      value = getValueArray(value);
      _logger2['default'].info('  ' + arg + ': ' + value.shift());
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(value), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var val = _step3.value;

          _logger2['default'].info(val);
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
}

exports.inspectObject = inspectObject;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3NCQUNILFVBQVU7Ozs7QUFHN0IsU0FBUyxhQUFhLENBQUUsSUFBSSxFQUFFO0FBQzVCLFdBQVMsYUFBYSxDQUFFLEdBQUcsRUFBaUI7UUFBZixNQUFNLHlEQUFHLElBQUk7O0FBQ3hDLFFBQUksQ0FBQyxvQkFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDcEIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2Q7O0FBRUQsUUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBQ25CLHdDQUF5QixvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDRHQUFFOzs7WUFBL0IsR0FBRztZQUFFLEtBQUs7O0FBQ2xCLFlBQUksQ0FBQyxvQkFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUksTUFBTSxVQUFLLEdBQUcsVUFBSyxLQUFLLENBQUcsQ0FBQztTQUM1QyxNQUFNO0FBQ0wsZUFBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUssTUFBTSxRQUFLLENBQUM7QUFDNUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUksTUFBTSxVQUFLLEdBQUcsVUFBSyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUcsQ0FBQztBQUNuRCxnQkFBTSxDQUFDLElBQUksTUFBQSxDQUFYLE1BQU0scUJBQVMsS0FBSyxFQUFDLENBQUM7U0FDdkI7T0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFVBQU0sQ0FBQyxJQUFJLENBQUksTUFBTSxPQUFJLENBQUM7QUFDMUIsV0FBTyxNQUFNLENBQUM7R0FDZjs7Ozs7O0FBQ0QsdUNBQXlCLG9CQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUhBQUU7OztVQUFoQyxHQUFHO1VBQUUsS0FBSzs7QUFDbEIsV0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QiwwQkFBTyxJQUFJLFFBQU0sR0FBRyxVQUFLLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBRyxDQUFDOzs7Ozs7QUFDMUMsMkNBQWdCLEtBQUssaUhBQUU7Y0FBZCxHQUFHOztBQUNWLDhCQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjs7Ozs7Ozs7Ozs7Ozs7O0tBQ0Y7Ozs7Ozs7Ozs7Ozs7OztDQUNGOztRQUVRLGFBQWEsR0FBYixhQUFhIiwiZmlsZSI6ImxpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGluc3BlY3RPYmplY3QgKGFyZ3MpIHtcclxuICBmdW5jdGlvbiBnZXRWYWx1ZUFycmF5IChvYmosIGluZGVudCA9ICcgICcpIHtcclxuICAgIGlmICghXy5pc09iamVjdChvYmopKSB7XHJcbiAgICAgIHJldHVybiBbb2JqXTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3RyQXJyID0gWyd7J107XHJcbiAgICBmb3IgKGxldCBbYXJnLCB2YWx1ZV0gb2YgXy50b1BhaXJzKG9iaikpIHtcclxuICAgICAgaWYgKCFfLmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgIHN0ckFyci5wdXNoKGAke2luZGVudH0gICR7YXJnfTogJHt2YWx1ZX1gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZSA9IGdldFZhbHVlQXJyYXkodmFsdWUsIGAke2luZGVudH0gIGApO1xyXG4gICAgICAgIHN0ckFyci5wdXNoKGAke2luZGVudH0gICR7YXJnfTogJHt2YWx1ZS5zaGlmdCgpfWApO1xyXG4gICAgICAgIHN0ckFyci5wdXNoKC4uLnZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RyQXJyLnB1c2goYCR7aW5kZW50fX1gKTtcclxuICAgIHJldHVybiBzdHJBcnI7XHJcbiAgfVxyXG4gIGZvciAobGV0IFthcmcsIHZhbHVlXSBvZiBfLnRvUGFpcnMoYXJncykpIHtcclxuICAgIHZhbHVlID0gZ2V0VmFsdWVBcnJheSh2YWx1ZSk7XHJcbiAgICBsb2dnZXIuaW5mbyhgICAke2FyZ306ICR7dmFsdWUuc2hpZnQoKX1gKTtcclxuICAgIGZvciAobGV0IHZhbCBvZiB2YWx1ZSkge1xyXG4gICAgICBsb2dnZXIuaW5mbyh2YWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgaW5zcGVjdE9iamVjdCB9O1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
