/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Subscriber', '../util/tryCatch', '../util/errorObject', '../util/bindCallback', '../util/EmptyError'], function (require, exports, Subscriber_1, tryCatch_1, errorObject_1, bindCallback_1, EmptyError_1) {
    function last(predicate, thisArg, defaultValue) {
        return this.lift(new LastOperator(predicate, thisArg, defaultValue, this));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = last;
    var LastOperator = (function () {
        function LastOperator(predicate, thisArg, defaultValue, source) {
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.defaultValue = defaultValue;
            this.source = source;
        }
        LastOperator.prototype.call = function (observer) {
            return new LastSubscriber(observer, this.predicate, this.thisArg, this.defaultValue, this.source);
        };
        return LastOperator;
    })();
    var LastSubscriber = (function (_super) {
        __extends(LastSubscriber, _super);
        function LastSubscriber(destination, predicate, thisArg, defaultValue, source) {
            _super.call(this, destination);
            this.thisArg = thisArg;
            this.defaultValue = defaultValue;
            this.source = source;
            this.hasValue = false;
            this.index = 0;
            if (typeof defaultValue !== 'undefined') {
                this.lastValue = defaultValue;
                this.hasValue = true;
            }
            if (typeof predicate === 'function') {
                this.predicate = bindCallback_1.default(predicate, thisArg, 3);
            }
        }
        LastSubscriber.prototype._next = function (value) {
            var predicate = this.predicate;
            if (predicate) {
                var result = tryCatch_1.default(predicate)(value, this.index++, this.source);
                if (result === errorObject_1.errorObject) {
                    this.destination.error(result.e);
                }
                else if (result) {
                    this.lastValue = value;
                    this.hasValue = true;
                }
            }
            else {
                this.lastValue = value;
                this.hasValue = true;
            }
        };
        LastSubscriber.prototype._complete = function () {
            var destination = this.destination;
            if (this.hasValue) {
                destination.next(this.lastValue);
                destination.complete();
            }
            else {
                destination.error(new EmptyError_1.default);
            }
        };
        return LastSubscriber;
    })(Subscriber_1.default);
});
//# sourceMappingURL=last.js.map