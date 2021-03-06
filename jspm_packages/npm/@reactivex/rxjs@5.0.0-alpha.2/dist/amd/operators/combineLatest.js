/* */ 
"format cjs";
define(["require", "exports", '../observables/ArrayObservable', './combineLatest-support'], function (require, exports, ArrayObservable_1, combineLatest_support_1) {
    function combineLatest() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        observables.unshift(this);
        var project;
        if (typeof observables[observables.length - 1] === "function") {
            project = observables.pop();
        }
        return new ArrayObservable_1.default(observables).lift(new combineLatest_support_1.CombineLatestOperator(project));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = combineLatest;
});
//# sourceMappingURL=combineLatest.js.map