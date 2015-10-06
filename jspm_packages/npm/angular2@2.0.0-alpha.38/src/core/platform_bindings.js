/* */ 
'use strict';
var di_1 = require("./di");
var exceptions_1 = require("./facade/exceptions");
var dom_adapter_1 = require("./dom/dom_adapter");
exports.EXCEPTION_BINDING = di_1.bind(exceptions_1.ExceptionHandler).toFactory(function() {
  return new exceptions_1.ExceptionHandler(dom_adapter_1.DOM, false);
}, []);
