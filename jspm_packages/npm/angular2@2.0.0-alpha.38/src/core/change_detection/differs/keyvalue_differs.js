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
var lang_1 = require('../../facade/lang');
var exceptions_1 = require('../../facade/exceptions');
var collection_1 = require('../../facade/collection');
var di_1 = require('../../di');
var KeyValueDiffers = (function() {
  function KeyValueDiffers(factories) {
    this.factories = factories;
  }
  KeyValueDiffers.create = function(factories, parent) {
    if (lang_1.isPresent(parent)) {
      var copied = collection_1.ListWrapper.clone(parent.factories);
      factories = factories.concat(copied);
      return new KeyValueDiffers(factories);
    } else {
      return new KeyValueDiffers(factories);
    }
  };
  KeyValueDiffers.extend = function(factories) {
    return new di_1.Binding(KeyValueDiffers, {
      toFactory: function(parent) {
        if (lang_1.isBlank(parent)) {
          throw new exceptions_1.BaseException('Cannot extend KeyValueDiffers without a parent injector');
        }
        return KeyValueDiffers.create(factories, parent);
      },
      deps: [[KeyValueDiffers, new di_1.SkipSelfMetadata(), new di_1.OptionalMetadata()]]
    });
  };
  KeyValueDiffers.prototype.find = function(kv) {
    var factory = collection_1.ListWrapper.find(this.factories, function(f) {
      return f.supports(kv);
    });
    if (lang_1.isPresent(factory)) {
      return factory;
    } else {
      throw new exceptions_1.BaseException("Cannot find a differ supporting object '" + kv + "'");
    }
  };
  KeyValueDiffers = __decorate([di_1.Injectable(), lang_1.CONST(), __metadata('design:paramtypes', [Array])], KeyValueDiffers);
  return KeyValueDiffers;
})();
exports.KeyValueDiffers = KeyValueDiffers;
