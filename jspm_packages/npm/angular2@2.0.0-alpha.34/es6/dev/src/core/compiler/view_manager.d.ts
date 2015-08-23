import { Injector, ResolvedBinding } from 'angular2/di';
import * as viewModule from './view';
import { ElementRef } from './element_ref';
import { ProtoViewRef, ViewRef, HostViewRef } from './view_ref';
import { ViewContainerRef } from './view_container_ref';
import { TemplateRef } from './template_ref';
import { Renderer, RenderViewWithFragments } from 'angular2/src/render/api';
import { AppViewManagerUtils } from './view_manager_utils';
import { AppViewPool } from './view_pool';
import { AppViewListener } from './view_listener';
import { WtfScopeFn } from '../../profile/profile';
/**
 * Entry point for creating, moving views in the view hierarchy and destroying views.
 * This manager contains all recursion and delegates to helper methods
 * in AppViewManagerUtils and the Renderer, so unit tests get simpler.
 */
export declare class AppViewManager {
    private _viewPool;
    private _viewListener;
    private _utils;
    private _renderer;
    /**
     * @private
     */
    constructor(_viewPool: AppViewPool, _viewListener: AppViewListener, _utils: AppViewManagerUtils, _renderer: Renderer);
    /**
     * Returns a {@link ViewContainerRef} at the {@link ElementRef} location.
     */
    getViewContainer(location: ElementRef): ViewContainerRef;
    /**
     * Return the first child element of the host element view.
     */
    getHostElement(hostViewRef: HostViewRef): ElementRef;
    /**
     * Returns an ElementRef for the element with the given variable name
     * in the current view.
     *
     * - `hostLocation`: {@link ElementRef} of any element in the View which defines the scope of
     *   search.
     * - `variableName`: Name of the variable to locate.
     * - Returns {@link ElementRef} of the found element or null. (Throws if not found.)
     */
    getNamedElementInComponentView(hostLocation: ElementRef, variableName: string): ElementRef;
    /**
     * Returns the component instance for a given element.
     *
     * The component is the execution context as seen by an expression at that {@link ElementRef}
     * location.
     */
    getComponent(hostLocation: ElementRef): any;
    _scope_createRootHostView: WtfScopeFn;
    /**
     * Load component view into existing element.
     *
     * Use this if a host element is already in the DOM and it is necessary to upgrade
     * the element into Angular component by attaching a view but reusing the existing element.
     *
     * - `hostProtoViewRef`: {@link ProtoViewRef} Proto view to use in creating a view for this
     *   component.
     * - `overrideSelector`: (optional) selector to use in locating the existing element to load
     *   the view into. If not specified use the selector in the component definition of the
     *   `hostProtoView`.
     * - injector: {@link Injector} to use as parent injector for the view.
     *
     * See {@link AppViewManager#destroyRootHostView}.
     *
     * ## Example
     *
     * ```
     * @ng.Component({
     *   selector: 'child-component'
     * })
     * @ng.View({
     *   template: 'Child'
     * })
     * class ChildComponent {
     *
     * }
     *
     * @ng.Component({
     *   selector: 'my-app'
     * })
     * @ng.View({
     *   template: `
     *     Parent (<some-component></some-component>)
     *   `
     * })
     * class MyApp {
     *   viewRef: ng.ViewRef;
     *
     *   constructor(public appViewManager: ng.AppViewManager, compiler: ng.Compiler) {
     *     compiler.compileInHost(ChildComponent).then((protoView: ng.ProtoViewRef) => {
     *       this.viewRef = appViewManager.createRootHostView(protoView, 'some-component', null);
     *     })
     *   }
     *
     *   onDestroy() {
     *     this.appViewManager.destroyRootHostView(this.viewRef);
     *     this.viewRef = null;
     *   }
     * }
     *
     * ng.bootstrap(MyApp);
     * ```
     */
    createRootHostView(hostProtoViewRef: ProtoViewRef, overrideSelector: string, injector: Injector): HostViewRef;
    _scope_destroyRootHostView: WtfScopeFn;
    /**
     * Remove the View created with {@link AppViewManager#createRootHostView}.
     */
    destroyRootHostView(hostViewRef: HostViewRef): void;
    _scope_createEmbeddedViewInContainer: WtfScopeFn;
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    createEmbeddedViewInContainer(viewContainerLocation: ElementRef, atIndex: number, templateRef: TemplateRef): ViewRef;
    _scope_createHostViewInContainer: WtfScopeFn;
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    createHostViewInContainer(viewContainerLocation: ElementRef, atIndex: number, protoViewRef: ProtoViewRef, imperativelyCreatedInjector: ResolvedBinding[]): HostViewRef;
    /**
     *
     * See {@link AppViewManager#destroyViewInContainer}.
     */
    _createViewInContainer(viewContainerLocation: ElementRef, atIndex: number, protoView: viewModule.AppProtoView, context: ElementRef, imperativelyCreatedInjector: ResolvedBinding[]): ViewRef;
    _attachRenderView(parentView: viewModule.AppView, boundElementIndex: number, atIndex: number, view: viewModule.AppView): void;
    _scope_destroyViewInContainer: WtfScopeFn;
    /**
     *
     * See {@link AppViewManager#createViewInContainer}.
     */
    destroyViewInContainer(viewContainerLocation: ElementRef, atIndex: number): void;
    _scope_attachViewInContainer: WtfScopeFn;
    /**
     *
     * See {@link AppViewManager#detachViewInContainer}.
     */
    attachViewInContainer(viewContainerLocation: ElementRef, atIndex: number, viewRef: ViewRef): ViewRef;
    _scope_detachViewInContainer: WtfScopeFn;
    /**
     *
     * See {@link AppViewManager#attachViewInContainer}.
     */
    detachViewInContainer(viewContainerLocation: ElementRef, atIndex: number): ViewRef;
    _createMainView(protoView: viewModule.AppProtoView, renderViewWithFragments: RenderViewWithFragments): viewModule.AppView;
    _createPooledView(protoView: viewModule.AppProtoView): viewModule.AppView;
    _destroyPooledView(view: viewModule.AppView): void;
    _destroyViewInContainer(parentView: viewModule.AppView, boundElementIndex: number, atIndex: number): void;
    _viewDehydrateRecurse(view: viewModule.AppView): void;
}