/* */ 
'use strict';
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var codegen_facade_1 = require("./codegen_facade");
var proto_record_1 = require("./proto_record");
var constants_1 = require("./constants");
var CodegenLogicUtil = (function() {
  function CodegenLogicUtil(_names, _utilName, _changeDetection) {
    this._names = _names;
    this._utilName = _utilName;
    this._changeDetection = _changeDetection;
  }
  CodegenLogicUtil.prototype.genPropertyBindingEvalValue = function(protoRec) {
    var _this = this;
    return this.genEvalValue(protoRec, function(idx) {
      return _this._names.getLocalName(idx);
    }, this._names.getLocalsAccessorName());
  };
  CodegenLogicUtil.prototype.genEventBindingEvalValue = function(eventRecord, protoRec) {
    var _this = this;
    return this.genEvalValue(protoRec, function(idx) {
      return _this._names.getEventLocalName(eventRecord, idx);
    }, "locals");
  };
  CodegenLogicUtil.prototype.genEvalValue = function(protoRec, getLocalName, localsAccessor) {
    var context = (protoRec.contextIndex == -1) ? this._names.getDirectiveName(protoRec.directiveIndex) : getLocalName(protoRec.contextIndex);
    var argString = collection_1.ListWrapper.map(protoRec.args, function(arg) {
      return getLocalName(arg);
    }).join(", ");
    var rhs;
    switch (protoRec.mode) {
      case proto_record_1.RecordType.SELF:
        rhs = context;
        break;
      case proto_record_1.RecordType.CONST:
        rhs = codegen_facade_1.codify(protoRec.funcOrValue);
        break;
      case proto_record_1.RecordType.PROPERTY_READ:
        rhs = this._observe(context + "." + protoRec.name, protoRec);
        break;
      case proto_record_1.RecordType.SAFE_PROPERTY:
        var read = this._observe(context + "." + protoRec.name, protoRec);
        rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + this._observe(read, protoRec);
        break;
      case proto_record_1.RecordType.PROPERTY_WRITE:
        rhs = context + "." + protoRec.name + " = " + getLocalName(protoRec.args[0]);
        break;
      case proto_record_1.RecordType.LOCAL:
        rhs = this._observe(localsAccessor + ".get(" + codegen_facade_1.rawString(protoRec.name) + ")", protoRec);
        break;
      case proto_record_1.RecordType.INVOKE_METHOD:
        rhs = this._observe(context + "." + protoRec.name + "(" + argString + ")", protoRec);
        break;
      case proto_record_1.RecordType.SAFE_INVOKE_METHOD:
        var invoke = context + "." + protoRec.name + "(" + argString + ")";
        rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + this._observe(invoke, protoRec);
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
      case proto_record_1.RecordType.KEYED_READ:
        rhs = this._observe(context + "[" + getLocalName(protoRec.args[0]) + "]", protoRec);
        break;
      case proto_record_1.RecordType.KEYED_WRITE:
        rhs = context + "[" + getLocalName(protoRec.args[0]) + "] = " + getLocalName(protoRec.args[1]);
        break;
      case proto_record_1.RecordType.CHAIN:
        rhs = 'null';
        break;
      default:
        throw new lang_1.BaseException("Unknown operation " + protoRec.mode);
    }
    return getLocalName(protoRec.selfIndex) + " = " + rhs + ";";
  };
  CodegenLogicUtil.prototype._observe = function(exp, rec) {
    if (lang_1.StringWrapper.equals(this._changeDetection, constants_1.ON_PUSH_OBSERVE)) {
      return "this.observeValue(" + exp + ", " + rec.selfIndex + ")";
    } else {
      return exp;
    }
  };
  CodegenLogicUtil.prototype.genPropertyBindingTargets = function(propertyBindingTargets, genDebugInfo) {
    var _this = this;
    var bs = propertyBindingTargets.map(function(b) {
      if (lang_1.isBlank(b))
        return "null";
      var debug = genDebugInfo ? codegen_facade_1.codify(b.debug) : "null";
      return _this._utilName + ".bindingTarget(" + codegen_facade_1.codify(b.mode) + ", " + b.elementIndex + ", " + codegen_facade_1.codify(b.name) + ", " + codegen_facade_1.codify(b.unit) + ", " + debug + ")";
    });
    return "[" + bs.join(", ") + "]";
  };
  CodegenLogicUtil.prototype.genDirectiveIndices = function(directiveRecords) {
    var _this = this;
    var bs = directiveRecords.map(function(b) {
      return (_this._utilName + ".directiveIndex(" + b.directiveIndex.elementIndex + ", " + b.directiveIndex.directiveIndex + ")");
    });
    return "[" + bs.join(", ") + "]";
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
  CodegenLogicUtil.prototype.genHydrateDirectives = function(directiveRecords) {
    var res = [];
    for (var i = 0; i < directiveRecords.length; ++i) {
      var r = directiveRecords[i];
      res.push(this._names.getDirectiveName(r.directiveIndex) + " = " + this._genReadDirective(i) + ";");
    }
    return res.join("\n");
  };
  CodegenLogicUtil.prototype._genReadDirective = function(index) {
    if (lang_1.StringWrapper.equals(this._changeDetection, constants_1.ON_PUSH_OBSERVE)) {
      return "this.observeDirective(this.getDirectiveFor(directives, " + index + "), " + index + ")";
    } else {
      return "this.getDirectiveFor(directives, " + index + ")";
    }
  };
  CodegenLogicUtil.prototype.genHydrateDetectors = function(directiveRecords) {
    var res = [];
    for (var i = 0; i < directiveRecords.length; ++i) {
      var r = directiveRecords[i];
      if (!r.isDefaultChangeDetection()) {
        res.push(this._names.getDetectorName(r.directiveIndex) + " = this.getDetectorFor(directives, " + i + ");");
      }
    }
    return res.join("\n");
  };
  return CodegenLogicUtil;
})();
exports.CodegenLogicUtil = CodegenLogicUtil;