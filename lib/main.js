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

server.post('/next', function (req, req) {
  if ( !rdio.isReady() ) {
    return res.write( error('Player not ready') );
  }

  if ( rdio.next() ) {
    res.write( success('next') );
  } else {
    res.write( error('Player not ready') );
  }

});

server.get('/volume', function (req, res) {
  if ( !rdio.isReady() ) {
    return res.write( error('Player not ready') );
  }

  // Process asynchronously from there on.
  res.processAsync();
  rdio.volume(function (volume) {
    res.write( success(volume) );
    res.finish();
  });
});

server.error(500, function (req, res) {

  console.log("500 error handler");

  res.setStatusLine(req.httpVersion, 500, "KO");
  return res.write( error("Internal error") );
});

// Start HTTP server
server.start(serverPort);
