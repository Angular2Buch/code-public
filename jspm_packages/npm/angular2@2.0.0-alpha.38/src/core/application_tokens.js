/* */ 
'use strict';
var di_1 = require("./di");
var lang_1 = require("./facade/lang");
exports.APP_COMPONENT_REF_PROMISE = lang_1.CONST_EXPR(new di_1.OpaqueToken('Promise<ComponentRef>'));
exports.APP_COMPONENT = lang_1.CONST_EXPR(new di_1.OpaqueToken('AppComponent'));
exports.APP_ID = lang_1.CONST_EXPR(new di_1.OpaqueToken('AppId'));
function _appIdRandomBindingFactory() {
  return "" + _randomChar() + _randomChar() + _randomChar();
}
exports.APP_ID_RANDOM_BINDING = lang_1.CONST_EXPR(new di_1.Binding(exports.APP_ID, {
  toFactory: _appIdRandomBindingFactory,
  deps: []
}));
function _randomChar() {
  return lang_1.StringWrapper.fromCharCode(97 + lang_1.Math.floor(lang_1.Math.random() * 25));
}
