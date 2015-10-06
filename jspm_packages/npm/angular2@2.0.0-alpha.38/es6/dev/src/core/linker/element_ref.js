/* */ 
"format cjs";
import { BaseException } from 'angular2/src/core/facade/exceptions';
/**
 * Represents a location in a View that has an injection, change-detection and render context
 * associated with it.
 *
 * An `ElementRef` is created for each element in the Template that contains a Directive, Component
 * or data-binding.
 *
 * An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
 * element.
 */
export class ElementRef {
    /**
     * @private
     */
    constructor(parentView, boundElementIndex, _renderer) {
        this._renderer = _renderer;
        this.parentView = parentView;
        this.boundElementIndex = boundElementIndex;
    }
    /**
     * @private
     */
    get renderView() { return this.parentView.render; }
    // TODO(tbosch): remove this once Typescript supports declaring interfaces
    // that contain getters
    // https://github.com/Microsoft/TypeScript/issues/3745
    set renderView(viewRef) { throw new BaseException('Abstract setter'); }
    /**
     * The underlying native element or `null` if direct access to native elements is not supported
     * (e.g. when the application runs in a web worker).
     *
     * <div class="callout is-critical">
     *   <header>Use with caution</header>
     *   <p>
     *    Use this API as the last resort when direct access to DOM is needed. Use templating and
     *    data-binding provided by Angular instead. Alternatively you take a look at {@link Renderer}
     *    which provides API that can safely be used even when direct access to native elements is not
     *    supported.
     *   </p>
     *   <p>
     *    Relying on direct DOM access creates tight coupling between your application and rendering
     *    layers which will make it impossible to separate the two and deploy your application into a
     *    web worker.
     *   </p>
     * </div>
     */
    get nativeElement() { return this._renderer.getNativeElementSync(this); }
}
//# sourceMappingURL=element_ref.js.map