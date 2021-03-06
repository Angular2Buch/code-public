/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('./lang');
var Subject = require('@reactivex/rxjs/dist/cjs/Subject');
var PromiseWrapper = (function() {
  function PromiseWrapper() {}
  PromiseWrapper.resolve = function(obj) {
    return Promise.resolve(obj);
  };
  PromiseWrapper.reject = function(obj, _) {
    return Promise.reject(obj);
  };
  PromiseWrapper.catchError = function(promise, onError) {
    return promise.catch(onError);
  };
  PromiseWrapper.all = function(promises) {
    if (promises.length == 0)
      return Promise.resolve([]);
    return Promise.all(promises);
  };
  PromiseWrapper.then = function(promise, success, rejection) {
    return promise.then(success, rejection);
  };
  PromiseWrapper.wrap = function(computation) {
    return new Promise(function(res, rej) {
      try {
        res(computation());
      } catch (e) {
        rej(e);
      }
    });
  };
  PromiseWrapper.completer = function() {
    var resolve;
    var reject;
    var p = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    return {
      promise: p,
      resolve: resolve,
      reject: reject
    };
  };
  return PromiseWrapper;
})();
exports.PromiseWrapper = PromiseWrapper;
var TimerWrapper = (function() {
  function TimerWrapper() {}
  TimerWrapper.setTimeout = function(fn, millis) {
    return lang_1.global.setTimeout(fn, millis);
  };
  TimerWrapper.clearTimeout = function(id) {
    lang_1.global.clearTimeout(id);
  };
  TimerWrapper.setInterval = function(fn, millis) {
    return lang_1.global.setInterval(fn, millis);
  };
  TimerWrapper.clearInterval = function(id) {
    lang_1.global.clearInterval(id);
  };
  return TimerWrapper;
})();
exports.TimerWrapper = TimerWrapper;
var ObservableWrapper = (function() {
  function ObservableWrapper() {}
  ObservableWrapper.subscribe = function(emitter, onNext, onThrow, onReturn) {
    if (onThrow === void 0) {
      onThrow = null;
    }
    if (onReturn === void 0) {
      onReturn = null;
    }
    return emitter.observer({
      next: onNext,
      throw: onThrow,
      return: onReturn
    });
  };
  ObservableWrapper.isObservable = function(obs) {
    return obs instanceof Observable;
  };
  ObservableWrapper.dispose = function(subscription) {
    subscription.unsubscribe();
  };
  ObservableWrapper.callNext = function(emitter, value) {
    emitter.next(value);
  };
  ObservableWrapper.callThrow = function(emitter, error) {
    emitter.throw(error);
  };
  ObservableWrapper.callReturn = function(emitter) {
    emitter.return(null);
  };
  return ObservableWrapper;
})();
exports.ObservableWrapper = ObservableWrapper;
var Observable = (function() {
  function Observable() {}
  Observable.prototype.observer = function(generator) {
    return null;
  };
  return Observable;
})();
exports.Observable = Observable;
var EventEmitter = (function(_super) {
  __extends(EventEmitter, _super);
  function EventEmitter() {
    _super.apply(this, arguments);
    this._subject = new Subject();
  }
  EventEmitter.prototype.observer = function(generator) {
    return this._subject.subscribe(function(value) {
      setTimeout(function() {
        return generator.next(value);
      });
    }, function(error) {
      return generator.throw ? generator.throw(error) : null;
    }, function() {
      return generator.return ? generator.return() : null;
    });
  };
  EventEmitter.prototype.toRx = function() {
    return this;
  };
  EventEmitter.prototype.next = function(value) {
    this._subject.next(value);
  };
  EventEmitter.prototype.throw = function(error) {
    this._subject.error(error);
  };
  EventEmitter.prototype.return = function(value) {
    this._subject.complete();
  };
  return EventEmitter;
})(Observable);
exports.EventEmitter = EventEmitter;
