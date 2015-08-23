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
var lang_1 = require("../../facade/lang");
var pipe_1 = require("./pipe");
var UpperCasePipe = (function(_super) {
  __extends(UpperCasePipe, _super);
  function UpperCasePipe() {
    _super.apply(this, arguments);
  }
  UpperCasePipe.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  UpperCasePipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    return lang_1.StringWrapper.toUpperCase(value);
  };
  UpperCasePipe.prototype.create = function(cdRef) {
    return this;
  };
  UpperCasePipe = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], UpperCasePipe);
  return UpperCasePipe;
})(pipe_1.BasePipe);
exports.UpperCasePipe = UpperCasePipe;