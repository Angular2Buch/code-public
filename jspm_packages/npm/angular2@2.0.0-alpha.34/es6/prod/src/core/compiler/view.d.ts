import { BindingRecord, ChangeDetector, ChangeDispatcher, DirectiveIndex, Locals, ProtoChangeDetector } from 'angular2/src/change_detection/change_detection';
import { DebugContext } from 'angular2/src/change_detection/interfaces';
import { ProtoElementInjector, ElementInjector, PreBuiltObjects, DirectiveBinding } from './element_injector';
import { ElementBinder } from './element_binder';
import * as renderApi from 'angular2/src/render/api';
import { RenderEventDispatcher } from 'angular2/src/render/api';
import { ViewRef, ProtoViewRef } from './view_ref';
import { ElementRef } from './element_ref';
export { DebugContext } from 'angular2/src/change_detection/interfaces';
export declare class AppProtoViewMergeMapping {
    renderProtoViewRef: renderApi.RenderProtoViewRef;
    renderFragmentCount: number;
    renderElementIndices: number[];
    renderInverseElementIndices: number[];
    renderTextIndices: number[];
    nestedViewIndicesByElementIndex: number[];
    hostElementIndicesByViewIndex: number[];
    nestedViewCountByViewIndex: number[];
    constructor(renderProtoViewMergeMapping: renderApi.RenderProtoViewMergeMapping);
}
export declare class AppViewContainer {
    views: List<AppView>;
}
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export declare class AppView implements ChangeDispatcher, RenderEventDispatcher {
    renderer: renderApi.Renderer;
    proto: AppProtoView;
    mainMergeMapping: AppProtoViewMergeMapping;
    viewOffset: number;
    elementOffset: number;
    textOffset: number;
    render: renderApi.RenderViewRef;
    renderFragment: renderApi.RenderFragmentRef;
    views: List<AppView>;
    rootElementInjectors: List<ElementInjector>;
    elementInjectors: List<ElementInjector>;
    viewContainers: List<AppViewContainer>;
    preBuiltObjects: List<PreBuiltObjects>;
    elementRefs: List<ElementRef>;
    ref: ViewRef;
    changeDetector: ChangeDetector;
    /**
     * The context against which data-binding expressions in this view are evaluated against.
     * This is always a component instance.
     */
    context: any;
    /**
     * Variables, local to this view, that can be used in binding expressions (in addition to the
     * context). This is used for thing like `<video #player>` or
     * `<li template="for #item of items">`, where "player" and "item" are locals, respectively.
     */
    locals: Locals;
    constructor(renderer: renderApi.Renderer, proto: AppProtoView, mainMergeMapping: AppProtoViewMergeMapping, viewOffset: number, elementOffset: number, textOffset: number, protoLocals: Map<string, any>, render: renderApi.RenderViewRef, renderFragment: renderApi.RenderFragmentRef);
    init(changeDetector: ChangeDetector, elementInjectors: List<ElementInjector>, rootElementInjectors: List<ElementInjector>, preBuiltObjects: List<PreBuiltObjects>, views: List<AppView>, elementRefs: List<ElementRef>, viewContainers: List<AppViewContainer>): void;
    setLocal(contextName: string, value: any): void;
    hydrated(): boolean;
    /**
     * Triggers the event handlers for the element and the directives.
     *
     * This method is intended to be called from directive EventEmitters.
     *
     * @param {string} eventName
     * @param {*} eventObj
     * @param {int} boundElementIndex
     */
    triggerEventHandlers(eventName: string, eventObj: Event, boundElementIndex: int): void;
    notifyOnBinding(b: BindingRecord, currentValue: any): void;
    notifyOnAllChangesDone(): void;
    getDirectiveFor(directive: DirectiveIndex): any;
    getNestedView(boundElementIndex: number): AppView;
    getHostElement(): ElementRef;
    getDebugContext(elementIndex: number, directiveIndex: DirectiveIndex): DebugContext;
    getDetectorFor(directive: DirectiveIndex): any;
    invokeElementMethod(elementIndex: number, methodName: string, args: List<any>): void;
    dispatchRenderEvent(renderElementIndex: number, eventName: string, locals: Map<string, any>): boolean;
    dispatchEvent(boundElementIndex: number, eventName: string, locals: Map<string, any>): boolean;
}
/**
 *
 */
export declare class AppProtoView {
    type: renderApi.ViewType;
    isEmbeddedFragment: boolean;
    render: renderApi.RenderProtoViewRef;
    protoChangeDetector: ProtoChangeDetector;
    variableBindings: Map<string, string>;
    variableLocations: Map<string, number>;
    textBindingCount: number;
    elementBinders: List<ElementBinder>;
    protoLocals: Map<string, any>;
    mergeMapping: AppProtoViewMergeMapping;
    ref: ProtoViewRef;
    constructor(type: renderApi.ViewType, isEmbeddedFragment: boolean, render: renderApi.RenderProtoViewRef, protoChangeDetector: ProtoChangeDetector, variableBindings: Map<string, string>, variableLocations: Map<string, number>, textBindingCount: number);
    bindElement(parent: ElementBinder, distanceToParent: int, protoElementInjector: ProtoElementInjector, componentDirective?: DirectiveBinding): ElementBinder;
    /**
     * Adds an event binding for the last created ElementBinder via bindElement.
     *
     * If the directive index is a positive integer, the event is evaluated in the context of
     * the given directive.
     *
     * If the directive index is -1, the event is evaluated in the context of the enclosing view.
     *
     * @param {string} eventName
     * @param {AST} expression
     * @param {int} directiveIndex The directive index in the binder or -1 when the event is not bound
     *                             to a directive
     */
    bindEvent(eventBindings: List<renderApi.EventBinding>, boundElementIndex: number, directiveIndex?: int): void;
}