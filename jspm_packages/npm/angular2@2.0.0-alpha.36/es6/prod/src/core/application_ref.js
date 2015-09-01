/* */ 
"format cjs";
/**
 * Represents a Angular's representation of an Application.
 *
 * `ApplicationRef` represents a running application instance. Use it to retrieve the host
 * component, injector,
 * or dispose of an application.
 */
export class ApplicationRef {
    /**
     * @private
     */
    constructor(hostComponent, hostComponentType, injector) {
        this._hostComponent = hostComponent;
        this._injector = injector;
        this._hostComponentType = hostComponentType;
    }
    /**
     * Returns the current {@link ComponentMetadata} type.
     */
    get hostComponentType() { return this._hostComponentType; }
    /**
     * Returns the current {@link ComponentMetadata} instance.
     */
    get hostComponent() { return this._hostComponent.instance; }
    /**
     * Dispose (un-load) the application.
     */
    dispose() {
        // TODO: We also need to clean up the Zone, ... here!
        this._hostComponent.dispose();
    }
    /**
     * Returns the root application {@link Injector}.
     */
    get injector() { return this._injector; }
}
//# sourceMappingURL=application_ref.js.map