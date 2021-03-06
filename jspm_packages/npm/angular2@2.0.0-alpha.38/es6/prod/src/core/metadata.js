/* */ 
"format cjs";
/**
 * This indirection is needed to free up Component, etc symbols in the public API
 * to be used by the decorator versions of these annotations.
 */
export { QueryMetadata, ContentChildrenMetadata, ContentChildMetadata, ViewChildrenMetadata, ViewQueryMetadata, ViewChildMetadata, AttributeMetadata } from './metadata/di';
export { ComponentMetadata, DirectiveMetadata, PipeMetadata, InputMetadata, OutputMetadata, HostBindingMetadata, HostListenerMetadata } from './metadata/directives';
export { ViewMetadata, ViewEncapsulation } from './metadata/view';
import { QueryMetadata, ContentChildrenMetadata, ContentChildMetadata, ViewChildrenMetadata, ViewChildMetadata, ViewQueryMetadata, AttributeMetadata } from './metadata/di';
import { ComponentMetadata, DirectiveMetadata, PipeMetadata, InputMetadata, OutputMetadata, HostBindingMetadata, HostListenerMetadata } from './metadata/directives';
import { ViewMetadata } from './metadata/view';
import { makeDecorator, makeParamDecorator, makePropDecorator } from './util/decorators';
/**
 * {@link ComponentMetadata} factory function.
 */
export var Component = makeDecorator(ComponentMetadata, (fn) => fn.View = View);
/**
 * {@link DirectiveMetadata} factory function.
 */
export var Directive = makeDecorator(DirectiveMetadata);
/**
 * {@link ViewMetadata} factory function.
 */
export var View = makeDecorator(ViewMetadata, (fn) => fn.View = View);
/**
 * {@link AttributeMetadata} factory function.
 */
export var Attribute = makeParamDecorator(AttributeMetadata);
/**
 * {@link QueryMetadata} factory function.
 */
export var Query = makeParamDecorator(QueryMetadata);
/**
 * {@link ContentChildrenMetadata} factory function.
 */
export var ContentChildren = makePropDecorator(ContentChildrenMetadata);
/**
 * {@link ContentChildMetadata} factory function.
 */
export var ContentChild = makePropDecorator(ContentChildMetadata);
/**
 * {@link ViewChildrenMetadata} factory function.
 */
export var ViewChildren = makePropDecorator(ViewChildrenMetadata);
/**
 * {@link ViewChildMetadata} factory function.
 */
export var ViewChild = makePropDecorator(ViewChildMetadata);
/**
 * {@link di/ViewQueryMetadata} factory function.
 */
export var ViewQuery = makeParamDecorator(ViewQueryMetadata);
/**
 * {@link PipeMetadata} factory function.
 */
export var Pipe = makeDecorator(PipeMetadata);
/**
 * {@link InputMetadata} factory function.
 *
 * See {@link InputMetadata}.
 */
export var Input = makePropDecorator(InputMetadata);
/**
 * {@link OutputMetadata} factory function.
 *
 * See {@link OutputMetadatas}.
 */
export var Output = makePropDecorator(OutputMetadata);
/**
 * {@link HostBindingMetadata} factory function.
 */
export var HostBinding = makePropDecorator(HostBindingMetadata);
/**
 * {@link HostListenerMetadata} factory function.
 */
export var HostListener = makePropDecorator(HostListenerMetadata);
//# sourceMappingURL=metadata.js.map