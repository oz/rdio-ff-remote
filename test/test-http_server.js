var server = require("http_server").server;

exports.test_interface = function (assert) {
  ['get', 'put', 'post'].forEach(function (method) {
    assert.ok(server[method]  !== undefined, "server has a '"+method+"' method");
  });
};

require("test").run(exports);