/* */ 
(function(process) {
  'use strict';
  var impl_1 = require("./impl");
  function bootstrap(uri) {
    var messageBus = spawnWorker(uri);
    impl_1.bootstrapUICommon(messageBus);
  }
  exports.bootstrap = bootstrap;
  function spawnWorker(uri) {
    var worker = new Worker(uri);
    return new UIMessageBus(new UIMessageBusSink(worker), new UIMessageBusSource(worker));
  }
  exports.spawnWorker = spawnWorker;
  var UIMessageBus = (function() {
    function UIMessageBus(sink, source) {
      this.sink = sink;
      this.source = source;
    }
    return UIMessageBus;
  })();
  exports.UIMessageBus = UIMessageBus;
  var UIMessageBusSink = (function() {
    function UIMessageBusSink(_worker) {
      this._worker = _worker;
    }
    UIMessageBusSink.prototype.send = function(message) {
      this._worker.postMessage(message);
    };
    return UIMessageBusSink;
  })();
  exports.UIMessageBusSink = UIMessageBusSink;
  var UIMessageBusSource = (function() {
    function UIMessageBusSource(_worker) {
      this._worker = _worker;
      this._listenerStore = new Map();
      this._numListeners = 0;
    }
    UIMessageBusSource.prototype.addListener = function(fn) {
      this._worker.addEventListener("message", fn);
      this._listenerStore[++this._numListeners] = fn;
      return this._numListeners;
    };
    UIMessageBusSource.prototype.removeListener = function(index) {
      removeEventListener("message", this._listenerStore[index]);
      this._listenerStore.delete(index);
    };
    return UIMessageBusSource;
  })();
  exports.UIMessageBusSource = UIMessageBusSource;
})(require("process"));
