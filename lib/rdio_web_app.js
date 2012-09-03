const rdioTab          = require('rdio_tab').rdioTab;
const { EventEmitter } = require('events');
var data               = require('self').data;

var RdioWebApp = EventEmitter.compose({
  constructor: function (rdioTab) {
    this.state = {
      playerReady: false
    };
    this._tabEvents(rdioTab);
  },

  /*
   * FIXME should accept a callback triggered through worker confirmation.
   * @return {Boolean}
   */
  playPause: function () {
    if ( ! this.state.playerReady ) {
      return false;
    }
    this.worker.port.emit("playPause");

    return true;
  },

  /*
   * Initialize browser's content-script when tabs on rdio.com are loaded.
   */
  _tabEvents: function (rdioTab) {
    var self = this;

    rdioTab.on("closed", function (tab) { self.setUnavailable(); });
    rdioTab.on("ready", function (tab) {
      console.debug("Loaded: " + tab.url);
      self.playerReady = false;
      self._attachWorker(tab);
    });

    return self;
  },

  /*
   * Attach worker's content-script on tag, and bind worker-events
   *
   * @param {Tab} browser tab
   */
  _attachWorker: function (tab) {
    var self = this;

    // Attaching content-script
    this.worker = tab.attach({
      contentScriptWhen: 'end',
      contentScriptFile: data.url('worker.js')
    });

    // Check for player on the latest attached tab...
    this.worker.port.on('ready',    function () { self.setAvailable() });
    this.worker.port.on('noplayer', function () { self.setUnavailable(); });

    return this;
  },

  // Update add-on state, player unavailable
  setUnavailable: function () {
    this.state.playerReady = false;
    this._emit('closed');

    return this;
  },

  // Update add-on state, player available
  setAvailable: function() {
    this.state.playerReady = true;
    this._emit('ready');

    return this;
  }
});

exports.rdioWebApp = new RdioWebApp(rdioTab);