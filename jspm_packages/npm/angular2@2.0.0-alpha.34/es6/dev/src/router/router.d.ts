import { Promise } from 'angular2/src/facade/async';
import { Type } from 'angular2/src/facade/lang';
import { RouteRegistry } from './route_registry';
import { Pipeline } from './pipeline';
import { Instruction } from './instruction';
import { RouterOutlet } from './router_outlet';
import { Location } from './location';
import { RouteDefinition } from './route_config_impl';
/**
 * # Router
 * The router is responsible for mapping URLs to components.
 *
 * You can see the state of the router by inspecting the read-only field `router.navigating`.
 * This may be useful for showing a spinner, for instance.
 *
 * ## Concepts
 * Routers and component instances have a 1:1 correspondence.
 *
 * The router holds reference to a number of "outlets." An outlet is a placeholder that the
 * router dynamically fills in depending on the current URL.
 *
 * When the router navigates from a URL, it must first recognizes it and serialize it into an
 * `Instruction`.
 * The router uses the `RouteRegistry` to get an `Instruction`.
 */
export declare class Router {
    registry: RouteRegistry;
    _pipeline: Pipeline;
    parent: Router;
    hostComponent: any;
    navigating: boolean;
    lastNavigationAttempt: string;
    private _currentInstruction;
    private _currentNavigation;
    private _outlet;
    private _subject;
    constructor(registry: RouteRegistry, _pipeline: Pipeline, parent: Router, hostComponent: any);
    /**
     * Constructs a child router. You probably don't need to use this unless you're writing a reusable
     * component.
     */
    childRouter(hostComponent: any): Router;
    /**
     * Register an object to notify of route changes. You probably don't need to use this unless
     * you're writing a reusable component.
     */
    registerOutlet(outlet: RouterOutlet): Promise<boolean>;
    /**
     * Dynamically update the routing configuration and trigger a navigation.
     *
     * # Usage
     *
     * ```
     * router.config([
     *   { 'path': '/', 'component': IndexComp },
     *   { 'path': '/user/:id', 'component': UserComp },
     * ]);
     * ```
     */
    config(definitions: List<RouteDefinition>): Promise<any>;
    /**
     * Navigate to a URL. Returns a promise that resolves when navigation is complete.
     *
     * If the given URL begins with a `/`, router will navigate absolutely.
     * If the given URL does not begin with `/`, the router will navigate relative to this component.
     */
    navigate(url: string, _skipLocationChange?: boolean): Promise<any>;
    private _emitNavigationFinish(url);
    private _afterPromiseFinishNavigating(promise);
    _reuse(instruction: any): Promise<any>;
    private _canActivate(instruction);
    private _canDeactivate(instruction);
    /**
     * Updates this router and all descendant routers according to the given instruction
     */
    commit(instruction: Instruction, _skipLocationChange?: boolean): Promise<any>;
    _startNavigating(): void;
    _finishNavigating(): void;
    /**
     * Subscribe to URL updates from the router
     */
    subscribe(onNext: (value: any) => void): void;
    /**
     * Removes the contents of this router's outlet and all descendant outlets
     */
    deactivate(instruction: Instruction): Promise<any>;
    /**
     * Given a URL, returns an instruction representing the component graph
     */
    recognize(url: string): Promise<Instruction>;
    /**
     * Navigates to either the last URL successfully navigated to, or the last URL requested if the
     * router has yet to successfully navigate.
     */
    renavigate(): Promise<any>;
    /**
     * Generate a URL from a component name and optional map of parameters. The URL is relative to the
     * app's base href.
     */
    generate(linkParams: List<any>): string;
}
export declare class RootRouter extends Router {
    _location: Location;
    constructor(registry: RouteRegistry, pipeline: Pipeline, location: Location, hostComponent: Type);
    commit(instruction: Instruction, _skipLocationChange?: boolean): Promise<any>;
}