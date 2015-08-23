import * as viewModule from './view';
import { RenderViewRef, RenderFragmentRef } from 'angular2/src/render/api';
export declare function internalView(viewRef: ViewRef): viewModule.AppView;
export declare function internalProtoView(protoViewRef: ProtoViewRef): viewModule.AppProtoView;
export interface HostViewRef {
}
/**
 * A reference to an Angular View.
 *
 * A View is a fundamental building block of Application UI. A View is the smallest set of
 * elements which are created and destroyed together. A View can change properties on the elements
 * within the view, but it can not change the structure of those elements.
 *
 * To change structure of the elements, the Views can contain zero or more {@link ViewContainerRef}s
 * which allow the views to be nested.
 *
 * ## Example
 *
 * Given this template
 *
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <li *ng-for="var item of items">{{item}}</li>
 * </ul>
 * ```
 *
 * The above example we have two {@link ProtoViewRef}s:
 *
 * Outter {@link ProtoViewRef}:
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <template ng-for var-item [ng-for-of]="items"></template>
 * </ul>
 * ```
 *
 * Inner {@link ProtoViewRef}:
 * ```
 *   <li>{{item}}</li>
 * ```
 *
 * Notice that the original template is broken down into two separate {@link ProtoViewRef}s.
 *
 * The outter/inner {@link ProtoViewRef}s are then assembled into views like so:
 *
 * ```
 * <!-- ViewRef: outer-0 -->
 * Count: 2
 * <ul>
 *   <template view-container-ref></template>
 *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
 *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 * </ul>
 * <!-- /ViewRef: outer-0 -->
 * ```
 */
export declare class ViewRef implements HostViewRef {
    _view: viewModule.AppView;
    /**
     * @private
     */
    constructor(_view: viewModule.AppView);
    /**
     * Return `RenderViewRef`
     */
    render: RenderViewRef;
    /**
     * Return `RenderFragmentRef`
     */
    renderFragment: RenderFragmentRef;
    /**
     * Set local variable in a view.
     *
     * - `contextName` - Name of the local variable in a view.
     * - `value` - Value for the local variable in a view.
     */
    setLocal(contextName: string, value: any): void;
}
/**
 * A reference to an Angular ProtoView.
 *
 * A ProtoView is a reference to a template for easy creation of views.
 * (See {@link AppViewManager#createViewInContainer} and {@link AppViewManager#createRootHostView}).
 *
 * A `ProtoView` is a foctary for creating `View`s.
 *
 * ## Example
 *
 * Given this template
 *
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <li *ng-for="var item of items">{{item}}</li>
 * </ul>
 * ```
 *
 * The above example we have two {@link ProtoViewRef}s:
 *
 * Outter {@link ProtoViewRef}:
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <template ng-for var-item [ng-for-of]="items"></template>
 * </ul>
 * ```
 *
 * Inner {@link ProtoViewRef}:
 * ```
 *   <li>{{item}}</li>
 * ```
 *
 * Notice that the original template is broken down into two separate {@link ProtoViewRef}s.
 */
export declare class ProtoViewRef {
    _protoView: viewModule.AppProtoView;
    /**
     * @private
     */
    constructor(_protoView: viewModule.AppProtoView);
}