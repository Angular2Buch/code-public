/* */ 
"use strict";
var $__private_46_js__;
var $__0 = ($__private_46_js__ = require('./private'), $__private_46_js__ && $__private_46_js__.__esModule && $__private_46_js__ || {default: $__private_46_js__}),
    createPrivateSymbol = $__0.createPrivateSymbol,
    getPrivate = $__0.getPrivate,
    setPrivate = $__0.setPrivate;
var $__12 = Object,
    create = $__12.create,
    defineProperty = $__12.defineProperty;
var observeName = createPrivateSymbol();
function AsyncGeneratorFunction() {}
function AsyncGeneratorFunctionPrototype() {}
AsyncGeneratorFunction.prototype = AsyncGeneratorFunctionPrototype;
AsyncGeneratorFunctionPrototype.constructor = AsyncGeneratorFunction;
defineProperty(AsyncGeneratorFunctionPrototype, 'constructor', {enumerable: false});
var AsyncGeneratorContext = function() {
  function AsyncGeneratorContext(observer) {
    var $__3 = this;
    this.decoratedObserver = $traceurRuntime.createDecoratedGenerator(observer, function() {
      $__3.done = true;
    });
    this.done = false;
    this.inReturn = false;
  }
  return ($traceurRuntime.createClass)(AsyncGeneratorContext, {
    throw: function(error) {
      if (!this.inReturn) {
        throw error;
      }
    },
    yield: function(value) {
      if (this.done) {
        this.inReturn = true;
        throw undefined;
      }
      var result;
      try {
        result = this.decoratedObserver.next(value);
      } catch (e) {
        this.done = true;
        throw e;
      }
      if (result === undefined) {
        return;
      }
      if (result.done) {
        this.done = true;
        this.inReturn = true;
        throw undefined;
      }
      return result.value;
    },
    yieldFor: function(observable) {
      var ctx = this;
      return $traceurRuntime.observeForEach(observable[Symbol.observer].bind(observable), function(value) {
        if (ctx.done) {
          this.return();
          return;
        }
        var result;
        try {
          result = ctx.decoratedObserver.next(value);
        } catch (e) {
          ctx.done = true;
          throw e;
        }
        if (result === undefined) {
          return;
        }
        if (result.done) {
          ctx.done = true;
        }
        return result;
      });
    }
  }, {});
}();
AsyncGeneratorFunctionPrototype.prototype[Symbol.observer] = function(observer) {
  var observe = getPrivate(this, observeName);
  var ctx = new AsyncGeneratorContext(observer);
  $traceurRuntime.schedule(function() {
    return observe(ctx);
  }).then(function(value) {
    if (!ctx.done) {
      ctx.decoratedObserver.return(value);
    }
  }).catch(function(error) {
    if (!ctx.done) {
      ctx.decoratedObserver.throw(error);
    }
  });
  return ctx.decoratedObserver;
};
defineProperty(AsyncGeneratorFunctionPrototype.prototype, Symbol.observer, {enumerable: false});
function initAsyncGeneratorFunction(functionObject) {
  functionObject.prototype = create(AsyncGeneratorFunctionPrototype.prototype);
  functionObject.__proto__ = AsyncGeneratorFunctionPrototype;
  return functionObject;
}
function createAsyncGeneratorInstance(observe, functionObject) {
  for (var args = [],
      $__11 = 2; $__11 < arguments.length; $__11++)
    args[$__11 - 2] = arguments[$__11];
  var object = create(functionObject.prototype);
  setPrivate(object, observeName, observe);
  return object;
}
function observeForEach(observe, next) {
  return new Promise(function(resolve, reject) {
    var generator = observe({
      next: function(value) {
        return next.call(generator, value);
      },
      throw: function(error) {
        reject(error);
      },
      return: function(value) {
        resolve(value);
      }
    });
  });
}
function schedule(asyncF) {
  return Promise.resolve().then(asyncF);
}
var generator = Symbol();
var onDone = Symbol();
var DecoratedGenerator = function() {
  function DecoratedGenerator(_generator, _onDone) {
    this[generator] = _generator;
    this[onDone] = _onDone;
  }
  return ($traceurRuntime.createClass)(DecoratedGenerator, {
    next: function(value) {
      var result = this[generator].next(value);
      if (result !== undefined && result.done) {
        this[onDone].call(this);
      }
      return result;
    },
    throw: function(error) {
      this[onDone].call(this);
      return this[generator].throw(error);
    },
    return: function(value) {
      this[onDone].call(this);
      return this[generator].return(value);
    }
  }, {});
}();
function createDecoratedGenerator(generator, onDone) {
  return new DecoratedGenerator(generator, onDone);
}
Array.prototype[Symbol.observer] = function(observer) {
  var done = false;
  var decoratedObserver = createDecoratedGenerator(observer, function() {
    return done = true;
  });
  var $__7 = true;
  var $__8 = false;
  var $__9 = undefined;
  try {
    for (var $__5 = void 0,
        $__4 = (this)[Symbol.iterator](); !($__7 = ($__5 = $__4.next()).done); $__7 = true) {
      var value = $__5.value;
      {
        decoratedObserver.next(value);
        if (done) {
          return;
        }
      }
    }
  } catch ($__10) {
    $__8 = true;
    $__9 = $__10;
  } finally {
    try {
      if (!$__7 && $__4.return != null) {
        $__4.return();
      }
    } finally {
      if ($__8) {
        throw $__9;
      }
    }
  }
  decoratedObserver.return();
  return decoratedObserver;
};
defineProperty(Array.prototype, Symbol.observer, {enumerable: false});
$traceurRuntime.initAsyncGeneratorFunction = initAsyncGeneratorFunction;
$traceurRuntime.createAsyncGeneratorInstance = createAsyncGeneratorInstance;
$traceurRuntime.observeForEach = observeForEach;
$traceurRuntime.schedule = schedule;
$traceurRuntime.createDecoratedGenerator = createDecoratedGenerator;
