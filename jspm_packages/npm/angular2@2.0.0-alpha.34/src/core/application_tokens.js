/* */ 
'use strict';
var di_1 = require("../../di");
var lang_1 = require("../facade/lang");
exports.appComponentRefPromiseToken = lang_1.CONST_EXPR(new di_1.OpaqueToken('Promise<ComponentRef>'));
exports.appComponentTypeToken = lang_1.CONST_EXPR(new di_1.OpaqueToken('RootComponent'));
