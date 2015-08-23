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
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var di_1 = require("../../../di");
var di_2 = require("../../../di");
var Pipes = (function() {
  function Pipes(config) {
    this.config = config;
  }
  Pipes.prototype.get = function(type, obj, cdRef, existingPipe) {
    if (lang_1.isPresent(existingPipe) && existingPipe.supports(obj))
      return existingPipe;
    if (lang_1.isPresent(existingPipe))
      existingPipe.onDestroy();
    var factories = this._getListOfFactories(type, obj);
    var factory = this._getMatchingFactory(factories, type, obj);
    return factory.create(cdRef);
  };
  Pipes.extend = function(config) {
    return new di_2.Binding(Pipes, {
      toFactory: function(pipes) {
        if (lang_1.isBlank(pipes)) {
          throw new lang_1.BaseException('Cannot extend Pipes without a parent injector');
        }
        return Pipes.create(config, pipes);
      },
      deps: [[Pipes, new di_1.SkipSelfMetadata(), new di_1.OptionalMetadata()]]
    });
  };
  Pipes.create = function(config, pipes) {
    if (pipes === void 0) {
      pipes = null;
    }
    if (lang_1.isPresent(pipes)) {
      collection_1.StringMapWrapper.forEach(pipes.config, function(v, k) {
        if (collection_1.StringMapWrapper.contains(config, k)) {
          var configFactories = config[k];
          config[k] = configFactories.concat(v);
        } else {
          config[k] = collection_1.ListWrapper.clone(v);
        }
      });
    }
    return new Pipes(config);
  };
  Pipes.prototype._getListOfFactories = function(type, obj) {
    var listOfFactories = this.config[type];
    if (lang_1.isBlank(listOfFactories)) {
      throw new lang_1.BaseException("Cannot find '" + type + "' pipe supporting object '" + obj + "'");
    }
    return listOfFactories;
  };
  Pipes.prototype._getMatchingFactory = function(listOfFactories, type, obj) {
    var matchingFactory = collection_1.ListWrapper.find(listOfFactories, function(pipeFactory) {
      return pipeFactory.supports(obj);
    });
    if (lang_1.isBlank(matchingFactory)) {
      throw new lang_1.BaseException("Cannot find '" + type + "' pipe supporting object '" + obj + "'");
    }
    return matchingFactory;
  };
  Pipes = __decorate([di_1.Injectable(), lang_1.CONST(), __metadata('design:paramtypes', [Object])], Pipes);
  return Pipes;
})();
exports.Pipes = Pipes;