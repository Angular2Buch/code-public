/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/di';
import { RenderDirectiveMetadata, ProtoViewDto, ViewDefinition, RenderProtoViewRef, RenderProtoViewMergeMapping, RenderCompiler } from 'angular2/src/render/api';
import { RENDER_COMPILER_CHANNEL } from 'angular2/src/web_workers/shared/messaging_api';
import { bind } from './bind';
import { ServiceMessageBrokerFactory } from 'angular2/src/web_workers/shared/service_message_broker';
export let MessageBasedRenderCompiler = class {
    constructor(brokerFactory, _renderCompiler) {
        this._renderCompiler = _renderCompiler;
        var broker = brokerFactory.createMessageBroker(RENDER_COMPILER_CHANNEL);
        broker.registerMethod("compileHost", [RenderDirectiveMetadata], bind(this._renderCompiler.compileHost, this._renderCompiler), ProtoViewDto);
        broker.registerMethod("compile", [ViewDefinition], bind(this._renderCompiler.compile, this._renderCompiler), ProtoViewDto);
        broker.registerMethod("mergeProtoViewsRecursively", [RenderProtoViewRef], bind(this._renderCompiler.mergeProtoViewsRecursively, this._renderCompiler), RenderProtoViewMergeMapping);
    }
};
MessageBasedRenderCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [ServiceMessageBrokerFactory, RenderCompiler])
], MessageBasedRenderCompiler);
//# sourceMappingURL=render_compiler.js.map