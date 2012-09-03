var server     = require('./http_server').server;
var rdio       = require('./rdio_web_app').rdioWebApp;
var serverPort = 8000;

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
  var msg = rdio.isReady() ? 'ready' : 'not ready';
  return res.write( success(msg) );
});

server.post('/play_pause', function (req, res) {
  if ( !rdio.isReady() ) {
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

server.get('/volume', function (req, res) {
  if ( !rdio.isReady() ) {
    return res.write( error('Player not ready') );
  }
  rdio.volume(function (volume) {
    return res.write( success(volume) );
  });

  return ;
});

// Start HTTP server
server.start(serverPort);