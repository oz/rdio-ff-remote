/*
 * http_server.js is a wrapper around the ntHttpServer, to extend it (just a
 * little), and add a few methods w/o modifying the original server interface.
 *
 * It's minimalist, since I don't want to code yet-another HTTP router in JS,
 * and there is no need here.
 */

var nsHttpServer = require('httpd').nsHttpServer;
var srv = new nsHttpServer();

var server = {
  start: function (port) { srv.start(port); return server; },
  stop:  function (cb)   { srv.stop(cv); return server; },
  error: function (code, cb) { srv.registerErrorHandler(code, cb); }
};

// Add some HTTP verbs as direct methods on server object.
var httpVerbs = [ 'get', 'post', 'put', 'delete' ]; // etc.

httpVerbs.forEach(function (method) {
  server[method] = function (path, cb) {
    // nsHttpServer has a handy registerPathHandler method to match a path with
    // a callback.  Use it. :)
    srv.registerPathHandler(path, function (request, response) {

      // Skip uninteresting methods
      if ( request.method.toLowerCase() != method ) {
        return server;
      }

      cb.apply({}, [request, response]);

      return server;
    });
  };
});

exports.server = server;
