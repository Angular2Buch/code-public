/* */ 
"format cjs";
import { ListWrapper } from 'angular2/src/core/facade/collection';
import { isPresent } from 'angular2/src/core/facade/lang';
import { internalView } from './view_ref';
/**
 * Represents a container where one or more Views can be attached.
 *
 * The container can contain two kinds of Views. Host Views, created by instantiating a
 * {@link Component} via {@link #createHostView}, and Embedded Views, created by instantiating an
 * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
 *
 * The location of the View Container within the containing View is specified by the Anchor
 * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
 * have a single View Container.
 *
 * Root elements of Views attached to this container become siblings of the Anchor Element in
 * the Rendered View.
 *
 * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
 * with `ViewContainerRef` on the Element, or you obtain it via
 * {@link AppViewManager#getViewContainer}.
 *
 * <!-- TODO(i): we are also considering ElementRef#viewContainer api -->
 */
export class ViewContainerRef {
    /**
     * @private
     */
    constructor(
        /**
         * @private
         */
        viewManager, 
        /**
         * Anchor element that specifies the location of this container in the containing View.
         * <!-- TODO: rename to anchorElement -->
         */
        element) {
        this.viewManager = viewManager;
        this.element = element;
    }
    _getViews() {
        var vc = internalView(this.element.parentView).viewContainers[this.element.boundElementIndex];
        return isPresent(vc) ? vc.views : [];
    }
    /**
     * Destroys all Views in this container.
     */
    clear() {
        for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    }
    /**
     * Returns the {@link ViewRef} for the View located in this container at the specified index.
     */
    get(index) { return this._getViews()[index].ref; }
    /**
     * Returns the number of Views currently attached to this container.
     */
    get length() { return this._getViews().length; }
    /**
     * Instantiates an Embedded View based on the {@link TemplateRef `templateRef`} and inserts it
     * into this container at the specified `index`.
     *
     * If `index` is not specified, the new View will be inserted as the last View in the container.
     *
     * Returns the {@link ViewRef} for the newly created View.
     */
    // TODO(rado): profile and decide whether bounds checks should be added
    // to the methods below.
    createEmbeddedView(templateRef, index = -1) {
        if (index == -1)
            index = this.length;
        return this.viewManager.createEmbeddedViewInContainer(this.element, index, templateRef);
    }
    /**
     * Instantiates a single {@link Component} and inserts its Host View into this container at the
     * specified `index`.
     *
     * The component is instantiated using its {@link ProtoViewRef `protoView`} which can be
     * obtained via {@link Compiler#compileInHost}.
     *
     * If `index` is not specified, the new View will be inserted as the last View in the container.
     *
     * You can optionally specify `dynamicallyCreatedBindings`, which configure the {@link Injector}
     * that will be created for the Host View.
     *
     * Returns the {@link HostViewRef} of the Host View created for the newly instantiated Component.
     */
    createHostView(protoViewRef = null, index = -1, dynamicallyCreatedBindings = null) {
        if (index == -1)
            index = this.length;
        return this.viewManager.createHostViewInContainer(this.element, index, protoViewRef, dynamicallyCreatedBindings);
    }
    /**
     * Inserts a View identified by a {@link ViewRef} into the container at the specified `index`.
     *
     * If `index` is not specified, the new View will be inserted as the last View in the container.
     *
     * Returns the inserted {@link ViewRef}.
     */
    // TODO(i): refactor insert+remove into move
    insert(viewRef, index = -1) {
        if (index == -1)
            index = this.length;
        return this.viewManager.attachViewInContainer(this.element, index, viewRef);
    }
    /**
     * Returns the index of the View, specified via {@link ViewRef}, within the current container or
     * `-1` if this container doesn't contain the View.
     */
    indexOf(viewRef) {
        return ListWrapper.indexOf(this._getViews(), internalView(viewRef));
    }
    /**
     * Destroys a View attached to this container at the specified `index`.
     *
     * If `index` is not specified, the last View in the container will be removed.
     */
    // TODO(i): rename to destroy
    remove(index = -1) {
        if (index == -1)
            index = this.length - 1;
        this.viewManager.destroyViewInContainer(this.element, index);
        // view is intentionally not returned to the client.
    }
    /**
     * Use along with {@link #insert} to move a View within the current container.
     *
     * If the `index` param is omitted, the last {@link ViewRef} is detached.
     */
    // TODO(i): refactor insert+remove into move
    detach(index = -1) {
        if (index == -1)
            index = this.length - 1;
        return this.viewManager.detachViewInContainer(this.element, index);
    }
}
//# sourceMappingURL=view_container_ref.js.map