import { Type } from "angular2/src/facade/lang";
import { Parser } from "angular2/src/change_detection/parser/parser";
import { RenderProtoViewRefStore } from 'angular2/src/web-workers/shared/render_proto_view_ref_store';
import { RenderViewWithFragmentsStore } from 'angular2/src/web-workers/shared/render_view_with_fragments_store';
export declare class Serializer {
    private _parser;
    private _protoViewStore;
    private _renderViewStore;
    private _enumRegistry;
    constructor(_parser: Parser, _protoViewStore: RenderProtoViewRefStore, _renderViewStore: RenderViewWithFragmentsStore);
    serialize(obj: any, type: Type): Object;
    deserialize(map: any, type: Type, data?: any): any;
    mapToObject(map: Map<string, any>, type?: Type): Object;
    objectToMap(obj: StringMap<string, any>, type?: Type, data?: any): Map<string, any>;
    allocateRenderViews(fragmentCount: number): void;
    private _serializeElementPropertyBinding(binding);
    private _deserializeElementPropertyBinding(map);
    private _serializeEventBinding(binding);
    private _deserializeEventBinding(map);
    private _serializeWorkerElementRef(elementRef);
    private _deserializeWorkerElementRef(map);
    private _serializeRenderProtoViewMergeMapping(mapping);
    private _deserializeRenderProtoViewMergeMapping(obj);
    private _serializeASTWithSource(tree);
    private _deserializeASTWithSource(obj, data);
    private _serializeViewDefinition(view);
    private _deserializeViewDefinition(obj);
    private _serializeDirectiveBinder(binder);
    private _deserializeDirectiveBinder(obj);
    private _serializeElementBinder(binder);
    private _deserializeElementBinder(obj);
    private _serializeProtoViewDto(view);
    private _deserializeProtoViewDto(obj);
    private _serializeDirectiveMetadata(meta);
    private _deserializeDirectiveMetadata(obj);
}