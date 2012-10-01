/*
 * Rdio.com addon worker // Injected as a content-script.
 *
 * FIXME(s)
 * --------
 *
 * Note that this uses unsafeWindow to check for some globals normally
 * defined by Rdio's Javascript. The safer "transparent" window proxy
 * does not allow access to Rdio's JS, making it a little useless in
 * this case... Suggestions?
 *
 * Also, encapsulate stuff.
 *
 */
(function (window, unsafe) {
  var $      = unsafe.jQuery,
      port   = self.port,
      player = null           // Rdio's player object.
      ;

  // Wait for DOM ready if jQuery's present on the page.
  if ( !$ ) { return self.port.emit("noplayer"); }
  $(function() {
    if ( unsafe.R && unsafe.R.player ) {
      player = unsafe.R.player;
      port.emit('ready');
    } else {
      port.emit('noplayer');
      player = null;
    }
  });

  port.on('playPause', function () {
    if ( null !== player ) {
      player.playPause();
    } else {
      console.log('Cannot playPause, player is not available.');
    }
  });

  port.on('volume:get', function () {
    var volume;

    if ( null !== player ) {
      // Reduce float precision (hey, it's Javascript... :p)
      volume = parseInt(player.volume() * 100, 10) / 100;
      port.emit('volume:got', volume);
    } else {
      console.log("Cannot get volume, player is not available.");
    }
  });

  port.on('volume:update', function (value) {
    if ( null !== player ) {
      // XXX User Rdio's pubsub object to get the new value?
      player.volume(value);
      port.emit('volume:set', value);
    } else {
      console.log("Cannot update volume, player is not available.");
    }
  });
})(window, unsafeWindow);
