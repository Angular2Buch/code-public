/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var abstract_change_detector_1 = require("./abstract_change_detector");
var change_detection_util_1 = require("./change_detection_util");
var proto_record_1 = require("./proto_record");
var DynamicChangeDetector = (function(_super) {
  __extends(DynamicChangeDetector, _super);
  function DynamicChangeDetector(id, changeDetectionStrategy, dispatcher, protos, directiveRecords) {
    _super.call(this, id, dispatcher, protos, directiveRecords, change_detection_util_1.ChangeDetectionUtil.changeDetectionMode(changeDetectionStrategy));
    this.directives = null;
    var len = protos.length + 1;
    this.values = collection_1.ListWrapper.createFixedSize(len);
    this.localPipes = collection_1.ListWrapper.createFixedSize(len);
    this.prevContexts = collection_1.ListWrapper.createFixedSize(len);
    this.changes = collection_1.ListWrapper.createFixedSize(len);
    this.dehydrateDirectives(false);
  }
  DynamicChangeDetector.prototype.hydrateDirectives = function(directives) {
    this.values[0] = this.context;
    this.directives = directives;
  };
  DynamicChangeDetector.prototype.dehydrateDirectives = function(destroyPipes) {
    if (destroyPipes) {
      this._destroyPipes();
    }
    this.values[0] = null;
    this.directives = null;
    collection_1.ListWrapper.fill(this.values, change_detection_util_1.ChangeDetectionUtil.uninitialized, 1);
    collection_1.ListWrapper.fill(this.changes, false);
    collection_1.ListWrapper.fill(this.localPipes, null);
    collection_1.ListWrapper.fill(this.prevContexts, change_detection_util_1.ChangeDetectionUtil.uninitialized);
  };
  DynamicChangeDetector.prototype._destroyPipes = function() {
    for (var i = 0; i < this.localPipes.length; ++i) {
      if (lang_1.isPresent(this.localPipes[i])) {
        this.localPipes[i].onDestroy();
      }
    }
  };
  DynamicChangeDetector.prototype.checkNoChanges = function() {
    this.runDetectChanges(true);
  };
  DynamicChangeDetector.prototype.detectChangesInRecordsInternal = function(throwOnChange) {
    var protos = this.protos;
    var changes = null;
    var isChanged = false;
    for (var i = 0; i < protos.length; ++i) {
      var proto = protos[i];
      var bindingRecord = proto.bindingRecord;
      var directiveRecord = bindingRecord.directiveRecord;
      if (this._firstInBinding(proto)) {
        this.firstProtoInCurrentBinding = proto.selfIndex;
      }
      if (proto.isLifeCycleRecord()) {
        if (proto.name === "onCheck" && !throwOnChange) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onCheck();
        } else if (proto.name === "onInit" && !throwOnChange && !this.alreadyChecked) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onInit();
        } else if (proto.name === "onChange" && lang_1.isPresent(changes) && !throwOnChange) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onChange(changes);
        }
      } else {
        var change = this._check(proto, throwOnChange);
        if (lang_1.isPresent(change)) {
          this._updateDirectiveOrElement(change, bindingRecord);
          isChanged = true;
          changes = this._addChange(bindingRecord, change, changes);
        }
      }
      if (proto.lastInDirective) {
        changes = null;
        if (isChanged && bindingRecord.isOnPushChangeDetection()) {
          this._getDetectorFor(directiveRecord.directiveIndex).markAsCheckOnce();
        }
        isChanged = false;
      }
    }
    this.alreadyChecked = true;
  };
  DynamicChangeDetector.prototype._firstInBinding = function(r) {
    var prev = change_detection_util_1.ChangeDetectionUtil.protoByIndex(this.protos, r.selfIndex - 1);
    return lang_1.isBlank(prev) || prev.bindingRecord !== r.bindingRecord;
  };
  DynamicChangeDetector.prototype.callOnAllChangesDone = function() {
    _super.prototype.callOnAllChangesDone.call(this);
    var dirs = this.directiveRecords;
    for (var i = dirs.length - 1; i >= 0; --i) {
      var dir = dirs[i];
      if (dir.callOnAllChangesDone) {
        this._getDirectiveFor(dir.directiveIndex).onAllChangesDone();
      }
    }
  };
  DynamicChangeDetector.prototype._updateDirectiveOrElement = function(change, bindingRecord) {
    if (lang_1.isBlank(bindingRecord.directiveRecord)) {
      this.dispatcher.notifyOnBinding(bindingRecord, change.currentValue);
    } else {
      var directiveIndex = bindingRecord.directiveRecord.directiveIndex;
      bindingRecord.setter(this._getDirectiveFor(directiveIndex), change.currentValue);
    }
  };
  DynamicChangeDetector.prototype._addChange = function(bindingRecord, change, changes) {
    if (bindingRecord.callOnChange()) {
      return _super.prototype.addChange.call(this, changes, change.previousValue, change.currentValue);
    } else {
      return changes;
    }
  };
  DynamicChangeDetector.prototype._getDirectiveFor = function(directiveIndex) {
    return this.directives.getDirectiveFor(directiveIndex);
  };
  DynamicChangeDetector.prototype._getDetectorFor = function(directiveIndex) {
    return this.directives.getDetectorFor(directiveIndex);
  };
  DynamicChangeDetector.prototype._check = function(proto, throwOnChange) {
    if (proto.isPipeRecord()) {
      return this._pipeCheck(proto, throwOnChange);
    } else {
      return this._referenceCheck(proto, throwOnChange);
    }
  };
  DynamicChangeDetector.prototype._referenceCheck = function(proto, throwOnChange) {
    if (this._pureFuncAndArgsDidNotChange(proto)) {
      this._setChanged(proto, false);
      return null;
    }
    var currValue = this._calculateCurrValue(proto);
    if (proto.shouldBeChecked()) {
      var prevValue = this._readSelf(proto);
      if (!isSame(prevValue, currValue)) {
        if (proto.lastInBinding) {
          var change = change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, currValue);
          if (throwOnChange)
            this.throwOnChangeError(prevValue, currValue);
          this._writeSelf(proto, currValue);
          this._setChanged(proto, true);
          return change;
        } else {
          this._writeSelf(proto, currValue);
          this._setChanged(proto, true);
          return null;
        }
      } else {
        this._setChanged(proto, false);
        return null;
      }
    } else {
      this._writeSelf(proto, currValue);
      this._setChanged(proto, true);
      return null;
    }
  };
  DynamicChangeDetector.prototype._calculateCurrValue = function(proto) {
    switch (proto.mode) {
      case proto_record_1.RecordType.SELF:
        return this._readContext(proto);
      case proto_record_1.RecordType.CONST:
        return proto.funcOrValue;
      case proto_record_1.RecordType.PROPERTY:
        var context = this._readContext(proto);
        return proto.funcOrValue(context);
      case proto_record_1.RecordType.SAFE_PROPERTY:
        var context = this._readContext(proto);
        return lang_1.isBlank(context) ? null : proto.funcOrValue(context);
      case proto_record_1.RecordType.LOCAL:
        return this.locals.get(proto.name);
      case proto_record_1.RecordType.INVOKE_METHOD:
        var context = this._readContext(proto);
        var args = this._readArgs(proto);
        return proto.funcOrValue(context, args);
      case proto_record_1.RecordType.SAFE_INVOKE_METHOD:
        var context = this._readContext(proto);
        if (lang_1.isBlank(context)) {
          return null;
        }
        var args = this._readArgs(proto);
        return proto.funcOrValue(context, args);
      case proto_record_1.RecordType.KEYED_ACCESS:
        var arg = this._readArgs(proto)[0];
        return this._readContext(proto)[arg];
      case proto_record_1.RecordType.INVOKE_CLOSURE:
        return lang_1.FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
      case proto_record_1.RecordType.INTERPOLATE:
      case proto_record_1.RecordType.PRIMITIVE_OP:
      case proto_record_1.RecordType.COLLECTION_LITERAL:
        return lang_1.FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
      default:
        throw new lang_1.BaseException("Unknown operation " + proto.mode);
    }
  };
  DynamicChangeDetector.prototype._pipeCheck = function(proto, throwOnChange) {
    var context = this._readContext(proto);
    var args = this._readArgs(proto);
    var pipe = this._pipeFor(proto, context);
    var currValue = pipe.transform(context, args);
    if (proto.shouldBeChecked()) {
      var prevValue = this._readSelf(proto);
      if (!isSame(prevValue, currValue)) {
        currValue = change_detection_util_1.ChangeDetectionUtil.unwrapValue(currValue);
        if (proto.lastInBinding) {
          var change = change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, currValue);
          if (throwOnChange)
            this.throwOnChangeError(prevValue, currValue);
          this._writeSelf(proto, currValue);
          this._setChanged(proto, true);
          return change;
        } else {
          this._writeSelf(proto, currValue);
          this._setChanged(proto, true);
          return null;
        }
      } else {
        this._setChanged(proto, false);
        return null;
      }
    } else {
      this._writeSelf(proto, currValue);
      this._setChanged(proto, true);
      return null;
    }
  };
  DynamicChangeDetector.prototype._pipeFor = function(proto, context) {
    var storedPipe = this._readPipe(proto);
    if (lang_1.isPresent(storedPipe) && storedPipe.supports(context)) {
      return storedPipe;
    }
    if (lang_1.isPresent(storedPipe)) {
      storedPipe.onDestroy();
    }
    var pipe = this.pipes.get(proto.name, context, this.ref);
    this._writePipe(proto, pipe);
    return pipe;
  };
  DynamicChangeDetector.prototype._readContext = function(proto) {
    if (proto.contextIndex == -1) {
      return this._getDirectiveFor(proto.directiveIndex);
    } else {
      return this.values[proto.contextIndex];
    }
    return this.values[proto.contextIndex];
  };
  DynamicChangeDetector.prototype._readSelf = function(proto) {
    return this.values[proto.selfIndex];
  };
  DynamicChangeDetector.prototype._writeSelf = function(proto, value) {
    this.values[proto.selfIndex] = value;
  };
  DynamicChangeDetector.prototype._readPipe = function(proto) {
    return this.localPipes[proto.selfIndex];
  };
  DynamicChangeDetector.prototype._writePipe = function(proto, value) {
    this.localPipes[proto.selfIndex] = value;
  };
  DynamicChangeDetector.prototype._setChanged = function(proto, value) {
    if (proto.argumentToPureFunction)
      this.changes[proto.selfIndex] = value;
  };
  DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange = function(proto) {
    return proto.isPureFunction() && !this._argsChanged(proto);
  };
  DynamicChangeDetector.prototype._argsChanged = function(proto) {
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      if (this.changes[args[i]]) {
        return true;
      }
    }
    return false;
  };
  DynamicChangeDetector.prototype._readArgs = function(proto) {
    var res = collection_1.ListWrapper.createFixedSize(proto.args.length);
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      res[i] = this.values[args[i]];
    }
    return res;
  };
  return DynamicChangeDetector;
})(abstract_change_detector_1.AbstractChangeDetector);
exports.DynamicChangeDetector = DynamicChangeDetector;
function isSame(a, b) {
  if (a === b)
    return true;
  if (a instanceof String && b instanceof String && a == b)
    return true;
  if ((a !== a) && (b !== b))
    return true;
  return false;
}