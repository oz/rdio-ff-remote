var server     = require('./http_server').server;
var rdio       = require('./rdio_web_app').rdioWebApp;
var serverPort = 8000;

// Web-app's status
var rdioStatus = {'ready': false };
rdio.on('ready',  function () { return rdioStatus.ready = true; });
rdio.on('closed', function () { return rdioStatus.ready = false; });

/*
 * FIXME Ugly HTTP helpers should get out
 */
var error = function error(msg) {
  return JSON.stringify({
    status: 'error',
    message: msg
  });
};

var success = function success(msg) {
  return JSON.stringify({
    status: 'success',
    message: msg
  });
};

/*
 * FIXME
 *   Set JSON Headers in responses.
 */
server.get('/', function (req, res) {
  return res.write( error('Nothing to see here.') );
});

server.get('/status', function (req, res) {
  var msg = rdioStatus.ready ? 'ready' : 'not ready';
  return res.write( success(msg) );
});

server.post('/play_pause', function(req, res) {
  if ( !rdioStatus.ready ) {
    return res.write( error('Player not ready') );
  }

  // XXX playPause's API will change.
  if ( rdio.playPause() ) {
    res.write( success('play_pause') );
  } else {
    res.write( error('Player not ready') );
  }
  return ;
});

// Start HTTP server
server.start(serverPort);