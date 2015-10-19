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
var di_1 = require('../di');
var compiler_1 = require('./compiler');
var lang_1 = require('../facade/lang');
var view_manager_1 = require('./view_manager');
var ComponentRef = (function() {
  function ComponentRef(location, instance, componentType, injector, _dispose) {
    this._dispose = _dispose;
    this.location = location;
    this.instance = instance;
    this.componentType = componentType;
    this.injector = injector;
  }
  Object.defineProperty(ComponentRef.prototype, "hostView", {
    get: function() {
      return this.location.parentView;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentRef.prototype, "hostComponentType", {
    get: function() {
      return this.componentType;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentRef.prototype, "hostComponent", {
    get: function() {
      return this.instance;
    },
    enumerable: true,
    configurable: true
  });
  ComponentRef.prototype.dispose = function() {
    this._dispose();
  };
  return ComponentRef;
})();
exports.ComponentRef = ComponentRef;
var DynamicComponentLoader = (function() {
  function DynamicComponentLoader(_compiler, _viewManager) {
    this._compiler = _compiler;
    this._viewManager = _viewManager;
  }
  DynamicComponentLoader.prototype.loadAsRoot = function(type, overrideSelector, injector, onDispose) {
    var _this = this;
    return this._compiler.compileInHost(type).then(function(hostProtoViewRef) {
      var hostViewRef = _this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector);
      var newLocation = _this._viewManager.getHostElement(hostViewRef);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        _this._viewManager.destroyRootHostView(hostViewRef);
        if (lang_1.isPresent(onDispose)) {
          onDispose();
        }
      };
      return new ComponentRef(newLocation, component, type, injector, dispose);
    });
  };
  DynamicComponentLoader.prototype.loadIntoLocation = function(type, hostLocation, anchorName, bindings) {
    if (bindings === void 0) {
      bindings = null;
    }
    return this.loadNextToLocation(type, this._viewManager.getNamedElementInComponentView(hostLocation, anchorName), bindings);
  };
  DynamicComponentLoader.prototype.loadNextToLocation = function(type, location, bindings) {
    var _this = this;
    if (bindings === void 0) {
      bindings = null;
    }
    return this._compiler.compileInHost(type).then(function(hostProtoViewRef) {
      var viewContainer = _this._viewManager.getViewContainer(location);
      var hostViewRef = viewContainer.createHostView(hostProtoViewRef, viewContainer.length, bindings);
      var newLocation = _this._viewManager.getHostElement(hostViewRef);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        var index = viewContainer.indexOf(hostViewRef);
        if (index !== -1) {
          viewContainer.remove(index);
        }
      };
      return new ComponentRef(newLocation, component, type, null, dispose);
    });
  };
  DynamicComponentLoader = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [compiler_1.Compiler, view_manager_1.AppViewManager])], DynamicComponentLoader);
  return DynamicComponentLoader;
})();
exports.DynamicComponentLoader = DynamicComponentLoader;
