/* */ 
'use strict';
var lang_1 = require("../../facade/lang");
function _abstract() {
  throw new lang_1.BaseException("This method is abstract");
}
var MessageBus = (function() {
  function MessageBus() {}
  MessageBus.prototype.from = function(channel) {
    throw _abstract();
  };
  MessageBus.prototype.to = function(channel) {
    throw _abstract();
  };
  return MessageBus;
})();
exports.MessageBus = MessageBus;
