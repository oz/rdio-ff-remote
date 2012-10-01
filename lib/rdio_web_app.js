const rdioTab          = require('rdio_tab').rdioTab;
const { EventEmitter } = require('events');
var data               = require('self').data;

var RdioWebApp = EventEmitter.compose({
  constructor: function constructor (rdioTab) {
    this.state = {
      playerReady: false
    };
    this._tabEvents(rdioTab);
    return this;
  },

  /*
   * Wether we're ready to accept commands
   * @return {Boolean}
   */
  isReady: function isReady () {
    return this.state.playerReady;
  },

  /*
   * FIXME should accept a callback triggered through worker confirmation.
   * @return {Boolean}
   */
  playPause: function playPause () {
    if ( ! this.state.playerReady ) {
      return false;
    }
    this.worker.port.emit('playPause');

    return true;
  },

  volume: function (value, cb) {
    // Get volume
    if ( 'function' == typeof value ) {
      this.worker.port.once('volume:got', value);
      this.worker.port.emit('volume:get');
    // Set volume
    } else {
      if ( cb ) {
        this.worker.port.once('volume:set', cb);
      }
      this.worker.port.emit('volume:update', value);
    }
    return this;
  },

  /*
   * Initialize browser's content-script when tabs on rdio.com are loaded.
   */
  _tabEvents: function _tabEvents (rdioTab) {
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
  _attachWorker: function _attachWorker (tab) {
    var self = this;

    // Attaching content-script
    this.worker = tab.attach({
      contentScriptWhen: 'end',
      contentScriptFile: data.url('worker.js')
    });

    // Check for player on the latest attached tab...
    this.worker.port.on('ready',    function () { return self.setAvailable(); });
    this.worker.port.on('noplayer', function () { return self.setUnavailable(); });

    return this;
  },

  // Update add-on state, player unavailable
  setUnavailable: function setUnavailable () {
    this.state.playerReady = false;
    this._emit('closed');

    return this;
  },

  // Update add-on state, player available
  setAvailable: function setAvailable () {
    this.state.playerReady = true;
    this._emit('ready');

    return this;
  }
});

exports.rdioWebApp = new RdioWebApp(rdioTab);
