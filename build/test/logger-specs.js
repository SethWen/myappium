require('source-map-support').install();

'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _libLogsink = require('../lib/logsink');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _appiumSupport = require('appium-support');

// temporarily turn on logging to stdio, so we can catch and query
var forceLogs = process.env._FORCE_LOGS;
process.env._FORCE_LOGS = 1;
var log = _appiumSupport.logger.getLogger('Appium');

describe('logging', function () {
  var stderrSpy = undefined;
  var stdoutSpy = undefined;
  beforeEach(function () {
    stderrSpy = _sinon2['default'].spy(process.stderr, 'write');
    stdoutSpy = _sinon2['default'].spy(process.stdout, 'write');
    (0, _libLogsink.clear)();
  });
  afterEach(function () {
    stderrSpy.restore();
    stdoutSpy.restore();
  });
  after(function () {
    process.env._FORCE_LOGS = forceLogs;
  });

  var errorMsg = 'some error';
  var warnMsg = 'some warning';
  var debugMsg = 'some debug';

  function doLogging() {
    log.error(errorMsg);
    log.warn(warnMsg);
    log.debug(debugMsg);
  }

  it('should send error, info and debug when loglevel is debug', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'debug' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(2);
          stdoutSpy.args[0][0].should.include(warnMsg);
          stdoutSpy.args[1][0].should.include(debugMsg);

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should send error and info when loglevel is info', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'info' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(1);
          stdoutSpy.args[0][0].should.include(warnMsg);

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should send error when loglevel is error', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'error' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(0);

        case 6:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvbG9nZ2VyLXNwZWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRTJELGdCQUFnQjs7cUJBQ3pELE9BQU87Ozs7NkJBQ0YsZ0JBQWdCOzs7QUFJdkMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLElBQUksR0FBRyxHQUFHLHNCQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3hCLE1BQUksU0FBUyxZQUFBLENBQUM7QUFDZCxNQUFJLFNBQVMsWUFBQSxDQUFDO0FBQ2QsWUFBVSxDQUFDLFlBQU07QUFDZixhQUFTLEdBQUcsbUJBQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0MsYUFBUyxHQUFHLG1CQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLDRCQUFjLENBQUM7R0FDaEIsQ0FBQyxDQUFDO0FBQ0gsV0FBUyxDQUFDLFlBQU07QUFDZCxhQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsYUFBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3JCLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQyxZQUFNO0FBQ1YsV0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0dBQ3JDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUM7QUFDOUIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0FBQy9CLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQzs7QUFFOUIsV0FBUyxTQUFTLEdBQUk7QUFDcEIsT0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQixPQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xCLE9BQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7O0FBRUQsSUFBRSxDQUFDLDBEQUEwRCxFQUFFOzs7OzsyQ0FDdkQsc0JBQVksRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7Ozs7QUFFdEMsbUJBQVMsRUFBRSxDQUFDOztBQUVaLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUMsbUJBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7R0FDL0MsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLGtEQUFrRCxFQUFFOzs7OzsyQ0FDL0Msc0JBQVksRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7Ozs7QUFFckMsbUJBQVMsRUFBRSxDQUFDOztBQUVaLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUMsbUJBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7O0dBQzlDLENBQUMsQ0FBQztBQUNILElBQUUsQ0FBQywwQ0FBMEMsRUFBRTs7Ozs7MkNBQ3ZDLHNCQUFZLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDOzs7O0FBRXRDLG1CQUFTLEVBQUUsQ0FBQzs7QUFFWixtQkFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlDLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7R0FDckMsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3QvbG9nZ2VyLXNwZWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHJhbnNwaWxlOm1vY2hhXHJcblxyXG5pbXBvcnQgeyBpbml0IGFzIGxvZ3NpbmtJbml0LCBjbGVhciBhcyBsb2dzaW5rQ2xlYXIgfSBmcm9tICcuLi9saWIvbG9nc2luayc7XHJcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcclxuXHJcblxyXG4vLyB0ZW1wb3JhcmlseSB0dXJuIG9uIGxvZ2dpbmcgdG8gc3RkaW8sIHNvIHdlIGNhbiBjYXRjaCBhbmQgcXVlcnlcclxubGV0IGZvcmNlTG9ncyA9IHByb2Nlc3MuZW52Ll9GT1JDRV9MT0dTO1xyXG5wcm9jZXNzLmVudi5fRk9SQ0VfTE9HUyA9IDE7XHJcbmxldCBsb2cgPSBsb2dnZXIuZ2V0TG9nZ2VyKCdBcHBpdW0nKTtcclxuXHJcbmRlc2NyaWJlKCdsb2dnaW5nJywgKCkgPT4ge1xyXG4gIGxldCBzdGRlcnJTcHk7XHJcbiAgbGV0IHN0ZG91dFNweTtcclxuICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgIHN0ZGVyclNweSA9IHNpbm9uLnNweShwcm9jZXNzLnN0ZGVyciwgJ3dyaXRlJyk7XHJcbiAgICBzdGRvdXRTcHkgPSBzaW5vbi5zcHkocHJvY2Vzcy5zdGRvdXQsICd3cml0ZScpO1xyXG4gICAgbG9nc2lua0NsZWFyKCk7XHJcbiAgfSk7XHJcbiAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgIHN0ZGVyclNweS5yZXN0b3JlKCk7XHJcbiAgICBzdGRvdXRTcHkucmVzdG9yZSgpO1xyXG4gIH0pO1xyXG4gIGFmdGVyKCgpID0+IHtcclxuICAgIHByb2Nlc3MuZW52Ll9GT1JDRV9MT0dTID0gZm9yY2VMb2dzO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBlcnJvck1zZyA9ICdzb21lIGVycm9yJztcclxuICBjb25zdCB3YXJuTXNnID0gJ3NvbWUgd2FybmluZyc7XHJcbiAgY29uc3QgZGVidWdNc2cgPSAnc29tZSBkZWJ1Zyc7XHJcblxyXG4gIGZ1bmN0aW9uIGRvTG9nZ2luZyAoKSB7XHJcbiAgICBsb2cuZXJyb3IoZXJyb3JNc2cpO1xyXG4gICAgbG9nLndhcm4od2Fybk1zZyk7XHJcbiAgICBsb2cuZGVidWcoZGVidWdNc2cpO1xyXG4gIH1cclxuXHJcbiAgaXQoJ3Nob3VsZCBzZW5kIGVycm9yLCBpbmZvIGFuZCBkZWJ1ZyB3aGVuIGxvZ2xldmVsIGlzIGRlYnVnJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgbG9nc2lua0luaXQoe2xvZ2xldmVsOiAnZGVidWcnfSk7XHJcblxyXG4gICAgZG9Mb2dnaW5nKCk7XHJcblxyXG4gICAgc3RkZXJyU3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMSk7XHJcbiAgICBzdGRlcnJTcHkuYXJnc1swXVswXS5zaG91bGQuaW5jbHVkZShlcnJvck1zZyk7XHJcblxyXG4gICAgc3Rkb3V0U3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMik7XHJcbiAgICBzdGRvdXRTcHkuYXJnc1swXVswXS5zaG91bGQuaW5jbHVkZSh3YXJuTXNnKTtcclxuICAgIHN0ZG91dFNweS5hcmdzWzFdWzBdLnNob3VsZC5pbmNsdWRlKGRlYnVnTXNnKTtcclxuICB9KTtcclxuICBpdCgnc2hvdWxkIHNlbmQgZXJyb3IgYW5kIGluZm8gd2hlbiBsb2dsZXZlbCBpcyBpbmZvJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgbG9nc2lua0luaXQoe2xvZ2xldmVsOiAnaW5mbyd9KTtcclxuXHJcbiAgICBkb0xvZ2dpbmcoKTtcclxuXHJcbiAgICBzdGRlcnJTcHkuY2FsbENvdW50LnNob3VsZC5lcXVhbCgxKTtcclxuICAgIHN0ZGVyclNweS5hcmdzWzBdWzBdLnNob3VsZC5pbmNsdWRlKGVycm9yTXNnKTtcclxuXHJcbiAgICBzdGRvdXRTcHkuY2FsbENvdW50LnNob3VsZC5lcXVhbCgxKTtcclxuICAgIHN0ZG91dFNweS5hcmdzWzBdWzBdLnNob3VsZC5pbmNsdWRlKHdhcm5Nc2cpO1xyXG4gIH0pO1xyXG4gIGl0KCdzaG91bGQgc2VuZCBlcnJvciB3aGVuIGxvZ2xldmVsIGlzIGVycm9yJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgbG9nc2lua0luaXQoe2xvZ2xldmVsOiAnZXJyb3InfSk7XHJcblxyXG4gICAgZG9Mb2dnaW5nKCk7XHJcblxyXG4gICAgc3RkZXJyU3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMSk7XHJcbiAgICBzdGRlcnJTcHkuYXJnc1swXVswXS5zaG91bGQuaW5jbHVkZShlcnJvck1zZyk7XHJcblxyXG4gICAgc3Rkb3V0U3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMCk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
