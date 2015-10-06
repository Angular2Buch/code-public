/* */ 
'use strict';
var di_1 = require("../../core/di");
var forms_1 = require("../../core/forms");
var lang_1 = require("../../core/facade/lang");
var exceptions_1 = require("../../core/facade/exceptions");
var async_1 = require("../../core/facade/async");
var xhr_1 = require("../../core/compiler/xhr");
var xhr_impl_1 = require("./xhr_impl");
var app_root_url_1 = require("../../core/compiler/app_root_url");
var renderer_1 = require("./renderer");
var api_1 = require("../../core/render/api");
var client_message_broker_1 = require("../shared/client_message_broker");
var message_bus_1 = require("../shared/message_bus");
var application_ref_1 = require("../../core/application_ref");
var serializer_1 = require("../shared/serializer");
var api_2 = require("../shared/api");
var render_proto_view_ref_store_1 = require("../shared/render_proto_view_ref_store");
var render_view_with_fragments_store_1 = require("../shared/render_view_with_fragments_store");
var async_2 = require("../../core/facade/async");
var messaging_api_1 = require("../shared/messaging_api");
var event_dispatcher_1 = require("./event_dispatcher");
var compiler_1 = require("../../core/compiler/compiler");
function platform(bindings) {
  return application_ref_1.platformCommon(bindings);
}
exports.platform = platform;
var PrintLogger = (function() {
  function PrintLogger() {
    this.log = lang_1.print;
    this.logError = lang_1.print;
    this.logGroup = lang_1.print;
  }
  PrintLogger.prototype.logGroupEnd = function() {};
  return PrintLogger;
})();
function webWorkerBindings(appComponentType, bus, initData) {
  return [compiler_1.compilerBindings(), serializer_1.Serializer, di_1.bind(message_bus_1.MessageBus).toValue(bus), client_message_broker_1.ClientMessageBrokerFactory, renderer_1.WebWorkerRenderer, di_1.bind(api_1.Renderer).toAlias(renderer_1.WebWorkerRenderer), di_1.bind(api_2.ON_WEB_WORKER).toValue(true), render_view_with_fragments_store_1.RenderViewWithFragmentsStore, render_proto_view_ref_store_1.RenderProtoViewRefStore, di_1.bind(exceptions_1.ExceptionHandler).toFactory(function() {
    return new exceptions_1.ExceptionHandler(new PrintLogger());
  }, []), xhr_impl_1.WebWorkerXHRImpl, di_1.bind(xhr_1.XHR).toAlias(xhr_impl_1.WebWorkerXHRImpl), di_1.bind(app_root_url_1.AppRootUrl).toValue(new app_root_url_1.AppRootUrl(initData['rootUrl'])), event_dispatcher_1.WebWorkerEventDispatcher, forms_1.FORM_BINDINGS];
}
function bootstrapWebWorkerCommon(appComponentType, bus, appBindings) {
  if (appBindings === void 0) {
    appBindings = null;
  }
  var bootstrapProcess = async_1.PromiseWrapper.completer();
  var appPromise = platform().asyncApplication(function(zone) {
    bus.attachToZone(zone);
    bus.initChannel(messaging_api_1.SETUP_CHANNEL, false);
    var subscription;
    var emitter = bus.from(messaging_api_1.SETUP_CHANNEL);
    subscription = async_2.ObservableWrapper.subscribe(emitter, function(message) {
      var bindings = [application_ref_1.applicationCommonBindings(), webWorkerBindings(appComponentType, bus, message)];
      if (lang_1.isPresent(appBindings)) {
        bindings.push(appBindings);
      }
      bootstrapProcess.resolve(bindings);
      async_2.ObservableWrapper.dispose(subscription);
    });
    async_2.ObservableWrapper.callNext(bus.to(messaging_api_1.SETUP_CHANNEL), "ready");
    return bootstrapProcess.promise;
  });
  return async_1.PromiseWrapper.then(appPromise, function(app) {
    return app.bootstrap(appComponentType);
  });
}
exports.bootstrapWebWorkerCommon = bootstrapWebWorkerCommon;
