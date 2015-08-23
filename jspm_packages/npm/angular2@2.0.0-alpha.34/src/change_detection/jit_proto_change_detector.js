/* */ 
'use strict';
var collection_1 = require("../facade/collection");
var change_detection_jit_generator_1 = require("./change_detection_jit_generator");
var coalesce_1 = require("./coalesce");
var proto_change_detector_1 = require("./proto_change_detector");
var JitProtoChangeDetector = (function() {
  function JitProtoChangeDetector(definition) {
    this.definition = definition;
    this._factory = this._createFactory(definition);
  }
  JitProtoChangeDetector.isSupported = function() {
    return true;
  };
  JitProtoChangeDetector.prototype.instantiate = function(dispatcher) {
    return this._factory(dispatcher);
  };
  JitProtoChangeDetector.prototype._createFactory = function(definition) {
    var recordBuilder = new proto_change_detector_1.ProtoRecordBuilder();
    collection_1.ListWrapper.forEach(definition.bindingRecords, function(b) {
      recordBuilder.add(b, definition.variableNames);
    });
    var records = coalesce_1.coalesce(recordBuilder.records);
    return new change_detection_jit_generator_1.ChangeDetectorJITGenerator(definition.id, definition.strategy, records, this.definition.directiveRecords, this.definition.generateCheckNoChanges).generate();
  };
  return JitProtoChangeDetector;
})();
exports.JitProtoChangeDetector = JitProtoChangeDetector;