/* */ 
'use strict';
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var view_ref_1 = require('./view_ref');
var ViewContainerRef = (function() {
  function ViewContainerRef(viewManager, element) {
    this.viewManager = viewManager;
    this.element = element;
  }
  ViewContainerRef.prototype._getViews = function() {
    var vc = view_ref_1.internalView(this.element.parentView).viewContainers[this.element.boundElementIndex];
    return lang_1.isPresent(vc) ? vc.views : [];
  };
  ViewContainerRef.prototype.clear = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  };
  ViewContainerRef.prototype.get = function(index) {
    return this._getViews()[index].ref;
  };
  Object.defineProperty(ViewContainerRef.prototype, "length", {
    get: function() {
      return this._getViews().length;
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef.prototype.createEmbeddedView = function(templateRef, index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length;
    return this.viewManager.createEmbeddedViewInContainer(this.element, index, templateRef);
  };
  ViewContainerRef.prototype.createHostView = function(protoViewRef, index, dynamicallyCreatedBindings) {
    if (protoViewRef === void 0) {
      protoViewRef = null;
    }
    if (index === void 0) {
      index = -1;
    }
    if (dynamicallyCreatedBindings === void 0) {
      dynamicallyCreatedBindings = null;
    }
    if (index == -1)
      index = this.length;
    return this.viewManager.createHostViewInContainer(this.element, index, protoViewRef, dynamicallyCreatedBindings);
  };
  ViewContainerRef.prototype.insert = function(viewRef, index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length;
    return this.viewManager.attachViewInContainer(this.element, index, viewRef);
  };
  ViewContainerRef.prototype.indexOf = function(viewRef) {
    return collection_1.ListWrapper.indexOf(this._getViews(), view_ref_1.internalView(viewRef));
  };
  ViewContainerRef.prototype.remove = function(index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length - 1;
    this.viewManager.destroyViewInContainer(this.element, index);
  };
  ViewContainerRef.prototype.detach = function(index) {
    if (index === void 0) {
      index = -1;
    }
    if (index == -1)
      index = this.length - 1;
    return this.viewManager.detachViewInContainer(this.element, index);
  };
  return ViewContainerRef;
})();
exports.ViewContainerRef = ViewContainerRef;
