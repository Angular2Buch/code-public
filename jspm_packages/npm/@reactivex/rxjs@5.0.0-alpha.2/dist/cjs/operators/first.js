/* */ 
'use strict';
exports.__esModule = true;
exports['default'] = first;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }});
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _Subscriber2 = require('../Subscriber');
var _Subscriber3 = _interopRequireDefault(_Subscriber2);
var _utilTryCatch = require('../util/tryCatch');
var _utilTryCatch2 = _interopRequireDefault(_utilTryCatch);
var _utilErrorObject = require('../util/errorObject');
var _utilBindCallback = require('../util/bindCallback');
var _utilBindCallback2 = _interopRequireDefault(_utilBindCallback);
var _utilEmptyError = require('../util/EmptyError');
var _utilEmptyError2 = _interopRequireDefault(_utilEmptyError);
function first(predicate, thisArg, defaultValue) {
  return this.lift(new FirstOperator(predicate, thisArg, defaultValue, this));
}
var FirstOperator = (function() {
  function FirstOperator(predicate, thisArg, defaultValue, source) {
    _classCallCheck(this, FirstOperator);
    this.predicate = predicate;
    this.thisArg = thisArg;
    this.defaultValue = defaultValue;
    this.source = source;
  }
  FirstOperator.prototype.call = function call(observer) {
    return new FirstSubscriber(observer, this.predicate, this.thisArg, this.defaultValue, this.source);
  };
  return FirstOperator;
})();
var FirstSubscriber = (function(_Subscriber) {
  _inherits(FirstSubscriber, _Subscriber);
  function FirstSubscriber(destination, predicate, thisArg, defaultValue, source) {
    _classCallCheck(this, FirstSubscriber);
    _Subscriber.call(this, destination);
    this.thisArg = thisArg;
    this.defaultValue = defaultValue;
    this.source = source;
    this.index = 0;
    this.hasCompleted = false;
    if (typeof predicate === 'function') {
      this.predicate = _utilBindCallback2['default'](predicate, thisArg, 3);
    }
  }
  FirstSubscriber.prototype._next = function _next(value) {
    var destination = this.destination;
    var predicate = this.predicate;
    var passed = true;
    if (predicate) {
      passed = _utilTryCatch2['default'](predicate)(value, this.index++, this.source);
      if (passed === _utilErrorObject.errorObject) {
        destination.error(passed.e);
        return;
      }
    }
    if (passed) {
      destination.next(value);
      destination.complete();
      this.hasCompleted = true;
    }
  };
  FirstSubscriber.prototype._complete = function _complete() {
    var destination = this.destination;
    if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
      destination.next(this.defaultValue);
      destination.complete();
    } else if (!this.hasCompleted) {
      destination.error(new _utilEmptyError2['default']());
    }
  };
  return FirstSubscriber;
})(_Subscriber3['default']);
module.exports = exports['default'];
