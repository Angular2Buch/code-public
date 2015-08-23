/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var async_1 = require("../facade/async");
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var route_lifecycle_reflector_1 = require("./route_lifecycle_reflector");
var _resolveToTrue = async_1.PromiseWrapper.resolve(true);
var _resolveToFalse = async_1.PromiseWrapper.resolve(false);
var Router = (function() {
  function Router(registry, _pipeline, parent, hostComponent) {
    this.registry = registry;
    this._pipeline = _pipeline;
    this.parent = parent;
    this.hostComponent = hostComponent;
    this.navigating = false;
    this._currentInstruction = null;
    this._currentNavigation = _resolveToTrue;
    this._outlet = null;
    this._subject = new async_1.EventEmitter();
  }
  Router.prototype.childRouter = function(hostComponent) {
    return new ChildRouter(this, hostComponent);
  };
  Router.prototype.registerOutlet = function(outlet) {
    this._outlet = outlet;
    if (lang_1.isPresent(this._currentInstruction)) {
      return outlet.commit(this._currentInstruction);
    }
    return _resolveToTrue;
  };
  Router.prototype.config = function(definitions) {
    var _this = this;
    definitions.forEach(function(routeDefinition) {
      _this.registry.config(_this.hostComponent, routeDefinition, _this instanceof RootRouter);
    });
    return this.renavigate();
  };
  Router.prototype.navigate = function(url, _skipLocationChange) {
    var _this = this;
    if (_skipLocationChange === void 0) {
      _skipLocationChange = false;
    }
    return this._currentNavigation = this._currentNavigation.then(function(_) {
      _this.lastNavigationAttempt = url;
      _this._startNavigating();
      return _this._afterPromiseFinishNavigating(_this.recognize(url).then(function(matchedInstruction) {
        if (lang_1.isBlank(matchedInstruction)) {
          return false;
        }
        return _this._reuse(matchedInstruction).then(function(_) {
          return _this._canActivate(matchedInstruction);
        }).then(function(result) {
          if (!result) {
            return false;
          }
          return _this._canDeactivate(matchedInstruction).then(function(result) {
            if (result) {
              return _this.commit(matchedInstruction, _skipLocationChange).then(function(_) {
                _this._emitNavigationFinish(matchedInstruction.accumulatedUrl);
                return true;
              });
            }
          });
        });
      }));
    });
  };
  Router.prototype._emitNavigationFinish = function(url) {
    async_1.ObservableWrapper.callNext(this._subject, url);
  };
  Router.prototype._afterPromiseFinishNavigating = function(promise) {
    var _this = this;
    return async_1.PromiseWrapper.catchError(promise.then(function(_) {
      return _this._finishNavigating();
    }), function(err) {
      _this._finishNavigating();
      throw err;
    });
  };
  Router.prototype._reuse = function(instruction) {
    var _this = this;
    if (lang_1.isBlank(this._outlet)) {
      return _resolveToFalse;
    }
    return this._outlet.canReuse(instruction).then(function(result) {
      instruction.reuse = result;
      if (lang_1.isPresent(_this._outlet.childRouter) && lang_1.isPresent(instruction.child)) {
        return _this._outlet.childRouter._reuse(instruction.child);
      }
    });
  };
  Router.prototype._canActivate = function(instruction) {
    return canActivateOne(instruction, this._currentInstruction);
  };
  Router.prototype._canDeactivate = function(instruction) {
    var _this = this;
    if (lang_1.isBlank(this._outlet)) {
      return _resolveToTrue;
    }
    var next;
    if (lang_1.isPresent(instruction) && instruction.reuse) {
      next = _resolveToTrue;
    } else {
      next = this._outlet.canDeactivate(instruction);
    }
    return next.then(function(result) {
      if (result == false) {
        return false;
      }
      if (lang_1.isPresent(_this._outlet.childRouter)) {
        return _this._outlet.childRouter._canDeactivate(lang_1.isPresent(instruction) ? instruction.child : null);
      }
      return true;
    });
  };
  Router.prototype.commit = function(instruction, _skipLocationChange) {
    if (_skipLocationChange === void 0) {
      _skipLocationChange = false;
    }
    this._currentInstruction = instruction;
    if (lang_1.isPresent(this._outlet)) {
      return this._outlet.commit(instruction);
    }
    return _resolveToTrue;
  };
  Router.prototype._startNavigating = function() {
    this.navigating = true;
  };
  Router.prototype._finishNavigating = function() {
    this.navigating = false;
  };
  Router.prototype.subscribe = function(onNext) {
    async_1.ObservableWrapper.subscribe(this._subject, onNext);
  };
  Router.prototype.deactivate = function(instruction) {
    if (lang_1.isPresent(this._outlet)) {
      return this._outlet.deactivate(instruction);
    }
    return _resolveToTrue;
  };
  Router.prototype.recognize = function(url) {
    return this.registry.recognize(url, this.hostComponent);
  };
  Router.prototype.renavigate = function() {
    if (lang_1.isBlank(this.lastNavigationAttempt)) {
      return this._currentNavigation;
    }
    return this.navigate(this.lastNavigationAttempt);
  };
  Router.prototype.generate = function(linkParams) {
    var normalizedLinkParams = splitAndFlattenLinkParams(linkParams);
    var first = collection_1.ListWrapper.first(normalizedLinkParams);
    var rest = collection_1.ListWrapper.slice(normalizedLinkParams, 1);
    var router = this;
    if (first == '') {
      while (lang_1.isPresent(router.parent)) {
        router = router.parent;
      }
    } else if (first == '..') {
      router = router.parent;
      while (collection_1.ListWrapper.first(rest) == '..') {
        rest = collection_1.ListWrapper.slice(rest, 1);
        router = router.parent;
        if (lang_1.isBlank(router)) {
          throw new lang_1.BaseException("Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" has too many \"../\" segments.");
        }
      }
    } else if (first != '.') {
      throw new lang_1.BaseException("Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" must start with \"/\", \"./\", or \"../\"");
    }
    if (rest[rest.length - 1] == '') {
      collection_1.ListWrapper.removeLast(rest);
    }
    if (rest.length < 1) {
      var msg = "Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" must include a route name.";
      throw new lang_1.BaseException(msg);
    }
    var url = '';
    if (lang_1.isPresent(router.parent) && lang_1.isPresent(router.parent._currentInstruction)) {
      url = router.parent._currentInstruction.capturedUrl;
    }
    return url + '/' + this.registry.generate(rest, router.hostComponent);
  };
  return Router;
})();
exports.Router = Router;
var RootRouter = (function(_super) {
  __extends(RootRouter, _super);
  function RootRouter(registry, pipeline, location, hostComponent) {
    var _this = this;
    _super.call(this, registry, pipeline, null, hostComponent);
    this._location = location;
    this._location.subscribe(function(change) {
      return _this.navigate(change['url'], lang_1.isPresent(change['pop']));
    });
    this.registry.configFromComponent(hostComponent, true);
    this.navigate(location.path());
  }
  RootRouter.prototype.commit = function(instruction, _skipLocationChange) {
    var _this = this;
    if (_skipLocationChange === void 0) {
      _skipLocationChange = false;
    }
    var promise = _super.prototype.commit.call(this, instruction);
    if (!_skipLocationChange) {
      promise = promise.then(function(_) {
        _this._location.go(instruction.accumulatedUrl);
      });
    }
    return promise;
  };
  return RootRouter;
})(Router);
exports.RootRouter = RootRouter;
var ChildRouter = (function(_super) {
  __extends(ChildRouter, _super);
  function ChildRouter(parent, hostComponent) {
    _super.call(this, parent.registry, parent._pipeline, parent, hostComponent);
    this.parent = parent;
  }
  ChildRouter.prototype.navigate = function(url, _skipLocationChange) {
    if (_skipLocationChange === void 0) {
      _skipLocationChange = false;
    }
    return this.parent.navigate(url, _skipLocationChange);
  };
  return ChildRouter;
})(Router);
var SLASH = new RegExp('/');
function splitAndFlattenLinkParams(linkParams) {
  return collection_1.ListWrapper.reduce(linkParams, function(accumulation, item) {
    if (lang_1.isString(item)) {
      return collection_1.ListWrapper.concat(accumulation, lang_1.StringWrapper.split(item, SLASH));
    }
    accumulation.push(item);
    return accumulation;
  }, []);
}
function canActivateOne(nextInstruction, currentInstruction) {
  var next = _resolveToTrue;
  if (lang_1.isPresent(nextInstruction.child)) {
    next = canActivateOne(nextInstruction.child, lang_1.isPresent(currentInstruction) ? currentInstruction.child : null);
  }
  return next.then(function(res) {
    if (res == false) {
      return false;
    }
    if (nextInstruction.reuse) {
      return true;
    }
    var hook = route_lifecycle_reflector_1.getCanActivateHook(nextInstruction.component);
    if (lang_1.isPresent(hook)) {
      return hook(nextInstruction, currentInstruction);
    }
    return true;
  });
}
