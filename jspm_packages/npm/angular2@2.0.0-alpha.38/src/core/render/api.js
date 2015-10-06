/* */ 
(function(process) {
  'use strict';
  (function(ViewType) {
    ViewType[ViewType["HOST"] = 0] = "HOST";
    ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
    ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
  })(exports.ViewType || (exports.ViewType = {}));
  var ViewType = exports.ViewType;
  var RenderProtoViewRef = (function() {
    function RenderProtoViewRef() {}
    return RenderProtoViewRef;
  })();
  exports.RenderProtoViewRef = RenderProtoViewRef;
  var RenderFragmentRef = (function() {
    function RenderFragmentRef() {}
    return RenderFragmentRef;
  })();
  exports.RenderFragmentRef = RenderFragmentRef;
  var RenderViewRef = (function() {
    function RenderViewRef() {}
    return RenderViewRef;
  })();
  exports.RenderViewRef = RenderViewRef;
  (function(ViewEncapsulation) {
    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
    ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
  })(exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
  var ViewEncapsulation = exports.ViewEncapsulation;
  exports.VIEW_ENCAPSULATION_VALUES = [ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None];
  var RenderViewWithFragments = (function() {
    function RenderViewWithFragments(viewRef, fragmentRefs) {
      this.viewRef = viewRef;
      this.fragmentRefs = fragmentRefs;
    }
    return RenderViewWithFragments;
  })();
  exports.RenderViewWithFragments = RenderViewWithFragments;
  var Renderer = (function() {
    function Renderer() {}
    ;
    Renderer.prototype.registerComponentTemplate = function(templateId, commands, styles) {};
    Renderer.prototype.createProtoView = function(cmds) {
      return null;
    };
    Renderer.prototype.createRootHostView = function(hostProtoViewRef, fragmentCount, hostElementSelector) {
      return null;
    };
    Renderer.prototype.createView = function(protoViewRef, fragmentCount) {
      return null;
    };
    Renderer.prototype.destroyView = function(viewRef) {};
    Renderer.prototype.attachFragmentAfterFragment = function(previousFragmentRef, fragmentRef) {};
    Renderer.prototype.attachFragmentAfterElement = function(elementRef, fragmentRef) {};
    Renderer.prototype.detachFragment = function(fragmentRef) {};
    Renderer.prototype.hydrateView = function(viewRef) {};
    Renderer.prototype.dehydrateView = function(viewRef) {};
    Renderer.prototype.getNativeElementSync = function(location) {
      return null;
    };
    Renderer.prototype.setElementProperty = function(location, propertyName, propertyValue) {};
    Renderer.prototype.setElementAttribute = function(location, attributeName, attributeValue) {};
    Renderer.prototype.setElementClass = function(location, className, isAdd) {};
    Renderer.prototype.setElementStyle = function(location, styleName, styleValue) {};
    Renderer.prototype.invokeElementMethod = function(location, methodName, args) {};
    Renderer.prototype.setText = function(viewRef, textNodeIndex, text) {};
    Renderer.prototype.setEventDispatcher = function(viewRef, dispatcher) {};
    return Renderer;
  })();
  exports.Renderer = Renderer;
})(require("process"));
