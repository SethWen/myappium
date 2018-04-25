// these are extra unit tests to ensure that appium is set up correctly for publishing

'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

_chai2['default'].use(_chaiAsPromised2['default']);
var expect = _chai2['default'].expect;

describe.skip('shrinkwrap checks', function () {
  it('shrinkwrap file should exist', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          require('../../npm-shrinkwrap.json');

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('shrinkwrap should not include fsevents', function callee$1$0() {
    var shrinkwrap, message;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          shrinkwrap = require('../../npm-shrinkwrap.json');

          expect(shrinkwrap.dependencies, 'no shrinkwrap file found. run `npm shrinkwrap`').to.exist;
          _lodash2['default'].values(shrinkwrap.dependencies).length.should.be.above(10);
          message = "'fsevents' entry found in shrinkwrap. It causes problems " + "on non-Mac systems. run `gulp fixShrinkwrap` and try again";

          expect(shrinkwrap.dependencies.fsevents, message).to.not.exist;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});

// fsevents is an optional dep that only works on Mac.
// if it's in shrinkwrap, non-Mac hosts won't be able to install appium
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Qvc2hyaW5rd3JhcC1zcGVjcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7Ozs4QkFDSSxrQkFBa0I7Ozs7QUFHN0Msa0JBQUssR0FBRyw2QkFBZ0IsQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxrQkFBSyxNQUFNLENBQUM7O0FBRTNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsWUFBTTtBQUN2QyxJQUFFLENBQUMsOEJBQThCLEVBQUU7Ozs7QUFDakMsaUJBQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOzs7Ozs7O0dBQ3RDLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFHdkMsVUFBVSxFQUdWLE9BQU87Ozs7QUFIUCxvQkFBVSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQzs7QUFDckQsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLGdEQUFnRCxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUMzRiw4QkFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6RCxpQkFBTyxHQUFHLDJEQUEyRCxHQUMzRCw0REFBNEQ7O0FBQzFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7R0FDaEUsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3Qvc2hyaW5rd3JhcC1zcGVjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRoZXNlIGFyZSBleHRyYSB1bml0IHRlc3RzIHRvIGVuc3VyZSB0aGF0IGFwcGl1bSBpcyBzZXQgdXAgY29ycmVjdGx5IGZvciBwdWJsaXNoaW5nXHJcblxyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcclxuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xyXG5cclxuXHJcbmNoYWkudXNlKGNoYWlBc1Byb21pc2VkKTtcclxuY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XHJcblxyXG5kZXNjcmliZS5za2lwKCdzaHJpbmt3cmFwIGNoZWNrcycsICgpID0+IHtcclxuICBpdCgnc2hyaW5rd3JhcCBmaWxlIHNob3VsZCBleGlzdCcsIGFzeW5jICgpID0+IHtcclxuICAgIHJlcXVpcmUoJy4uLy4uL25wbS1zaHJpbmt3cmFwLmpzb24nKTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ3Nocmlua3dyYXAgc2hvdWxkIG5vdCBpbmNsdWRlIGZzZXZlbnRzJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgLy8gZnNldmVudHMgaXMgYW4gb3B0aW9uYWwgZGVwIHRoYXQgb25seSB3b3JrcyBvbiBNYWMuXHJcbiAgICAvLyBpZiBpdCdzIGluIHNocmlua3dyYXAsIG5vbi1NYWMgaG9zdHMgd29uJ3QgYmUgYWJsZSB0byBpbnN0YWxsIGFwcGl1bVxyXG4gICAgbGV0IHNocmlua3dyYXAgPSByZXF1aXJlKCcuLi8uLi9ucG0tc2hyaW5rd3JhcC5qc29uJyk7XHJcbiAgICBleHBlY3Qoc2hyaW5rd3JhcC5kZXBlbmRlbmNpZXMsICdubyBzaHJpbmt3cmFwIGZpbGUgZm91bmQuIHJ1biBgbnBtIHNocmlua3dyYXBgJykudG8uZXhpc3Q7XHJcbiAgICBfLnZhbHVlcyhzaHJpbmt3cmFwLmRlcGVuZGVuY2llcykubGVuZ3RoLnNob3VsZC5iZS5hYm92ZSgxMCk7XHJcbiAgICBsZXQgbWVzc2FnZSA9IFwiJ2ZzZXZlbnRzJyBlbnRyeSBmb3VuZCBpbiBzaHJpbmt3cmFwLiBJdCBjYXVzZXMgcHJvYmxlbXMgXCIgK1xyXG4gICAgICAgICAgICAgICAgICBcIm9uIG5vbi1NYWMgc3lzdGVtcy4gcnVuIGBndWxwIGZpeFNocmlua3dyYXBgIGFuZCB0cnkgYWdhaW5cIjtcclxuICAgIGV4cGVjdChzaHJpbmt3cmFwLmRlcGVuZGVuY2llcy5mc2V2ZW50cywgbWVzc2FnZSkudG8ubm90LmV4aXN0O1xyXG4gIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIuLlxcLi4ifQ==
