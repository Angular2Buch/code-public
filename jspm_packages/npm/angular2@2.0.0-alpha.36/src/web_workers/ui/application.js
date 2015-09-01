/* */ 
(function(process) {
  'use strict';
  var post_message_bus_1 = require("../shared/post_message_bus");
  var impl_1 = require("./impl");
  function bootstrap(uri) {
    var messageBus = spawnWebWorker(uri);
    impl_1.bootstrapUICommon(messageBus);
    return messageBus;
  }
  exports.bootstrap = bootstrap;
  function spawnWebWorker(uri) {
    var webWorker = new Worker(uri);
    var sink = new post_message_bus_1.PostMessageBusSink(webWorker);
    var source = new post_message_bus_1.PostMessageBusSource(webWorker);
    return new post_message_bus_1.PostMessageBus(sink, source);
  }
  exports.spawnWebWorker = spawnWebWorker;
})(require("process"));
