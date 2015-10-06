/* */ 
"format cjs";
define(["require", "exports", './mergeMap-support'], function (require, exports, mergeMap_support_1) {
    function concatMap(project, projectResult) {
        return this.lift(new mergeMap_support_1.MergeMapOperator(project, projectResult, 1));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = concatMap;
});
//# sourceMappingURL=concatMap.js.map