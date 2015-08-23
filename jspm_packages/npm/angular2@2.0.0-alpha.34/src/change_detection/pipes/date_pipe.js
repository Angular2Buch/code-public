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
var intl_1 = require("../../facade/intl");
var collection_1 = require("../../facade/collection");
var pipe_1 = require("./pipe");
var defaultLocale = 'en-US';
var DatePipe = (function(_super) {
  __extends(DatePipe, _super);
  function DatePipe() {
    _super.apply(this, arguments);
  }
  DatePipe.prototype.transform = function(value, args) {
    var pattern = lang_1.isPresent(args) && args.length > 0 ? args[0] : 'mediumDate';
    if (lang_1.isNumber(value)) {
      value = lang_1.DateWrapper.fromMillis(value);
    }
    if (collection_1.StringMapWrapper.contains(DatePipe._ALIASES, pattern)) {
      pattern = collection_1.StringMapWrapper.get(DatePipe._ALIASES, pattern);
    }
    return intl_1.DateFormatter.format(value, defaultLocale, pattern);
  };
  DatePipe.prototype.supports = function(obj) {
    return lang_1.isDate(obj) || lang_1.isNumber(obj);
  };
  DatePipe.prototype.create = function(cdRef) {
    return this;
  };
  DatePipe._ALIASES = {
    'medium': 'yMMMdjms',
    'short': 'yMdjm',
    'fullDate': 'yMMMMEEEEd',
    'longDate': 'yMMMMd',
    'mediumDate': 'yMMMd',
    'shortDate': 'yMd',
    'mediumTime': 'jms',
    'shortTime': 'jm'
  };
  DatePipe = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], DatePipe);
  return DatePipe;
})(pipe_1.BasePipe);
exports.DatePipe = DatePipe;
