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
var annotations_1 = require("../../annotations");
var core_1 = require("../../core");
var api_1 = require("../render/api");
var change_detection_1 = require("../../change_detection");
var collection_1 = require("../facade/collection");
var CSSClass = (function() {
  function CSSClass(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
    this._iterableDiffers = _iterableDiffers;
    this._keyValueDiffers = _keyValueDiffers;
    this._ngEl = _ngEl;
    this._renderer = _renderer;
  }
  Object.defineProperty(CSSClass.prototype, "rawClass", {
    set: function(v) {
      this._cleanupClasses(this._rawClass);
      if (lang_1.isString(v)) {
        v = v.split(' ');
      }
      this._rawClass = v;
      if (lang_1.isPresent(v)) {
        if (collection_1.isListLikeIterable(v)) {
          this._differ = this._iterableDiffers.find(v).create(null);
          this._mode = 'iterable';
        } else {
          this._differ = this._keyValueDiffers.find(v).create(null);
          this._mode = 'keyValue';
        }
      }
    },
    enumerable: true,
    configurable: true
  });
  CSSClass.prototype.onCheck = function() {
    if (lang_1.isPresent(this._differ)) {
      var changes = this._differ.diff(this._rawClass);
      if (lang_1.isPresent(changes)) {
        if (this._mode == 'iterable') {
          this._applyIterableChanges(changes);
        } else {
          this._applyKeyValueChanges(changes);
        }
      }
    }
  };
  CSSClass.prototype.onDestroy = function() {
    this._cleanupClasses(this._rawClass);
  };
  CSSClass.prototype._cleanupClasses = function(rawClassVal) {
    var _this = this;
    if (lang_1.isPresent(rawClassVal)) {
      if (collection_1.isListLikeIterable(rawClassVal)) {
        collection_1.ListWrapper.forEach(rawClassVal, function(className) {
          _this._toggleClass(className, false);
        });
      } else {
        collection_1.StringMapWrapper.forEach(rawClassVal, function(expVal, className) {
          if (expVal)
            _this._toggleClass(className, false);
        });
      }
    }
  };
  CSSClass.prototype._applyKeyValueChanges = function(changes) {
    var _this = this;
    changes.forEachAddedItem(function(record) {
      _this._toggleClass(record.key, record.currentValue);
    });
    changes.forEachChangedItem(function(record) {
      _this._toggleClass(record.key, record.currentValue);
    });
    changes.forEachRemovedItem(function(record) {
      if (record.previousValue) {
        _this._toggleClass(record.key, false);
      }
    });
  };
  CSSClass.prototype._applyIterableChanges = function(changes) {
    var _this = this;
    changes.forEachAddedItem(function(record) {
      _this._toggleClass(record.item, true);
    });
    changes.forEachRemovedItem(function(record) {
      _this._toggleClass(record.item, false);
    });
  };
  CSSClass.prototype._toggleClass = function(className, enabled) {
    this._renderer.setElementClass(this._ngEl, className, enabled);
  };
  CSSClass = __decorate([annotations_1.Directive({
    selector: '[class]',
    lifecycle: [annotations_1.LifecycleEvent.onCheck, annotations_1.LifecycleEvent.onDestroy],
    properties: ['rawClass: class']
  }), __metadata('design:paramtypes', [change_detection_1.IterableDiffers, change_detection_1.KeyValueDiffers, core_1.ElementRef, api_1.Renderer])], CSSClass);
  return CSSClass;
})();
exports.CSSClass = CSSClass;
