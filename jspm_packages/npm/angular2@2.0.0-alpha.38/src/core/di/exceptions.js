/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var exceptions_1 = require('../facade/exceptions');
function findFirstClosedCycle(keys) {
  var res = [];
  for (var i = 0; i < keys.length; ++i) {
    if (collection_1.ListWrapper.contains(res, keys[i])) {
      res.push(keys[i]);
      return res;
    } else {
      res.push(keys[i]);
    }
  }
  return res;
}
function constructResolvingPath(keys) {
  if (keys.length > 1) {
    var reversed = findFirstClosedCycle(collection_1.ListWrapper.reversed(keys));
    var tokenStrs = collection_1.ListWrapper.map(reversed, function(k) {
      return lang_1.stringify(k.token);
    });
    return " (" + tokenStrs.join(' -> ') + ")";
  } else {
    return "";
  }
}
var AbstractBindingError = (function(_super) {
  __extends(AbstractBindingError, _super);
  function AbstractBindingError(injector, key, constructResolvingMessage) {
    _super.call(this, "DI Exception");
    this.keys = [key];
    this.injectors = [injector];
    this.constructResolvingMessage = constructResolvingMessage;
    this.message = this.constructResolvingMessage(this.keys);
  }
  AbstractBindingError.prototype.addKey = function(injector, key) {
    this.injectors.push(injector);
    this.keys.push(key);
    this.message = this.constructResolvingMessage(this.keys);
  };
  Object.defineProperty(AbstractBindingError.prototype, "context", {
    get: function() {
      return this.injectors[this.injectors.length - 1].debugContext();
    },
    enumerable: true,
    configurable: true
  });
  return AbstractBindingError;
})(exceptions_1.BaseException);
exports.AbstractBindingError = AbstractBindingError;
var NoBindingError = (function(_super) {
  __extends(NoBindingError, _super);
  function NoBindingError(injector, key) {
    _super.call(this, injector, key, function(keys) {
      var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
      return "No provider for " + first + "!" + constructResolvingPath(keys);
    });
  }
  return NoBindingError;
})(AbstractBindingError);
exports.NoBindingError = NoBindingError;
var CyclicDependencyError = (function(_super) {
  __extends(CyclicDependencyError, _super);
  function CyclicDependencyError(injector, key) {
    _super.call(this, injector, key, function(keys) {
      return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
    });
  }
  return CyclicDependencyError;
})(AbstractBindingError);
exports.CyclicDependencyError = CyclicDependencyError;
var InstantiationError = (function(_super) {
  __extends(InstantiationError, _super);
  function InstantiationError(injector, originalException, originalStack, key) {
    _super.call(this, "DI Exception", originalException, originalStack, null);
    this.keys = [key];
    this.injectors = [injector];
  }
  InstantiationError.prototype.addKey = function(injector, key) {
    this.injectors.push(injector);
    this.keys.push(key);
  };
  Object.defineProperty(InstantiationError.prototype, "wrapperMessage", {
    get: function() {
      var first = lang_1.stringify(collection_1.ListWrapper.first(this.keys).token);
      return "Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(InstantiationError.prototype, "causeKey", {
    get: function() {
      return this.keys[0];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(InstantiationError.prototype, "context", {
    get: function() {
      return this.injectors[this.injectors.length - 1].debugContext();
    },
    enumerable: true,
    configurable: true
  });
  return InstantiationError;
})(exceptions_1.WrappedException);
exports.InstantiationError = InstantiationError;
var InvalidBindingError = (function(_super) {
  __extends(InvalidBindingError, _super);
  function InvalidBindingError(binding) {
    _super.call(this, "Invalid binding - only instances of Binding and Type are allowed, got: " + binding.toString());
  }
  return InvalidBindingError;
})(exceptions_1.BaseException);
exports.InvalidBindingError = InvalidBindingError;
var NoAnnotationError = (function(_super) {
  __extends(NoAnnotationError, _super);
  function NoAnnotationError(typeOrFunc, params) {
    _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
  }
  NoAnnotationError._genMessage = function(typeOrFunc, params) {
    var signature = [];
    for (var i = 0,
        ii = params.length; i < ii; i++) {
      var parameter = params[i];
      if (lang_1.isBlank(parameter) || parameter.length == 0) {
        signature.push('?');
      } else {
        signature.push(collection_1.ListWrapper.map(parameter, lang_1.stringify).join(' '));
      }
    }
    return "Cannot resolve all parameters for " + lang_1.stringify(typeOrFunc) + "(" + signature.join(', ') + "). " + 'Make sure they all have valid type or annotations.';
  };
  return NoAnnotationError;
})(exceptions_1.BaseException);
exports.NoAnnotationError = NoAnnotationError;
var OutOfBoundsError = (function(_super) {
  __extends(OutOfBoundsError, _super);
  function OutOfBoundsError(index) {
    _super.call(this, "Index " + index + " is out-of-bounds.");
  }
  return OutOfBoundsError;
})(exceptions_1.BaseException);
exports.OutOfBoundsError = OutOfBoundsError;
var MixingMultiBindingsWithRegularBindings = (function(_super) {
  __extends(MixingMultiBindingsWithRegularBindings, _super);
  function MixingMultiBindingsWithRegularBindings(binding1, binding2) {
    _super.call(this, "Cannot mix multi bindings and regular bindings, got: " + binding1.toString() + " " + binding2.toString());
  }
  return MixingMultiBindingsWithRegularBindings;
})(exceptions_1.BaseException);
exports.MixingMultiBindingsWithRegularBindings = MixingMultiBindingsWithRegularBindings;
