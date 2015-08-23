import { ProtoViewRef } from './view_ref';
import { ElementRef } from './element_ref';
/**
 * Reference to a template within a component.
 *
 * Represents an opaque reference to the underlying template that can
 * be instantiated using the {@link ViewContainerRef}.
 */
export declare class TemplateRef {
    /**
     * The location of the template
     */
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    private _getProtoView();
    protoViewRef: ProtoViewRef;
    /**
     * Whether this template has a local variable with the given name
     */
    hasLocal(name: string): boolean;
}