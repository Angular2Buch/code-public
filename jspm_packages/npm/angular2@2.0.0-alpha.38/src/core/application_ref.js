/* */ 
(function(process) {
  'use strict';
  var ng_zone_1 = require("./zone/ng_zone");
  var lang_1 = require("./facade/lang");
  var di_1 = require("./di");
  var application_tokens_1 = require("./application_tokens");
  var async_1 = require("./facade/async");
  var collection_1 = require("./facade/collection");
  var reflection_1 = require("./reflection/reflection");
  var testability_1 = require("./testability/testability");
  var dynamic_component_loader_1 = require("./linker/dynamic_component_loader");
  var exceptions_1 = require("./facade/exceptions");
  var dom_adapter_1 = require("./dom/dom_adapter");
  var view_ref_1 = require("./linker/view_ref");
  var life_cycle_1 = require("./life_cycle/life_cycle");
  var change_detection_1 = require("./change_detection/change_detection");
  var view_pool_1 = require("./linker/view_pool");
  var view_manager_1 = require("./linker/view_manager");
  var view_manager_utils_1 = require("./linker/view_manager_utils");
  var view_listener_1 = require("./linker/view_listener");
  var proto_view_factory_1 = require("./linker/proto_view_factory");
  var pipes_1 = require("./pipes");
  var view_resolver_1 = require("./linker/view_resolver");
  var directive_resolver_1 = require("./linker/directive_resolver");
  var pipe_resolver_1 = require("./linker/pipe_resolver");
  var compiler_1 = require("./linker/compiler");
  function platformBindings() {
    return [di_1.bind(reflection_1.Reflector).toValue(reflection_1.reflector), testability_1.TestabilityRegistry];
  }
  exports.platformBindings = platformBindings;
  function _componentBindings(appComponentType) {
    return [di_1.bind(application_tokens_1.APP_COMPONENT).toValue(appComponentType), di_1.bind(application_tokens_1.APP_COMPONENT_REF_PROMISE).toFactory(function(dynamicComponentLoader, injector) {
      return dynamicComponentLoader.loadAsRoot(appComponentType, null, injector).then(function(componentRef) {
        if (lang_1.isPresent(componentRef.location.nativeElement)) {
          injector.get(testability_1.TestabilityRegistry).registerApplication(componentRef.location.nativeElement, injector.get(testability_1.Testability));
        }
        return componentRef;
      });
    }, [dynamic_component_loader_1.DynamicComponentLoader, di_1.Injector]), di_1.bind(appComponentType).toFactory(function(p) {
      return p.then(function(ref) {
        return ref.instance;
      });
    }, [application_tokens_1.APP_COMPONENT_REF_PROMISE])];
  }
  function applicationCommonBindings() {
    return [compiler_1.Compiler, application_tokens_1.APP_ID_RANDOM_BINDING, view_pool_1.AppViewPool, di_1.bind(view_pool_1.APP_VIEW_POOL_CAPACITY).toValue(10000), view_manager_1.AppViewManager, view_manager_utils_1.AppViewManagerUtils, view_listener_1.AppViewListener, proto_view_factory_1.ProtoViewFactory, view_resolver_1.ViewResolver, pipes_1.DEFAULT_PIPES, di_1.bind(change_detection_1.IterableDiffers).toValue(change_detection_1.defaultIterableDiffers), di_1.bind(change_detection_1.KeyValueDiffers).toValue(change_detection_1.defaultKeyValueDiffers), directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver, dynamic_component_loader_1.DynamicComponentLoader, di_1.bind(life_cycle_1.LifeCycle).toFactory(function(exceptionHandler) {
      return new life_cycle_1.LifeCycle(null, lang_1.assertionsEnabled());
    }, [exceptions_1.ExceptionHandler])];
  }
  exports.applicationCommonBindings = applicationCommonBindings;
  function createNgZone() {
    return new ng_zone_1.NgZone({enableLongStackTrace: lang_1.assertionsEnabled()});
  }
  exports.createNgZone = createNgZone;
  var _platform;
  function platformCommon(bindings, initializer) {
    if (lang_1.isPresent(_platform)) {
      if (lang_1.isBlank(bindings)) {
        return _platform;
      }
      throw "platform() can only be called once per page";
    }
    if (lang_1.isPresent(initializer)) {
      initializer();
    }
    if (lang_1.isBlank(bindings)) {
      bindings = platformBindings();
    }
    _platform = new PlatformRef(di_1.Injector.resolveAndCreate(bindings), function() {
      _platform = null;
    });
    return _platform;
  }
  exports.platformCommon = platformCommon;
  var PlatformRef = (function() {
    function PlatformRef(_injector, _dispose) {
      this._injector = _injector;
      this._dispose = _dispose;
      this._applications = [];
    }
    Object.defineProperty(PlatformRef.prototype, "injector", {
      get: function() {
        return this._injector;
      },
      enumerable: true,
      configurable: true
    });
    PlatformRef.prototype.application = function(bindings) {
      var app = this._initApp(createNgZone(), bindings);
      return app;
    };
    PlatformRef.prototype.asyncApplication = function(bindingFn) {
      var _this = this;
      var zone = createNgZone();
      var completer = async_1.PromiseWrapper.completer();
      zone.run(function() {
        async_1.PromiseWrapper.then(bindingFn(zone), function(bindings) {
          completer.resolve(_this._initApp(zone, bindings));
        });
      });
      return completer.promise;
    };
    PlatformRef.prototype._initApp = function(zone, bindings) {
      var _this = this;
      var injector;
      zone.run(function() {
        bindings.push(di_1.bind(ng_zone_1.NgZone).toValue(zone));
        bindings.push(di_1.bind(ApplicationRef).toValue(_this));
        var exceptionHandler;
        try {
          injector = _this.injector.resolveAndCreateChild(bindings);
          exceptionHandler = injector.get(exceptions_1.ExceptionHandler);
          zone.overrideOnErrorHandler(function(e, s) {
            return exceptionHandler.call(e, s);
          });
        } catch (e) {
          if (lang_1.isPresent(exceptionHandler)) {
            exceptionHandler.call(e, e.stack);
          } else {
            dom_adapter_1.DOM.logError(e);
          }
        }
      });
      var app = new ApplicationRef(this, zone, injector);
      this._applications.push(app);
      return app;
    };
    PlatformRef.prototype.dispose = function() {
      this._applications.forEach(function(app) {
        return app.dispose();
      });
      this._dispose();
    };
    PlatformRef.prototype._applicationDisposed = function(app) {
      collection_1.ListWrapper.remove(this._applications, app);
    };
    return PlatformRef;
  })();
  exports.PlatformRef = PlatformRef;
  var ApplicationRef = (function() {
    function ApplicationRef(_platform, _zone, _injector) {
      this._platform = _platform;
      this._zone = _zone;
      this._injector = _injector;
      this._bootstrapListeners = [];
      this._rootComponents = [];
    }
    ApplicationRef.prototype.registerBootstrapListener = function(listener) {
      this._bootstrapListeners.push(listener);
    };
    ApplicationRef.prototype.bootstrap = function(componentType, bindings) {
      var _this = this;
      var completer = async_1.PromiseWrapper.completer();
      this._zone.run(function() {
        var componentBindings = _componentBindings(componentType);
        if (lang_1.isPresent(bindings)) {
          componentBindings.push(bindings);
        }
        var exceptionHandler = _this._injector.get(exceptions_1.ExceptionHandler);
        try {
          var injector = _this._injector.resolveAndCreateChild(componentBindings);
          var compRefToken = injector.get(application_tokens_1.APP_COMPONENT_REF_PROMISE);
          var tick = function(componentRef) {
            var appChangeDetector = view_ref_1.internalView(componentRef.hostView).changeDetector;
            var lc = injector.get(life_cycle_1.LifeCycle);
            lc.registerWith(_this._zone, appChangeDetector);
            lc.tick();
            completer.resolve(componentRef);
            _this._rootComponents.push(componentRef);
            _this._bootstrapListeners.forEach(function(listener) {
              return listener(componentRef);
            });
          };
          var tickResult = async_1.PromiseWrapper.then(compRefToken, tick);
          async_1.PromiseWrapper.then(tickResult, function(_) {});
          async_1.PromiseWrapper.then(tickResult, null, function(err, stackTrace) {
            return completer.reject(err, stackTrace);
          });
        } catch (e) {
          exceptionHandler.call(e, e.stack);
          completer.reject(e, e.stack);
        }
      });
      return completer.promise;
    };
    Object.defineProperty(ApplicationRef.prototype, "injector", {
      get: function() {
        return this._injector;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ApplicationRef.prototype, "zone", {
      get: function() {
        return this._zone;
      },
      enumerable: true,
      configurable: true
    });
    ApplicationRef.prototype.dispose = function() {
      this._rootComponents.forEach(function(ref) {
        return ref.dispose();
      });
      this._platform._applicationDisposed(this);
    };
    return ApplicationRef;
  })();
  exports.ApplicationRef = ApplicationRef;
})(require("process"));
