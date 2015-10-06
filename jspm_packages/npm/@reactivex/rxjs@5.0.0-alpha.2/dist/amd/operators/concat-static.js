/* */ 
"format cjs";
define(["require", "exports", '../Observable', '../schedulers/immediate'], function (require, exports, Observable_1, immediate_1) {
    function concat() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var scheduler = immediate_1.default;
        var args = observables;
        var len = args.length;
        if (typeof (args[observables.length - 1]).schedule === 'function') {
            scheduler = args.pop();
            args.push(1, scheduler);
        }
        return Observable_1.default.fromArray(observables).mergeAll(1);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = concat;
});
//# sourceMappingURL=concat-static.js.map