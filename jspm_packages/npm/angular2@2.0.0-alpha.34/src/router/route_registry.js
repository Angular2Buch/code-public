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
var route_recognizer_1 = require("./route_recognizer");
var instruction_1 = require("./instruction");
var collection_1 = require("../facade/collection");
var async_1 = require("../facade/async");
var lang_1 = require("../facade/lang");
var route_config_impl_1 = require("./route_config_impl");
var reflection_1 = require("../reflection/reflection");
var di_1 = require("../../di");
var route_config_nomalizer_1 = require("./route_config_nomalizer");
var RouteRegistry = (function() {
  function RouteRegistry() {
    this._rules = new collection_1.Map();
  }
  RouteRegistry.prototype.config = function(parentComponent, config, isRootLevelRoute) {
    if (isRootLevelRoute === void 0) {
      isRootLevelRoute = false;
    }
    config = route_config_nomalizer_1.normalizeRouteConfig(config);
    var recognizer = this._rules.get(parentComponent);
    if (lang_1.isBlank(recognizer)) {
      recognizer = new route_recognizer_1.RouteRecognizer(isRootLevelRoute);
      this._rules.set(parentComponent, recognizer);
    }
    var terminal = recognizer.config(config);
    if (config instanceof route_config_impl_1.Route) {
      if (terminal) {
        assertTerminalComponent(config.component, config.path);
      } else {
        this.configFromComponent(config.component);
      }
    }
  };
  RouteRegistry.prototype.configFromComponent = function(component, isRootComponent) {
    var _this = this;
    if (isRootComponent === void 0) {
      isRootComponent = false;
    }
    if (!lang_1.isType(component)) {
      return;
    }
    if (this._rules.has(component)) {
      return;
    }
    var annotations = reflection_1.reflector.annotations(component);
    if (lang_1.isPresent(annotations)) {
      for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation instanceof route_config_impl_1.RouteConfig) {
          collection_1.ListWrapper.forEach(annotation.configs, function(config) {
            return _this.config(component, config, isRootComponent);
          });
        }
      }
    }
  };
  RouteRegistry.prototype.recognize = function(url, parentComponent) {
    var _this = this;
    var componentRecognizer = this._rules.get(parentComponent);
    if (lang_1.isBlank(componentRecognizer)) {
      return async_1.PromiseWrapper.resolve(null);
    }
    var possibleMatches = componentRecognizer.recognize(url);
    var matchPromises = collection_1.ListWrapper.map(possibleMatches, function(candidate) {
      return _this._completeRouteMatch(candidate);
    });
    return async_1.PromiseWrapper.all(matchPromises).then(function(solutions) {
      var fullSolutions = collection_1.ListWrapper.filter(solutions, function(solution) {
        return lang_1.isPresent(solution);
      });
      if (fullSolutions.length > 0) {
        return mostSpecific(fullSolutions);
      }
      return null;
    });
  };
  RouteRegistry.prototype._completeRouteMatch = function(partialMatch) {
    var _this = this;
    var recognizer = partialMatch.recognizer;
    var handler = recognizer.handler;
    return handler.resolveComponentType().then(function(componentType) {
      _this.configFromComponent(componentType);
      if (partialMatch.unmatchedUrl.length == 0) {
        if (recognizer.terminal) {
          return new instruction_1.Instruction(componentType, partialMatch.matchedUrl, recognizer, null, partialMatch.params());
        } else {
          return null;
        }
      }
      return _this.recognize(partialMatch.unmatchedUrl, componentType).then(function(childInstruction) {
        if (lang_1.isBlank(childInstruction)) {
          return null;
        } else {
          return new instruction_1.Instruction(componentType, partialMatch.matchedUrl, recognizer, childInstruction);
        }
      });
    });
  };
  RouteRegistry.prototype.generate = function(linkParams, parentComponent) {
    var url = '';
    var componentCursor = parentComponent;
    for (var i = 0; i < linkParams.length; i += 1) {
      var segment = linkParams[i];
      if (lang_1.isBlank(componentCursor)) {
        throw new lang_1.BaseException("Could not find route named \"" + segment + "\".");
      }
      if (!lang_1.isString(segment)) {
        throw new lang_1.BaseException("Unexpected segment \"" + segment + "\" in link DSL. Expected a string.");
      } else if (segment == '' || segment == '.' || segment == '..') {
        throw new lang_1.BaseException("\"" + segment + "/\" is only allowed at the beginning of a link DSL.");
      }
      var params = null;
      if (i + 1 < linkParams.length) {
        var nextSegment = linkParams[i + 1];
        if (lang_1.isStringMap(nextSegment)) {
          params = nextSegment;
          i += 1;
        }
      }
      var componentRecognizer = this._rules.get(componentCursor);
      if (lang_1.isBlank(componentRecognizer)) {
        throw new lang_1.BaseException("Component \"" + lang_1.getTypeNameForDebugging(componentCursor) + "\" has no route config.");
      }
      var response = componentRecognizer.generate(segment, params);
      if (lang_1.isBlank(response)) {
        throw new lang_1.BaseException("Component \"" + lang_1.getTypeNameForDebugging(componentCursor) + "\" has no route named \"" + segment + "\".");
      }
      url += response['url'];
      componentCursor = response['nextComponent'];
    }
    return url;
  };
  RouteRegistry = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], RouteRegistry);
  return RouteRegistry;
})();
exports.RouteRegistry = RouteRegistry;
function mostSpecific(instructions) {
  var mostSpecificSolution = instructions[0];
  for (var solutionIndex = 1; solutionIndex < instructions.length; solutionIndex++) {
    var solution = instructions[solutionIndex];
    if (solution.specificity > mostSpecificSolution.specificity) {
      mostSpecificSolution = solution;
    }
  }
  return mostSpecificSolution;
}
function assertTerminalComponent(component, path) {
  if (!lang_1.isType(component)) {
    return;
  }
  var annotations = reflection_1.reflector.annotations(component);
  if (lang_1.isPresent(annotations)) {
    for (var i = 0; i < annotations.length; i++) {
      var annotation = annotations[i];
      if (annotation instanceof route_config_impl_1.RouteConfig) {
        throw new lang_1.BaseException("Child routes are not allowed for \"" + path + "\". Use \"...\" on the parent's route path.");
      }
    }
  }
}
