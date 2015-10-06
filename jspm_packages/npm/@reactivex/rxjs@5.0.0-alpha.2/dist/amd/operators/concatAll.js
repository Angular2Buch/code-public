/* */ 
"format cjs";
define(["require", "exports", './mergeAll-support'], function (require, exports, mergeAll_support_1) {
    function concatAll() {
        return this.lift(new mergeAll_support_1.MergeAllOperator(1));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = concatAll;
});
//# sourceMappingURL=concatAll.js.map