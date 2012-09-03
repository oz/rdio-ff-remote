/*
 * Rdio.com addon worker // Injected as a content-script.
 *
 * FIXME(s)
 * --------
 *
 * Note that this uses unsafeWindow to check for some globals hopefully defined
 * by Rdio's Javascript.  The worker being loaded only on rdio.com domains helps.
 *
 * The "transparent" window proxy does not allow access to Rdio's JS, making
 * it a little useless in this case... Suggestions?
 *
 * Also, encapsulate stuff.
 *
 */
(function (window, unsafe) {
  var $      = unsafe.jQuery;
  var player = null;          // Rdio's player object.

  if ( !$ ) { // not even jQuery...
    console.log("[worker] Not even jQuery...");
    return self.port.emit("noplayer");
  }

  // Wait for DOM ready if jQuery's present on the page.
  $(function() {
    if ( unsafe.R && unsafe.R.player ) {
      console.log("[worker] Found player.");
      player = unsafe.R.player;
      self.port.emit("ready");
    } else {
      console.log("[worker] Found no player.");
      self.port.emit("noplayer");
      player = null;
    }
  });

  self.port.on("playPause", function () {
    if ( null !== player ) {
      player.playPause();
    } else {
      console.log("Cannot playPause, player is not available.");
    }
  });
})(window, unsafeWindow);