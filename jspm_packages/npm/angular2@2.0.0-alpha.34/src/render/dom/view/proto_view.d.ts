import { DomElementBinder } from './element_binder';
import { RenderProtoViewRef, ViewType, ViewEncapsulation } from '../../api';
import { TemplateCloner } from '../template_cloner';
export declare function resolveInternalDomProtoView(protoViewRef: RenderProtoViewRef): DomProtoView;
export declare class DomProtoViewRef extends RenderProtoViewRef {
    _protoView: DomProtoView;
    constructor(_protoView: DomProtoView);
}
export declare class DomProtoView {
    type: ViewType;
    cloneableTemplate: Element | string;
    encapsulation: ViewEncapsulation;
    elementBinders: List<DomElementBinder>;
    hostAttributes: Map<string, string>;
    rootTextNodeIndices: number[];
    boundTextNodeCount: number;
    fragmentsRootNodeCount: number[];
    isSingleElementFragment: boolean;
    static create(templateCloner: TemplateCloner, type: ViewType, rootElement: Element, viewEncapsulation: ViewEncapsulation, fragmentsRootNodeCount: number[], rootTextNodeIndices: number[], elementBinders: List<DomElementBinder>, hostAttributes: Map<string, string>): DomProtoView;
    constructor(type: ViewType, cloneableTemplate: Element | string, encapsulation: ViewEncapsulation, elementBinders: List<DomElementBinder>, hostAttributes: Map<string, string>, rootTextNodeIndices: number[], boundTextNodeCount: number, fragmentsRootNodeCount: number[], isSingleElementFragment: boolean);
}
