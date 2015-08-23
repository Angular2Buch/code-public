/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var application_common_1 = require("./application_common");
var di_1 = require("../../../di");
function bootstrapWebworker(appComponentType, componentInjectableBindings) {
  if (componentInjectableBindings === void 0) {
    componentInjectableBindings = null;
  }
  var bus = new WorkerMessageBus(new WorkerMessageBusSink(), new WorkerMessageBusSource());
  return application_common_1.bootstrapWebworkerCommon(appComponentType, bus, componentInjectableBindings);
}
exports.bootstrapWebworker = bootstrapWebworker;
var WorkerMessageBus = (function() {
  function WorkerMessageBus(sink, source) {
    this.sink = sink;
    this.source = source;
  }
  WorkerMessageBus = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [WorkerMessageBusSink, WorkerMessageBusSource])], WorkerMessageBus);
  return WorkerMessageBus;
})();
exports.WorkerMessageBus = WorkerMessageBus;
var WorkerMessageBusSink = (function() {
  function WorkerMessageBusSink() {}
  WorkerMessageBusSink.prototype.send = function(message) {
    postMessage(message, null);
  };
  return WorkerMessageBusSink;
})();
exports.WorkerMessageBusSink = WorkerMessageBusSink;
var WorkerMessageBusSource = (function() {
  function WorkerMessageBusSource() {
    this.numListeners = 0;
    this.listenerStore = new Map();
  }
  WorkerMessageBusSource.prototype.addListener = function(fn) {
    addEventListener("message", fn);
    this.listenerStore[++this.numListeners] = fn;
    return this.numListeners;
  };
  WorkerMessageBusSource.prototype.removeListener = function(index) {
    removeEventListener("message", this.listenerStore[index]);
    this.listenerStore.delete(index);
  };
  return WorkerMessageBusSource;
})();
exports.WorkerMessageBusSource = WorkerMessageBusSource;