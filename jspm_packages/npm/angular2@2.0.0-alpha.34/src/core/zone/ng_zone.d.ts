import { WtfScopeFn } from '../../profile/profile';
export interface NgZoneZone extends Zone {
    _innerZone: boolean;
}
/**
 * A wrapper around zones that lets you schedule tasks after it has executed a task.
 *
 * The wrapper maintains an "inner" and an "mount" `Zone`. The application code will executes
 * in the "inner" zone unless `runOutsideAngular` is explicitely called.
 *
 * A typical application will create a singleton `NgZone`. The outer `Zone` is a fork of the root
 * `Zone`. The default `onTurnDone` runs the Angular change detection.
 */
export declare class NgZone {
    _zone_run_scope: WtfScopeFn;
    _zone_microtask: WtfScopeFn;
    _mountZone: any;
    _innerZone: any;
    _onTurnStart: () => void;
    _onTurnDone: () => void;
    _onEventDone: () => void;
    _onErrorHandler: (error, stack) => void;
    _pendingMicrotasks: number;
    _hasExecutedCodeInInnerZone: boolean;
    _nestedRun: number;
    _disabled: boolean;
    _inVmTurnDone: boolean;
    _pendingTimeouts: List<number>;
    /**
     * Associates with this
     *
     * - a "root" zone, which the one that instantiated this.
     * - an "inner" zone, which is a child of the root zone.
     *
     * @param {bool} enableLongStackTrace whether to enable long stack trace. They should only be
     *               enabled in development mode as they significantly impact perf.
     */
    constructor({enableLongStackTrace}: {
        enableLongStackTrace: any;
    });
    /**
     * Sets the zone hook that is called just before Angular event turn starts.
     * It is called once per browser event.
     */
    overrideOnTurnStart(onTurnStartFn: Function): void;
    /**
     * Sets the zone hook that is called immediately after Angular processes
     * all pending microtasks.
     */
    overrideOnTurnDone(onTurnDoneFn: Function): void;
    /**
     * Sets the zone hook that is called immediately after the last turn in
     * an event completes. At this point Angular will no longer attempt to
     * sync the UI. Any changes to the data model will not be reflected in the
     * DOM. `onEventDoneFn` is executed outside Angular zone.
     *
     * This hook is useful for validating application state (e.g. in a test).
     */
    overrideOnEventDone(onEventDoneFn: Function, opt_waitForAsync: boolean): void;
    /**
     * Sets the zone hook that is called when an error is uncaught in the
     * Angular zone. The first argument is the error. The second argument is
     * the stack trace.
     */
    overrideOnErrorHandler(errorHandlingFn: Function): void;
    /**
     * Runs `fn` in the inner zone and returns whatever it returns.
     *
     * In a typical app where the inner zone is the Angular zone, this allows one to make use of the
     * Angular's auto digest mechanism.
     *
     * ```
     * var zone: NgZone = [ref to the application zone];
     *
     * zone.run(() => {
     *   // the change detection will run after this function and the microtasks it enqueues have
     * executed.
     * });
     * ```
     */
    run(fn: () => any): any;
    /**
     * Runs `fn` in the outer zone and returns whatever it returns.
     *
     * In a typical app where the inner zone is the Angular zone, this allows one to escape Angular's
     * auto-digest mechanism.
     *
     * ```
     * var zone: NgZone = [ref to the application zone];
     *
     * zone.runOutsideAngular(() => {
     *   element.onClick(() => {
     *     // Clicking on the element would not trigger the change detection
     *   });
     * });
     * ```
     */
    runOutsideAngular(fn: () => any): any;
    _createInnerZone(zone: any, enableLongStackTrace: any): any;
    _onError(zone: any, e: any): void;
}