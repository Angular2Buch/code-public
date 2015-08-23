import { AST } from 'angular2/src/change_detection/change_detection';
export declare class DomElementBinder {
    textNodeIndices: List<number>;
    hasNestedProtoView: boolean;
    eventLocals: AST;
    localEvents: List<Event>;
    globalEvents: List<Event>;
    hasNativeShadowRoot: boolean;
    constructor({textNodeIndices, hasNestedProtoView, eventLocals, localEvents, globalEvents, hasNativeShadowRoot}?: {
        textNodeIndices?: List<number>;
        hasNestedProtoView?: boolean;
        eventLocals?: AST;
        localEvents?: List<Event>;
        globalEvents?: List<Event>;
        hasNativeShadowRoot?: boolean;
    });
}
export declare class Event {
    name: string;
    target: string;
    fullName: string;
    constructor(name: string, target: string, fullName: string);
}
export declare class HostAction {
    actionName: string;
    actionExpression: string;
    expression: AST;
    constructor(actionName: string, actionExpression: string, expression: AST);
}