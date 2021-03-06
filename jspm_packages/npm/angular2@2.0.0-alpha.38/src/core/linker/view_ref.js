/* */ 
'use strict';
var lang_1 = require('../facade/lang');
function internalView(viewRef) {
  return viewRef._view;
}
exports.internalView = internalView;
function internalProtoView(protoViewRef) {
  return lang_1.isPresent(protoViewRef) ? protoViewRef._protoView : null;
}
exports.internalProtoView = internalProtoView;
var ViewRef = (function() {
  function ViewRef(_view) {
    this._view = _view;
    this._changeDetectorRef = null;
  }
  Object.defineProperty(ViewRef.prototype, "render", {
    get: function() {
      return this._view.render;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef.prototype, "renderFragment", {
    get: function() {
      return this._view.renderFragment;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef.prototype, "changeDetectorRef", {
    get: function() {
      if (this._changeDetectorRef === null) {
        this._changeDetectorRef = this._view.changeDetector.ref;
      }
      return this._changeDetectorRef;
    },
    set: function(value) {
      throw "readonly";
    },
    enumerable: true,
    configurable: true
  });
  ViewRef.prototype.setLocal = function(variableName, value) {
    this._view.setLocal(variableName, value);
  };
  return ViewRef;
})();
exports.ViewRef = ViewRef;
var ProtoViewRef = (function() {
  function ProtoViewRef(_protoView) {
    this._protoView = _protoView;
  }
  return ProtoViewRef;
})();
exports.ProtoViewRef = ProtoViewRef;
