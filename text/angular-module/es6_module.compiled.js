System.registerModule("es6_module.js", [], function() {
  "use strict";
  var __moduleName = "es6_module.js";
  var Test = function() {
    function Test() {
      document.body.innerText = 'This is a Constructor!';
    }
    return ($traceurRuntime.createClass)(Test, {}, {});
  }();
  return {get Test() {
      return Test;
    }};
});
System.get("es6_module.js" + '');
