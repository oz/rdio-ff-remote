/*
 * RdioTab is an EventEmitter, emitting 'ready', and 'closed' events
 * respetively when:
 *   - a tab which URL matches rdio.com's is opened, and ready (DOM loaded...)
 *   - a tab which URL matches rdio.com's is closed.
 */

const tabs = require('tabs');
const { EventEmitter } = require('events');
const rdioURLRegex = /https?:\/\/(www\.)?rdio\.com\/?/;
const RdioTab = EventEmitter.compose({
  constructor: function() {
    var self = this;

    tabs.on('ready', function (tab) {
      if ( tab.url.match(rdioURLRegex) ) {
        self._emit('ready', tab);
      }
    });
    tabs.on('close', function (tab) {
      if ( tab.url.match(rdioURLRegex) ) {
        self._emit('closed', tab);
      }
    });
  } 
});
exports.rdioTab = new RdioTab();