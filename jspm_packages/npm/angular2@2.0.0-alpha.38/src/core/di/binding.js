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
var lang_1 = require("../facade/lang");
var exceptions_1 = require("../facade/exceptions");
var collection_1 = require("../facade/collection");
var reflection_1 = require("../reflection/reflection");
var key_1 = require("./key");
var metadata_1 = require("./metadata");
var exceptions_2 = require("./exceptions");
var forward_ref_1 = require("./forward_ref");
var Dependency = (function() {
  function Dependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties) {
    this.key = key;
    this.optional = optional;
    this.lowerBoundVisibility = lowerBoundVisibility;
    this.upperBoundVisibility = upperBoundVisibility;
    this.properties = properties;
  }
  Dependency.fromKey = function(key) {
    return new Dependency(key, false, null, null, []);
  };
  return Dependency;
})();
exports.Dependency = Dependency;
var _EMPTY_LIST = lang_1.CONST_EXPR([]);
var Binding = (function() {
  function Binding(token, _a) {
    var toClass = _a.toClass,
        toValue = _a.toValue,
        toAlias = _a.toAlias,
        toFactory = _a.toFactory,
        deps = _a.deps,
        multi = _a.multi;
    this.token = token;
    this.toClass = toClass;
    this.toValue = toValue;
    this.toAlias = toAlias;
    this.toFactory = toFactory;
    this.dependencies = deps;
    this._multi = multi;
  }
  Object.defineProperty(Binding.prototype, "multi", {
    get: function() {
      return lang_1.normalizeBool(this._multi);
    },
    enumerable: true,
    configurable: true
  });
  Binding = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object, Object])], Binding);
  return Binding;
})();
exports.Binding = Binding;
var ResolvedBinding = (function() {
  function ResolvedBinding(key, resolvedFactories, multiBinding) {
    this.key = key;
    this.resolvedFactories = resolvedFactories;
    this.multiBinding = multiBinding;
  }
  Object.defineProperty(ResolvedBinding.prototype, "resolvedFactory", {
    get: function() {
      return this.resolvedFactories[0];
    },
    enumerable: true,
    configurable: true
  });
  return ResolvedBinding;
})();
exports.ResolvedBinding = ResolvedBinding;
var ResolvedFactory = (function() {
  function ResolvedFactory(factory, dependencies) {
    this.factory = factory;
    this.dependencies = dependencies;
  }
  return ResolvedFactory;
})();
exports.ResolvedFactory = ResolvedFactory;
function bind(token) {
  return new BindingBuilder(token);
}
exports.bind = bind;
var BindingBuilder = (function() {
  function BindingBuilder(token) {
    this.token = token;
  }
  BindingBuilder.prototype.toClass = function(type) {
    if (!lang_1.isType(type)) {
      throw new exceptions_1.BaseException("Trying to create a class binding but \"" + lang_1.stringify(type) + "\" is not a class!");
    }
    return new Binding(this.token, {toClass: type});
  };
  BindingBuilder.prototype.toValue = function(value) {
    return new Binding(this.token, {toValue: value});
  };
  BindingBuilder.prototype.toAlias = function(aliasToken) {
    if (lang_1.isBlank(aliasToken)) {
      throw new exceptions_1.BaseException("Can not alias " + lang_1.stringify(this.token) + " to a blank value!");
    }
    return new Binding(this.token, {toAlias: aliasToken});
  };
  BindingBuilder.prototype.toFactory = function(factory, dependencies) {
    if (!lang_1.isFunction(factory)) {
      throw new exceptions_1.BaseException("Trying to create a factory binding but \"" + lang_1.stringify(factory) + "\" is not a function!");
    }
    return new Binding(this.token, {
      toFactory: factory,
      deps: dependencies
    });
  };
  return BindingBuilder;
})();
exports.BindingBuilder = BindingBuilder;
function resolveFactory(binding) {
  var factoryFn;
  var resolvedDeps;
  if (lang_1.isPresent(binding.toClass)) {
    var toClass = forward_ref_1.resolveForwardRef(binding.toClass);
    factoryFn = reflection_1.reflector.factory(toClass);
    resolvedDeps = _dependenciesFor(toClass);
  } else if (lang_1.isPresent(binding.toAlias)) {
    factoryFn = function(aliasInstance) {
      return aliasInstance;
    };
    resolvedDeps = [Dependency.fromKey(key_1.Key.get(binding.toAlias))];
  } else if (lang_1.isPresent(binding.toFactory)) {
    factoryFn = binding.toFactory;
    resolvedDeps = _constructDependencies(binding.toFactory, binding.dependencies);
  } else {
    factoryFn = function() {
      return binding.toValue;
    };
    resolvedDeps = _EMPTY_LIST;
  }
  return new ResolvedFactory(factoryFn, resolvedDeps);
}
exports.resolveFactory = resolveFactory;
function resolveBinding(binding) {
  return new ResolvedBinding(key_1.Key.get(binding.token), [resolveFactory(binding)], false);
}
exports.resolveBinding = resolveBinding;
function resolveBindings(bindings) {
  var normalized = _createListOfBindings(_normalizeBindings(bindings, new Map()));
  return normalized.map(function(b) {
    if (b instanceof _NormalizedBinding) {
      return new ResolvedBinding(b.key, [b.resolvedFactory], false);
    } else {
      var arr = b;
      return new ResolvedBinding(arr[0].key, arr.map(function(_) {
        return _.resolvedFactory;
      }), true);
    }
  });
}
exports.resolveBindings = resolveBindings;
var _NormalizedBinding = (function() {
  function _NormalizedBinding(key, resolvedFactory) {
    this.key = key;
    this.resolvedFactory = resolvedFactory;
  }
  return _NormalizedBinding;
})();
function _createListOfBindings(flattenedBindings) {
  return collection_1.MapWrapper.values(flattenedBindings);
}
function _normalizeBindings(bindings, res) {
  collection_1.ListWrapper.forEach(bindings, function(b) {
    if (b instanceof lang_1.Type) {
      _normalizeBinding(bind(b).toClass(b), res);
    } else if (b instanceof Binding) {
      _normalizeBinding(b, res);
    } else if (b instanceof Array) {
      _normalizeBindings(b, res);
    } else if (b instanceof BindingBuilder) {
      throw new exceptions_2.InvalidBindingError(b.token);
    } else {
      throw new exceptions_2.InvalidBindingError(b);
    }
  });
  return res;
}
function _normalizeBinding(b, res) {
  var key = key_1.Key.get(b.token);
  var factory = resolveFactory(b);
  var normalized = new _NormalizedBinding(key, factory);
  if (b.multi) {
    var existingBinding = res.get(key.id);
    if (existingBinding instanceof Array) {
      existingBinding.push(normalized);
    } else if (lang_1.isBlank(existingBinding)) {
      res.set(key.id, [normalized]);
    } else {
      throw new exceptions_2.MixingMultiBindingsWithRegularBindings(existingBinding, b);
    }
  } else {
    var existingBinding = res.get(key.id);
    if (existingBinding instanceof Array) {
      throw new exceptions_2.MixingMultiBindingsWithRegularBindings(existingBinding, b);
    }
    res.set(key.id, normalized);
  }
}
function _constructDependencies(factoryFunction, dependencies) {
  if (lang_1.isBlank(dependencies)) {
    return _dependenciesFor(factoryFunction);
  } else {
    var params = collection_1.ListWrapper.map(dependencies, function(t) {
      return [t];
    });
    return collection_1.ListWrapper.map(dependencies, function(t) {
      return _extractToken(factoryFunction, t, params);
    });
  }
}
function _dependenciesFor(typeOrFunc) {
  var params = reflection_1.reflector.parameters(typeOrFunc);
  if (lang_1.isBlank(params))
    return [];
  if (collection_1.ListWrapper.any(params, function(p) {
    return lang_1.isBlank(p);
  })) {
    throw new exceptions_2.NoAnnotationError(typeOrFunc, params);
  }
  return collection_1.ListWrapper.map(params, function(p) {
    return _extractToken(typeOrFunc, p, params);
  });
}
function _extractToken(typeOrFunc, metadata, params) {
  var depProps = [];
  var token = null;
  var optional = false;
  if (!lang_1.isArray(metadata)) {
    return _createDependency(metadata, optional, null, null, depProps);
  }
  var lowerBoundVisibility = null;
  var upperBoundVisibility = null;
  for (var i = 0; i < metadata.length; ++i) {
    var paramMetadata = metadata[i];
    if (paramMetadata instanceof lang_1.Type) {
      token = paramMetadata;
    } else if (paramMetadata instanceof metadata_1.InjectMetadata) {
      token = paramMetadata.token;
    } else if (paramMetadata instanceof metadata_1.OptionalMetadata) {
      optional = true;
    } else if (paramMetadata instanceof metadata_1.SelfMetadata) {
      upperBoundVisibility = paramMetadata;
    } else if (paramMetadata instanceof metadata_1.HostMetadata) {
      upperBoundVisibility = paramMetadata;
    } else if (paramMetadata instanceof metadata_1.SkipSelfMetadata) {
      lowerBoundVisibility = paramMetadata;
    } else if (paramMetadata instanceof metadata_1.DependencyMetadata) {
      if (lang_1.isPresent(paramMetadata.token)) {
        token = paramMetadata.token;
      }
      depProps.push(paramMetadata);
    }
  }
  token = forward_ref_1.resolveForwardRef(token);
  if (lang_1.isPresent(token)) {
    return _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps);
  } else {
    throw new exceptions_2.NoAnnotationError(typeOrFunc, params);
  }
}
function _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps) {
  return new Dependency(key_1.Key.get(token), optional, lowerBoundVisibility, upperBoundVisibility, depProps);
}
