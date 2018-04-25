'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var TEST_HOST = 'localhost';
var TEST_PORT = 4723;
var TEST_FAKE_APP = _path2['default'].resolve(__dirname, "..", "..", "node_modules", "appium-fake-driver", "test", "fixtures", "app.xml");

function initSession(caps) {
  var _this = this;

  var resolve = function resolve() {};
  var driver = undefined;
  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          driver = _wd2['default'].promiseChainRemote({ host: TEST_HOST, port: TEST_PORT });
          resolve(driver);
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap(driver.init(caps));

        case 4:
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
          return _regeneratorRuntime.awrap(driver.quit());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  return new _bluebird2['default'](function (_resolve) {
    resolve = _resolve;
  });
}

exports.initSession = initSession;
exports.TEST_FAKE_APP = TEST_FAKE_APP;
exports.TEST_HOST = TEST_HOST;
exports.TEST_PORT = TEST_PORT;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUFpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7d0JBQ0wsVUFBVTs7OztBQUV4QixJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDOUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLElBQU0sYUFBYSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQ3JDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQ3hDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QyxTQUFTLFdBQVcsQ0FBRSxJQUFJLEVBQUU7OztBQUMxQixNQUFJLE9BQU8sR0FBRyxtQkFBTSxFQUFFLENBQUM7QUFDdkIsTUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLFFBQU0sQ0FBQzs7OztBQUNMLGdCQUFNLEdBQUcsZ0JBQUcsa0JBQWtCLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ25FLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7OzJDQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7Ozs7O0dBQ3hCLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQzs7Ozs7MkNBQ0UsTUFBTSxDQUFDLElBQUksRUFBRTs7Ozs7OztHQUNwQixDQUFDLENBQUM7QUFDSCxTQUFPLDBCQUFNLFVBQUMsUUFBUSxFQUFLO0FBQ3pCLFdBQU8sR0FBRyxRQUFRLENBQUM7R0FDcEIsQ0FBQyxDQUFDO0NBQ0o7O1FBRVEsV0FBVyxHQUFYLFdBQVc7UUFBRSxhQUFhLEdBQWIsYUFBYTtRQUFFLFNBQVMsR0FBVCxTQUFTO1FBQUUsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoidGVzdC9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB3ZCBmcm9tICd3ZCc7XHJcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcclxuXHJcbmNvbnN0IFRFU1RfSE9TVCA9ICdsb2NhbGhvc3QnO1xyXG5jb25zdCBURVNUX1BPUlQgPSA0NzIzO1xyXG5jb25zdCBURVNUX0ZBS0VfQVBQID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwibm9kZV9tb2R1bGVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHBpdW0tZmFrZS1kcml2ZXJcIiwgXCJ0ZXN0XCIsIFwiZml4dHVyZXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFwcC54bWxcIik7XHJcblxyXG5mdW5jdGlvbiBpbml0U2Vzc2lvbiAoY2Fwcykge1xyXG4gIGxldCByZXNvbHZlID0gKCkgPT4ge307XHJcbiAgbGV0IGRyaXZlcjtcclxuICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xyXG4gICAgZHJpdmVyID0gd2QucHJvbWlzZUNoYWluUmVtb3RlKHtob3N0OiBURVNUX0hPU1QsIHBvcnQ6IFRFU1RfUE9SVH0pO1xyXG4gICAgcmVzb2x2ZShkcml2ZXIpO1xyXG4gICAgYXdhaXQgZHJpdmVyLmluaXQoY2Fwcyk7XHJcbiAgfSk7XHJcbiAgYWZ0ZXIoYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgZHJpdmVyLnF1aXQoKTtcclxuICB9KTtcclxuICByZXR1cm4gbmV3IEIoKF9yZXNvbHZlKSA9PiB7XHJcbiAgICByZXNvbHZlID0gX3Jlc29sdmU7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IGluaXRTZXNzaW9uLCBURVNUX0ZBS0VfQVBQLCBURVNUX0hPU1QsIFRFU1RfUE9SVCB9O1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
