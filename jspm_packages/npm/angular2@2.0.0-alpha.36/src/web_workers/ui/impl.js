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
var di_bindings_1 = require("./di_bindings");
var application_common_1 = require("../../core/application_common");
var di_1 = require("../../../di");
var browser_adapter_1 = require("../../dom/browser_adapter");
var wtf_init_1 = require("../../profile/wtf_init");
var setup_1 = require("./setup");
var render_compiler_1 = require("./render_compiler");
var renderer_1 = require("./renderer");
var xhr_impl_1 = require("./xhr_impl");
function bootstrapUICommon(bus) {
  browser_adapter_1.BrowserDomAdapter.makeCurrent();
  var zone = application_common_1.createNgZone();
  wtf_init_1.wtfInit();
  zone.run(function() {
    var injector = di_bindings_1.createInjector(zone, bus);
    injector.get(WebWorkerMain);
  });
}
exports.bootstrapUICommon = bootstrapUICommon;
var WebWorkerMain = (function() {
  function WebWorkerMain(renderCompiler, renderer, xhr, setup) {
    this.renderCompiler = renderCompiler;
    this.renderer = renderer;
    this.xhr = xhr;
    this.setup = setup;
  }
  WebWorkerMain = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [render_compiler_1.MessageBasedRenderCompiler, renderer_1.MessageBasedRenderer, xhr_impl_1.MessageBasedXHRImpl, setup_1.WebWorkerSetup])], WebWorkerMain);
  return WebWorkerMain;
})();
exports.WebWorkerMain = WebWorkerMain;
