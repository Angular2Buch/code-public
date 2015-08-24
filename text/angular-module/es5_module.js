$traceurRuntime.options.symbols = true;
System.registerModule("es6_module.js", [], function(require) {
  "use strict";
  var $__2;
  var __moduleName = "es6_module.js";
  var Test = $traceurRuntime.initTailRecursiveFunction(function() {
    return $traceurRuntime.call(function() {
      function Test() {
        document.body.innerText = 'This is a Constructor!';
      }
      return $traceurRuntime.continuation($traceurRuntime.createClass, $traceurRuntime, [Test, {}, {}]);
    }, this, arguments);
  })();
  return ($__2 = {}, Object.defineProperty($__2, "Test", {
    get: function() {
      return Test;
    },
    configurable: true,
    enumerable: true
  }), $__2);
});
System.get("es6_module.js" + '');
