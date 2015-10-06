/* */ 
"format cjs";
define(["require", "exports", './mergeMapTo-support'], function (require, exports, mergeMapTo_support_1) {
    function concatMapTo(observable, projectResult) {
        return this.lift(new mergeMapTo_support_1.MergeMapToOperator(observable, projectResult, 1));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = concatMapTo;
});
//# sourceMappingURL=concatMapTo.js.map