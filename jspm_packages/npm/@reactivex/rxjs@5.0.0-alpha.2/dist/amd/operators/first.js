/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Subscriber', '../util/tryCatch', '../util/errorObject', '../util/bindCallback', '../util/EmptyError'], function (require, exports, Subscriber_1, tryCatch_1, errorObject_1, bindCallback_1, EmptyError_1) {
    function first(predicate, thisArg, defaultValue) {
        return this.lift(new FirstOperator(predicate, thisArg, defaultValue, this));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = first;
    var FirstOperator = (function () {
        function FirstOperator(predicate, thisArg, defaultValue, source) {
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.defaultValue = defaultValue;
            this.source = source;
        }
        FirstOperator.prototype.call = function (observer) {
            return new FirstSubscriber(observer, this.predicate, this.thisArg, this.defaultValue, this.source);
        };
        return FirstOperator;
    })();
    var FirstSubscriber = (function (_super) {
        __extends(FirstSubscriber, _super);
        function FirstSubscriber(destination, predicate, thisArg, defaultValue, source) {
            _super.call(this, destination);
            this.thisArg = thisArg;
            this.defaultValue = defaultValue;
            this.source = source;
            this.index = 0;
            this.hasCompleted = false;
            if (typeof predicate === 'function') {
                this.predicate = bindCallback_1.default(predicate, thisArg, 3);
            }
        }
        FirstSubscriber.prototype._next = function (value) {
            var destination = this.destination;
            var predicate = this.predicate;
            var passed = true;
            if (predicate) {
                passed = tryCatch_1.default(predicate)(value, this.index++, this.source);
                if (passed === errorObject_1.errorObject) {
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
        FirstSubscriber.prototype._complete = function () {
            var destination = this.destination;
            if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
                destination.next(this.defaultValue);
                destination.complete();
            }
            else if (!this.hasCompleted) {
                destination.error(new EmptyError_1.default);
            }
        };
        return FirstSubscriber;
    })(Subscriber_1.default);
});
//# sourceMappingURL=first.js.map