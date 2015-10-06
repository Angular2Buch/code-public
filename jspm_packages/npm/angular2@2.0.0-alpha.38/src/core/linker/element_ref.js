/* */ 
'use strict';
var exceptions_1 = require("../facade/exceptions");
var ElementRef = (function() {
  function ElementRef(parentView, boundElementIndex, _renderer) {
    this._renderer = _renderer;
    this.parentView = parentView;
    this.boundElementIndex = boundElementIndex;
  }
  Object.defineProperty(ElementRef.prototype, "renderView", {
    get: function() {
      return this.parentView.render;
    },
    set: function(viewRef) {
      throw new exceptions_1.BaseException('Abstract setter');
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ElementRef.prototype, "nativeElement", {
    get: function() {
      return this._renderer.getNativeElementSync(this);
    },
    enumerable: true,
    configurable: true
  });
  return ElementRef;
})();
exports.ElementRef = ElementRef;
