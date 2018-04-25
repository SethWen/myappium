require('source-map-support').install();

'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _libParser = require('../lib/parser');

var _libParser2 = _interopRequireDefault(_libParser);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var should = _chai2['default'].should();

describe('Parser', function () {
  var p = (0, _libParser2['default'])();
  p.debug = true; // throw instead of exit on error; pass as option instead?
  it('should return an arg parser', function () {
    should.exist(p.parseArgs);
    p.parseArgs([]).should.have.property('port');
  });
  it('should keep the raw server flags array', function () {
    should.exist(p.rawArgs);
  });
  it('should have help for every arg', function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(p.rawArgs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arg = _step.value;

        arg[1].should.have.property('help');
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
  });
  it('should throw an error with unknown argument', function () {
    (function () {
      p.parseArgs(['--apple']);
    }).should['throw']();
  });
  it('should parse default capabilities correctly from a string', function () {
    var defaultCapabilities = { a: 'b' };
    var args = p.parseArgs(['--default-capabilities', JSON.stringify(defaultCapabilities)]);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
  it('should parse default capabilities correctly from a file', function () {
    var defaultCapabilities = { a: 'b' };
    var args = p.parseArgs(['--default-capabilities', 'test/fixtures/caps.json']);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
  it('should throw an error with invalid arg to default capabilities', function () {
    (function () {
      p.parseArgs(['-dc', '42']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'false']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'null']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'does/not/exist.json']);
    }).should['throw']();
  });
  it('should parse args that are caps into default capabilities', function () {
    var defaultCapabilities = { localizableStringsDir: '/my/dir' };
    var args = p.parseArgs(['--localizable-strings-dir', '/my/dir']);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7S0FBQyxDQUFBLENBQUUsTUFBTSxTQUFNLEVBQUUsQ0FBQztHQUN2RSxDQUFDLENBQUM7QUFDSCxJQUFFLENBQUMsMkRBQTJELEVBQUUsWUFBTTtBQUNwRSxRQUFJLG1CQUFtQixHQUFHLEVBQUMscUJBQXFCLEVBQUUsU0FBUyxFQUFDLENBQUM7QUFDN0QsUUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDakUsUUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUMxRCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9wYXJzZXItc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGU6bW9jaGFcclxuXHJcbmltcG9ydCBnZXRQYXJzZXIgZnJvbSAnLi4vbGliL3BhcnNlcic7XHJcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xyXG5cclxuY29uc3Qgc2hvdWxkID0gY2hhaS5zaG91bGQoKTtcclxuXHJcbmRlc2NyaWJlKCdQYXJzZXInLCAoKSA9PiB7XHJcbiAgbGV0IHAgPSBnZXRQYXJzZXIoKTtcclxuICBwLmRlYnVnID0gdHJ1ZTsgLy8gdGhyb3cgaW5zdGVhZCBvZiBleGl0IG9uIGVycm9yOyBwYXNzIGFzIG9wdGlvbiBpbnN0ZWFkP1xyXG4gIGl0KCdzaG91bGQgcmV0dXJuIGFuIGFyZyBwYXJzZXInLCAoKSA9PiB7XHJcbiAgICBzaG91bGQuZXhpc3QocC5wYXJzZUFyZ3MpO1xyXG4gICAgcC5wYXJzZUFyZ3MoW10pLnNob3VsZC5oYXZlLnByb3BlcnR5KCdwb3J0Jyk7XHJcbiAgfSk7XHJcbiAgaXQoJ3Nob3VsZCBrZWVwIHRoZSByYXcgc2VydmVyIGZsYWdzIGFycmF5JywgKCkgPT4ge1xyXG4gICAgc2hvdWxkLmV4aXN0KHAucmF3QXJncyk7XHJcbiAgfSk7XHJcbiAgaXQoJ3Nob3VsZCBoYXZlIGhlbHAgZm9yIGV2ZXJ5IGFyZycsICgpID0+IHtcclxuICAgIGZvciAobGV0IGFyZyBvZiBwLnJhd0FyZ3MpIHtcclxuICAgICAgYXJnWzFdLnNob3VsZC5oYXZlLnByb3BlcnR5KCdoZWxwJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciB3aXRoIHVua25vd24gYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAoKCkgPT4ge3AucGFyc2VBcmdzKFsnLS1hcHBsZSddKTt9KS5zaG91bGQudGhyb3coKTtcclxuICB9KTtcclxuICBpdCgnc2hvdWxkIHBhcnNlIGRlZmF1bHQgY2FwYWJpbGl0aWVzIGNvcnJlY3RseSBmcm9tIGEgc3RyaW5nJywgKCkgPT4ge1xyXG4gICAgbGV0IGRlZmF1bHRDYXBhYmlsaXRpZXMgPSB7YTogJ2InfTtcclxuICAgIGxldCBhcmdzID0gcC5wYXJzZUFyZ3MoWyctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRlZmF1bHRDYXBhYmlsaXRpZXMpXSk7XHJcbiAgICBhcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMuc2hvdWxkLmVxbChkZWZhdWx0Q2FwYWJpbGl0aWVzKTtcclxuICB9KTtcclxuICBpdCgnc2hvdWxkIHBhcnNlIGRlZmF1bHQgY2FwYWJpbGl0aWVzIGNvcnJlY3RseSBmcm9tIGEgZmlsZScsICgpID0+IHtcclxuICAgIGxldCBkZWZhdWx0Q2FwYWJpbGl0aWVzID0ge2E6ICdiJ307XHJcbiAgICBsZXQgYXJncyA9IHAucGFyc2VBcmdzKFsnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXN0L2ZpeHR1cmVzL2NhcHMuanNvbiddKTtcclxuICAgIGFyZ3MuZGVmYXVsdENhcGFiaWxpdGllcy5zaG91bGQuZXFsKGRlZmF1bHRDYXBhYmlsaXRpZXMpO1xyXG4gIH0pO1xyXG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3Igd2l0aCBpbnZhbGlkIGFyZyB0byBkZWZhdWx0IGNhcGFiaWxpdGllcycsICgpID0+IHtcclxuICAgICgoKSA9PiB7cC5wYXJzZUFyZ3MoWyctZGMnLCAnNDInXSk7fSkuc2hvdWxkLnRocm93KCk7XHJcbiAgICAoKCkgPT4ge3AucGFyc2VBcmdzKFsnLWRjJywgJ2ZhbHNlJ10pO30pLnNob3VsZC50aHJvdygpO1xyXG4gICAgKCgpID0+IHtwLnBhcnNlQXJncyhbJy1kYycsICdudWxsJ10pO30pLnNob3VsZC50aHJvdygpO1xyXG4gICAgKCgpID0+IHtwLnBhcnNlQXJncyhbJy1kYycsICdkb2VzL25vdC9leGlzdC5qc29uJ10pO30pLnNob3VsZC50aHJvdygpO1xyXG4gIH0pO1xyXG4gIGl0KCdzaG91bGQgcGFyc2UgYXJncyB0aGF0IGFyZSBjYXBzIGludG8gZGVmYXVsdCBjYXBhYmlsaXRpZXMnLCAoKSA9PiB7XHJcbiAgICBsZXQgZGVmYXVsdENhcGFiaWxpdGllcyA9IHtsb2NhbGl6YWJsZVN0cmluZ3NEaXI6ICcvbXkvZGlyJ307XHJcbiAgICBsZXQgYXJncyA9IHAucGFyc2VBcmdzKFsnLS1sb2NhbGl6YWJsZS1zdHJpbmdzLWRpcicsICcvbXkvZGlyJ10pO1xyXG4gICAgYXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzLnNob3VsZC5lcWwoZGVmYXVsdENhcGFiaWxpdGllcyk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii4uXFwuLiJ9
