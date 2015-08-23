/* */ 
'use strict';
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var codegen_facade_1 = require("./codegen_facade");
var proto_record_1 = require("./proto_record");
var CodegenLogicUtil = (function() {
  function CodegenLogicUtil(_names, _utilName) {
    this._names = _names;
    this._utilName = _utilName;
  }
  CodegenLogicUtil.prototype.genUpdateCurrentValue = function(protoRec) {
    var _this = this;
    var context = (protoRec.contextIndex == -1) ? this._names.getDirectiveName(protoRec.directiveIndex) : this._names.getLocalName(protoRec.contextIndex);
    var argString = collection_1.ListWrapper.map(protoRec.args, function(arg) {
      return _this._names.getLocalName(arg);
    }).join(", ");
    var rhs;
    switch (protoRec.mode) {
      case proto_record_1.RecordType.SELF:
        rhs = context;
        break;
      case proto_record_1.RecordType.CONST:
        rhs = codegen_facade_1.codify(protoRec.funcOrValue);
        break;
      case proto_record_1.RecordType.PROPERTY:
        rhs = context + "." + protoRec.name;
        break;
      case proto_record_1.RecordType.SAFE_PROPERTY:
        rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + context + "." + protoRec.name;
        break;
      case proto_record_1.RecordType.LOCAL:
        rhs = this._names.getLocalsAccessorName() + ".get('" + protoRec.name + "')";
        break;
      case proto_record_1.RecordType.INVOKE_METHOD:
        rhs = context + "." + protoRec.name + "(" + argString + ")";
        break;
      case proto_record_1.RecordType.SAFE_INVOKE_METHOD:
        rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + context + "." + protoRec.name + "(" + argString + ")";
        break;
      case proto_record_1.RecordType.INVOKE_CLOSURE:
        rhs = context + "(" + argString + ")";
        break;
      case proto_record_1.RecordType.PRIMITIVE_OP:
        rhs = this._utilName + "." + protoRec.name + "(" + argString + ")";
        break;
      case proto_record_1.RecordType.COLLECTION_LITERAL:
        rhs = this._utilName + "." + protoRec.name + "(" + argString + ")";
        break;
      case proto_record_1.RecordType.INTERPOLATE:
        rhs = this._genInterpolation(protoRec);
        break;
      case proto_record_1.RecordType.KEYED_ACCESS:
        rhs = context + "[" + this._names.getLocalName(protoRec.args[0]) + "]";
        break;
      default:
        throw new lang_1.BaseException("Unknown operation " + protoRec.mode);
    }
    return this._names.getLocalName(protoRec.selfIndex) + " = " + rhs + ";";
  };
  CodegenLogicUtil.prototype._genInterpolation = function(protoRec) {
    var iVals = [];
    for (var i = 0; i < protoRec.args.length; ++i) {
      iVals.push(codegen_facade_1.codify(protoRec.fixedArgs[i]));
      iVals.push(this._utilName + ".s(" + this._names.getLocalName(protoRec.args[i]) + ")");
    }
    iVals.push(codegen_facade_1.codify(protoRec.fixedArgs[protoRec.args.length]));
    return codegen_facade_1.combineGeneratedStrings(iVals);
  };
  return CodegenLogicUtil;
})();
exports.CodegenLogicUtil = CodegenLogicUtil;
