/* */ 
'use strict';(function (RecordType) {
    RecordType[RecordType["SELF"] = 0] = "SELF";
    RecordType[RecordType["CONST"] = 1] = "CONST";
    RecordType[RecordType["PRIMITIVE_OP"] = 2] = "PRIMITIVE_OP";
    RecordType[RecordType["PROPERTY"] = 3] = "PROPERTY";
    RecordType[RecordType["LOCAL"] = 4] = "LOCAL";
    RecordType[RecordType["INVOKE_METHOD"] = 5] = "INVOKE_METHOD";
    RecordType[RecordType["INVOKE_CLOSURE"] = 6] = "INVOKE_CLOSURE";
    RecordType[RecordType["KEYED_ACCESS"] = 7] = "KEYED_ACCESS";
    RecordType[RecordType["PIPE"] = 8] = "PIPE";
    RecordType[RecordType["INTERPOLATE"] = 9] = "INTERPOLATE";
    RecordType[RecordType["SAFE_PROPERTY"] = 10] = "SAFE_PROPERTY";
    RecordType[RecordType["COLLECTION_LITERAL"] = 11] = "COLLECTION_LITERAL";
    RecordType[RecordType["SAFE_INVOKE_METHOD"] = 12] = "SAFE_INVOKE_METHOD";
    RecordType[RecordType["DIRECTIVE_LIFECYCLE"] = 13] = "DIRECTIVE_LIFECYCLE";
})(exports.RecordType || (exports.RecordType = {}));
var RecordType = exports.RecordType;
var ProtoRecord = (function () {
    function ProtoRecord(mode, name, funcOrValue, args, fixedArgs, contextIndex, directiveIndex, selfIndex, bindingRecord, expressionAsString, lastInBinding, lastInDirective, argumentToPureFunction, referencedBySelf) {
        this.mode = mode;
        this.name = name;
        this.funcOrValue = funcOrValue;
        this.args = args;
        this.fixedArgs = fixedArgs;
        this.contextIndex = contextIndex;
        this.directiveIndex = directiveIndex;
        this.selfIndex = selfIndex;
        this.bindingRecord = bindingRecord;
        this.expressionAsString = expressionAsString;
        this.lastInBinding = lastInBinding;
        this.lastInDirective = lastInDirective;
        this.argumentToPureFunction = argumentToPureFunction;
        this.referencedBySelf = referencedBySelf;
    }
    ProtoRecord.prototype.isPureFunction = function () {
        return this.mode === RecordType.INTERPOLATE || this.mode === RecordType.COLLECTION_LITERAL;
    };
    ProtoRecord.prototype.isUsedByOtherRecord = function () { return !this.lastInBinding || this.referencedBySelf; };
    ProtoRecord.prototype.shouldBeChecked = function () {
        return this.argumentToPureFunction || this.lastInBinding || this.isPureFunction();
    };
    ProtoRecord.prototype.isPipeRecord = function () { return this.mode === RecordType.PIPE; };
    ProtoRecord.prototype.isLifeCycleRecord = function () { return this.mode === RecordType.DIRECTIVE_LIFECYCLE; };
    return ProtoRecord;
})();
exports.ProtoRecord = ProtoRecord;
//# sourceMappingURL=proto_record.js.map