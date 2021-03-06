/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './mergeMapTo-support'], function (require, exports, mergeMapTo_support_1) {
    function switchMapTo(observable, projectResult) {
        return this.lift(new SwitchMapToOperator(observable, projectResult));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = switchMapTo;
    var SwitchMapToOperator = (function () {
        function SwitchMapToOperator(observable, resultSelector) {
            this.observable = observable;
            this.resultSelector = resultSelector;
        }
        SwitchMapToOperator.prototype.call = function (subscriber) {
            return new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector);
        };
        return SwitchMapToOperator;
    })();
    var SwitchMapToSubscriber = (function (_super) {
        __extends(SwitchMapToSubscriber, _super);
        function SwitchMapToSubscriber(destination, observable, resultSelector) {
            _super.call(this, destination, observable, resultSelector, 1);
        }
        return SwitchMapToSubscriber;
    })(mergeMapTo_support_1.MergeMapToSubscriber);
});
//# sourceMappingURL=switchMapTo.js.map