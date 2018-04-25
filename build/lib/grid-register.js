'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _appiumSupport = require('appium-support');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function registerNode(configFile, addr, port) {
  var data;
  return _regeneratorRuntime.async(function registerNode$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        data = undefined;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.readFile(configFile, 'utf-8'));

      case 4:
        data = context$1$0.sent;
        context$1$0.next = 11;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].error('Unable to load node configuration file to register with grid: ' + context$1$0.t0.message);
        return context$1$0.abrupt('return');

      case 11:
        if (data) {
          context$1$0.next = 14;
          break;
        }

        _logger2['default'].error('No data found in the node configuration file to send to the grid');
        return context$1$0.abrupt('return');

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(postRequest(data, addr, port));

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 7]]);
}

function registerToGrid(options_post, jsonObject) {
  var response, logMessage;
  return _regeneratorRuntime.async(function registerToGrid$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _requestPromise2['default'])(options_post));

      case 3:
        response = context$1$0.sent;

        if (!(response === undefined || response.statusCode !== 200)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error('Request failed');

      case 6:
        logMessage = 'Appium successfully registered with the grid on ' + jsonObject.configuration.hubHost + ':' + jsonObject.configuration.hubPort;

        _logger2['default'].debug(logMessage);
        context$1$0.next = 13;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].error('Request to register with grid was unsuccessful: ' + context$1$0.t0.message);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 10]]);
}

function postRequest(data, addr, port) {
  var jsonObject, configuration, property, post_headers, post_options, registerCycleTime;
  return _regeneratorRuntime.async(function postRequest$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        jsonObject = undefined;

        try {
          jsonObject = JSON.parse(data);
        } catch (err) {
          _logger2['default'].errorAndThrow('Syntax error in node configuration file: ' + err.message);
        }

        // Move Selenium 3 configuration properties to configuration object
        if (!jsonObject.hasOwnProperty('configuration')) {
          configuration = {};

          for (property in jsonObject) {
            if (jsonObject.hasOwnProperty(property) && property !== 'capabilities') {
              configuration[property] = jsonObject[property];
              delete jsonObject[property];
            }
          }
          jsonObject.configuration = configuration;
        }

        // if the node config does not have the appium/webdriver url, host, and port,
        // automatically add it based on how appium was initialized
        // otherwise, we will take whatever the user setup
        // because we will always set localhost/127.0.0.1. this won't work if your
        // node and grid aren't in the same place
        if (!jsonObject.configuration.url || !jsonObject.configuration.host || !jsonObject.configuration.port) {
          jsonObject.configuration.url = 'http://' + addr + ':' + port + '/wd/hub';
          jsonObject.configuration.host = addr;
          jsonObject.configuration.port = port;
        }
        // if the node config does not have id automatically add it
        if (!jsonObject.configuration.id) {
          jsonObject.configuration.id = 'http://' + jsonObject.configuration.host + ':' + jsonObject.configuration.port;
        }

        // re-serialize the configuration with the auto populated data
        data = JSON.stringify(jsonObject);

        // prepare the header
        post_headers = {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        };
        post_options = {
          url: 'http://' + jsonObject.configuration.hubHost + ':' + jsonObject.configuration.hubPort + '/grid/register',
          method: 'POST',
          body: data,
          headers: post_headers,
          resolveWithFullResponse: true // return the full response, not just the body
        };

        if (!(jsonObject.configuration.register !== true)) {
          context$1$0.next = 11;
          break;
        }

        _logger2['default'].debug('No registration sent (' + jsonObject.configuration.register + ' = false)');
        return context$1$0.abrupt('return');

      case 11:
        registerCycleTime = jsonObject.configuration.registerCycle;

        if (registerCycleTime !== null && registerCycleTime > 0) {
          (function () {
            // initiate a new Thread
            var first = true;
            _logger2['default'].debug('Starting auto register thread for grid. Will try to register every ' + registerCycleTime + ' ms.');
            setInterval(function callee$2$0() {
              var isRegistered;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    if (!(first !== true)) {
                      context$3$0.next = 9;
                      break;
                    }

                    context$3$0.next = 3;
                    return _regeneratorRuntime.awrap(isAlreadyRegistered(jsonObject));

                  case 3:
                    isRegistered = context$3$0.sent;

                    if (!(isRegistered !== null && isRegistered !== true)) {
                      context$3$0.next = 7;
                      break;
                    }

                    context$3$0.next = 7;
                    return _regeneratorRuntime.awrap(registerToGrid(post_options, jsonObject));

                  case 7:
                    context$3$0.next = 12;
                    break;

                  case 9:
                    first = false;
                    context$3$0.next = 12;
                    return _regeneratorRuntime.awrap(registerToGrid(post_options, jsonObject));

                  case 12:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, this);
            }, registerCycleTime);
          })();
        }

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function isAlreadyRegistered(jsonObject) {
  var id, response, responseData;
  return _regeneratorRuntime.async(function isAlreadyRegistered$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        id = jsonObject.configuration.id;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap((0, _requestPromise2['default'])({
          uri: 'http://' + jsonObject.configuration.hubHost + ':' + jsonObject.configuration.hubPort + '/grid/api/proxy?id=' + id,
          method: 'GET',
          timeout: 10000,
          resolveWithFullResponse: true // return the full response, not just the body
        }));

      case 4:
        response = context$1$0.sent;

        if (!(response === undefined || response.statusCode !== 200)) {
          context$1$0.next = 7;
          break;
        }

        throw new Error('Request failed');

      case 7:
        responseData = JSON.parse(response.body);

        if (responseData.success !== true) {
          // if register fail, print the debug msg
          _logger2['default'].debug('Grid registration error: ' + responseData.msg);
        }
        return context$1$0.abrupt('return', responseData.success);

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].debug('Hub down or not responding: ' + context$1$0.t0.message);

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 12]]);
}

exports['default'] = registerNode;
module.exports = exports['default'];

// Check presence of data before posting  it to the selenium grid

// parse json to get hub host and port

// the post options

// make the http POST to the grid for registration

//check if node is already registered
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ncmlkLXJlZ2lzdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBQW9CLGlCQUFpQjs7Ozs2QkFDbEIsZ0JBQWdCOztzQkFDaEIsVUFBVTs7OztBQUc3QixTQUFlLFlBQVksQ0FBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUk7TUFDN0MsSUFBSTs7OztBQUFKLFlBQUk7Ozt5Q0FFTyxrQkFBRyxRQUFRLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQzs7O0FBQTdDLFlBQUk7Ozs7Ozs7O0FBRUosNEJBQU8sS0FBSyxvRUFBa0UsZUFBSSxPQUFPLENBQUcsQ0FBQzs7OztZQUsxRixJQUFJOzs7OztBQUNQLDRCQUFPLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDOzs7Ozt5Q0FHN0UsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDOzs7Ozs7O0NBQ3BDOztBQUVELFNBQWUsY0FBYyxDQUFFLFlBQVksRUFBRSxVQUFVO01BRS9DLFFBQVEsRUFJUixVQUFVOzs7Ozs7eUNBSk8saUNBQVEsWUFBWSxDQUFDOzs7QUFBdEMsZ0JBQVE7O2NBQ1IsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQTs7Ozs7Y0FDakQsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUM7OztBQUUvQixrQkFBVSx3REFBc0QsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLFNBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPOztBQUN4SSw0QkFBTyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7Ozs7O0FBRXpCLDRCQUFPLEtBQUssc0RBQW9ELGVBQUksT0FBTyxDQUFHLENBQUM7Ozs7Ozs7Q0FFbEY7O0FBRUQsU0FBZSxXQUFXLENBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO01BRXRDLFVBQVUsRUFTUixhQUFhLEVBQ1IsUUFBUSxFQTRCZixZQUFZLEVBS1osWUFBWSxFQWFaLGlCQUFp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QUUsaUJBQWlCLENBQUMsQ0FBQzs7U0FDdkI7Ozs7Ozs7Q0FDRjs7QUFFRCxTQUFlLG1CQUFtQixDQUFFLFVBQVU7TUFFeEMsRUFBRSxFQUVBLFFBQVEsRUFTUixZQUFZOzs7O0FBWGQsVUFBRSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRTs7O3lDQUViLGlDQUFRO0FBQzNCLGFBQUcsY0FBWSxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sU0FBSSxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sMkJBQXNCLEVBQUUsQUFBRTtBQUM3RyxnQkFBTSxFQUFJLEtBQUs7QUFDZixpQkFBTyxFQUFHLEtBQUs7QUFDZixpQ0FBdUIsRUFBRSxJQUFJO1NBQzlCLENBQUM7OztBQUxFLGdCQUFROztjQU1SLFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUE7Ozs7O2NBQ2pELElBQUksS0FBSyxrQkFBa0I7OztBQUUvQixvQkFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs7QUFDNUMsWUFBSSxZQUFZLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRTs7QUFFakMsOEJBQU8sS0FBSywrQkFBNkIsWUFBWSxDQUFDLEdBQUcsQ0FBRyxDQUFDO1NBQzlEOzRDQUNNLFlBQVksQ0FBQyxPQUFPOzs7Ozs7QUFFM0IsNEJBQU8sS0FBSyxrQ0FBZ0MsZUFBSSxPQUFPLENBQUcsQ0FBQzs7Ozs7OztDQUU5RDs7cUJBR2MsWUFBWSIsImZpbGUiOiJsaWIvZ3JpZC1yZWdpc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XHJcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xyXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiByZWdpc3Rlck5vZGUgKGNvbmZpZ0ZpbGUsIGFkZHIsIHBvcnQpIHtcclxuICBsZXQgZGF0YTtcclxuICB0cnkge1xyXG4gICAgZGF0YSA9IGF3YWl0IGZzLnJlYWRGaWxlKGNvbmZpZ0ZpbGUsICd1dGYtOCcpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgbG9nZ2VyLmVycm9yKGBVbmFibGUgdG8gbG9hZCBub2RlIGNvbmZpZ3VyYXRpb24gZmlsZSB0byByZWdpc3RlciB3aXRoIGdyaWQ6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBwcmVzZW5jZSBvZiBkYXRhIGJlZm9yZSBwb3N0aW5nICBpdCB0byB0aGUgc2VsZW5pdW0gZ3JpZFxyXG4gIGlmICghZGF0YSkge1xyXG4gICAgbG9nZ2VyLmVycm9yKCdObyBkYXRhIGZvdW5kIGluIHRoZSBub2RlIGNvbmZpZ3VyYXRpb24gZmlsZSB0byBzZW5kIHRvIHRoZSBncmlkJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGF3YWl0IHBvc3RSZXF1ZXN0KGRhdGEsIGFkZHIsIHBvcnQpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiByZWdpc3RlclRvR3JpZCAob3B0aW9uc19wb3N0LCBqc29uT2JqZWN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3Qob3B0aW9uc19wb3N0KTtcclxuICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVlc3QgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgICBsZXQgbG9nTWVzc2FnZSA9IGBBcHBpdW0gc3VjY2Vzc2Z1bGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ3JpZCBvbiAke2pzb25PYmplY3QuY29uZmlndXJhdGlvbi5odWJIb3N0fToke2pzb25PYmplY3QuY29uZmlndXJhdGlvbi5odWJQb3J0fWA7XHJcbiAgICBsb2dnZXIuZGVidWcobG9nTWVzc2FnZSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBsb2dnZXIuZXJyb3IoYFJlcXVlc3QgdG8gcmVnaXN0ZXIgd2l0aCBncmlkIHdhcyB1bnN1Y2Nlc3NmdWw6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwb3N0UmVxdWVzdCAoZGF0YSwgYWRkciwgcG9ydCkge1xyXG4gIC8vIHBhcnNlIGpzb24gdG8gZ2V0IGh1YiBob3N0IGFuZCBwb3J0XHJcbiAgbGV0IGpzb25PYmplY3Q7XHJcbiAgdHJ5IHtcclxuICAgIGpzb25PYmplY3QgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgbG9nZ2VyLmVycm9yQW5kVGhyb3coYFN5bnRheCBlcnJvciBpbiBub2RlIGNvbmZpZ3VyYXRpb24gZmlsZTogJHtlcnIubWVzc2FnZX1gKTtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgU2VsZW5pdW0gMyBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgdG8gY29uZmlndXJhdGlvbiBvYmplY3RcclxuICBpZiAoIWpzb25PYmplY3QuaGFzT3duUHJvcGVydHkoJ2NvbmZpZ3VyYXRpb24nKSkge1xyXG4gICAgbGV0IGNvbmZpZ3VyYXRpb24gPSB7fTtcclxuICAgIGZvciAobGV0IHByb3BlcnR5IGluIGpzb25PYmplY3QpIHtcclxuICAgICAgaWYgKGpzb25PYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmIHByb3BlcnR5ICE9PSAnY2FwYWJpbGl0aWVzJykge1xyXG4gICAgICAgIGNvbmZpZ3VyYXRpb25bcHJvcGVydHldID0ganNvbk9iamVjdFtwcm9wZXJ0eV07XHJcbiAgICAgICAgZGVsZXRlIGpzb25PYmplY3RbcHJvcGVydHldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgdGhlIG5vZGUgY29uZmlnIGRvZXMgbm90IGhhdmUgdGhlIGFwcGl1bS93ZWJkcml2ZXIgdXJsLCBob3N0LCBhbmQgcG9ydCxcclxuICAvLyBhdXRvbWF0aWNhbGx5IGFkZCBpdCBiYXNlZCBvbiBob3cgYXBwaXVtIHdhcyBpbml0aWFsaXplZFxyXG4gIC8vIG90aGVyd2lzZSwgd2Ugd2lsbCB0YWtlIHdoYXRldmVyIHRoZSB1c2VyIHNldHVwXHJcbiAgLy8gYmVjYXVzZSB3ZSB3aWxsIGFsd2F5cyBzZXQgbG9jYWxob3N0LzEyNy4wLjAuMS4gdGhpcyB3b24ndCB3b3JrIGlmIHlvdXJcclxuICAvLyBub2RlIGFuZCBncmlkIGFyZW4ndCBpbiB0aGUgc2FtZSBwbGFjZVxyXG4gIGlmICghanNvbk9iamVjdC5jb25maWd1cmF0aW9uLnVybCB8fCAhanNvbk9iamVjdC5jb25maWd1cmF0aW9uLmhvc3QgfHwgIWpzb25PYmplY3QuY29uZmlndXJhdGlvbi5wb3J0KSB7XHJcbiAgICBqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24udXJsID0gYGh0dHA6Ly8ke2FkZHJ9OiR7cG9ydH0vd2QvaHViYDtcclxuICAgIGpzb25PYmplY3QuY29uZmlndXJhdGlvbi5ob3N0ID0gYWRkcjtcclxuICAgIGpzb25PYmplY3QuY29uZmlndXJhdGlvbi5wb3J0ID0gcG9ydDtcclxuICB9XHJcbiAgLy8gaWYgdGhlIG5vZGUgY29uZmlnIGRvZXMgbm90IGhhdmUgaWQgYXV0b21hdGljYWxseSBhZGQgaXRcclxuICBpZiAoIWpzb25PYmplY3QuY29uZmlndXJhdGlvbi5pZCkge1xyXG4gICAganNvbk9iamVjdC5jb25maWd1cmF0aW9uLmlkID0gYGh0dHA6Ly8ke2pzb25PYmplY3QuY29uZmlndXJhdGlvbi5ob3N0fToke2pzb25PYmplY3QuY29uZmlndXJhdGlvbi5wb3J0fWA7XHJcbiAgfVxyXG5cclxuICAvLyByZS1zZXJpYWxpemUgdGhlIGNvbmZpZ3VyYXRpb24gd2l0aCB0aGUgYXV0byBwb3B1bGF0ZWQgZGF0YVxyXG4gIGRhdGEgPSBKU09OLnN0cmluZ2lmeShqc29uT2JqZWN0KTtcclxuXHJcbiAgLy8gcHJlcGFyZSB0aGUgaGVhZGVyXHJcbiAgbGV0IHBvc3RfaGVhZGVycyA9IHtcclxuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAnQ29udGVudC1MZW5ndGgnOiBkYXRhLmxlbmd0aFxyXG4gIH07XHJcbiAgLy8gdGhlIHBvc3Qgb3B0aW9uc1xyXG4gIGxldCBwb3N0X29wdGlvbnMgPSB7XHJcbiAgICB1cmw6IGBodHRwOi8vJHtqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24uaHViSG9zdH06JHtqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24uaHViUG9ydH0vZ3JpZC9yZWdpc3RlcmAsXHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGJvZHk6IGRhdGEsXHJcbiAgICBoZWFkZXJzOiBwb3N0X2hlYWRlcnMsXHJcbiAgICByZXNvbHZlV2l0aEZ1bGxSZXNwb25zZTogdHJ1ZSAvLyByZXR1cm4gdGhlIGZ1bGwgcmVzcG9uc2UsIG5vdCBqdXN0IHRoZSBib2R5XHJcbiAgfTtcclxuXHJcbiAgaWYgKGpzb25PYmplY3QuY29uZmlndXJhdGlvbi5yZWdpc3RlciAhPT0gdHJ1ZSkge1xyXG4gICAgbG9nZ2VyLmRlYnVnKGBObyByZWdpc3RyYXRpb24gc2VudCAoJHtqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24ucmVnaXN0ZXJ9ID0gZmFsc2UpYCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBsZXQgcmVnaXN0ZXJDeWNsZVRpbWUgPSBqc29uT2JqZWN0LmNvbmZpZ3VyYXRpb24ucmVnaXN0ZXJDeWNsZTtcclxuICBpZiAocmVnaXN0ZXJDeWNsZVRpbWUgIT09IG51bGwgJiYgcmVnaXN0ZXJDeWNsZVRpbWUgPiAwKSB7XHJcbiAgICAvLyBpbml0aWF0ZSBhIG5ldyBUaHJlYWRcclxuICAgIGxldCBmaXJzdCA9IHRydWU7XHJcbiAgICBsb2dnZXIuZGVidWcoYFN0YXJ0aW5nIGF1dG8gcmVnaXN0ZXIgdGhyZWFkIGZvciBncmlkLiBXaWxsIHRyeSB0byByZWdpc3RlciBldmVyeSAke3JlZ2lzdGVyQ3ljbGVUaW1lfSBtcy5gKTtcclxuICAgIHNldEludGVydmFsKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGZpcnN0ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IGlzUmVnaXN0ZXJlZCA9IGF3YWl0IGlzQWxyZWFkeVJlZ2lzdGVyZWQoanNvbk9iamVjdCk7XHJcbiAgICAgICAgaWYgKGlzUmVnaXN0ZXJlZCAhPT0gbnVsbCAmJiBpc1JlZ2lzdGVyZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgIC8vIG1ha2UgdGhlIGh0dHAgUE9TVCB0byB0aGUgZ3JpZCBmb3IgcmVnaXN0cmF0aW9uXHJcbiAgICAgICAgICBhd2FpdCByZWdpc3RlclRvR3JpZChwb3N0X29wdGlvbnMsIGpzb25PYmplY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmaXJzdCA9IGZhbHNlO1xyXG4gICAgICAgIGF3YWl0IHJlZ2lzdGVyVG9HcmlkKHBvc3Rfb3B0aW9ucywganNvbk9iamVjdCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHJlZ2lzdGVyQ3ljbGVUaW1lKTtcclxuICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGlzQWxyZWFkeVJlZ2lzdGVyZWQgKGpzb25PYmplY3QpIHtcclxuICAvL2NoZWNrIGlmIG5vZGUgaXMgYWxyZWFkeSByZWdpc3RlcmVkXHJcbiAgbGV0IGlkID0ganNvbk9iamVjdC5jb25maWd1cmF0aW9uLmlkO1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgICAgdXJpOiBgaHR0cDovLyR7anNvbk9iamVjdC5jb25maWd1cmF0aW9uLmh1Ykhvc3R9OiR7anNvbk9iamVjdC5jb25maWd1cmF0aW9uLmh1YlBvcnR9L2dyaWQvYXBpL3Byb3h5P2lkPSR7aWR9YCxcclxuICAgICAgbWV0aG9kICA6ICdHRVQnLFxyXG4gICAgICB0aW1lb3V0IDogMTAwMDAsXHJcbiAgICAgIHJlc29sdmVXaXRoRnVsbFJlc3BvbnNlOiB0cnVlIC8vIHJldHVybiB0aGUgZnVsbCByZXNwb25zZSwgbm90IGp1c3QgdGhlIGJvZHlcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQgfHwgcmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWVzdCBmYWlsZWRgKTtcclxuICAgIH1cclxuICAgIGxldCByZXNwb25zZURhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgaWYgKHJlc3BvbnNlRGF0YS5zdWNjZXNzICE9PSB0cnVlKSB7XHJcbiAgICAgIC8vIGlmIHJlZ2lzdGVyIGZhaWwsIHByaW50IHRoZSBkZWJ1ZyBtc2dcclxuICAgICAgbG9nZ2VyLmRlYnVnKGBHcmlkIHJlZ2lzdHJhdGlvbiBlcnJvcjogJHtyZXNwb25zZURhdGEubXNnfWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlRGF0YS5zdWNjZXNzO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgbG9nZ2VyLmRlYnVnKGBIdWIgZG93biBvciBub3QgcmVzcG9uZGluZzogJHtlcnIubWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCByZWdpc3Rlck5vZGU7XHJcbiJdLCJzb3VyY2VSb290IjoiLi5cXC4uIn0=
