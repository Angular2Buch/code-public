import { Type } from 'angular2/src/facade/lang';
import { RouteDefinition } from './route_definition';
export { RouteDefinition } from './route_definition';
/**
 * You use the RouteConfig annotation to add routes to a component.
 *
 * Supported keys:
 * - `path` (required)
 * - `component`,  `redirectTo` (requires exactly one of these)
 * - `as` (optional)
 */
export declare class RouteConfig {
    configs: List<RouteDefinition>;
    constructor(configs: List<RouteDefinition>);
}
export declare class Route implements RouteDefinition {
    path: string;
    component: Type;
    as: string;
    loader: Function;
    redirectTo: string;
    constructor({path, component, as}: {
        path: string;
        component: Type;
        as?: string;
    });
}
export declare class AsyncRoute implements RouteDefinition {
    path: string;
    loader: Function;
    as: string;
    constructor({path, loader, as}: {
        path: string;
        loader: Function;
        as?: string;
    });
}
export declare class Redirect implements RouteDefinition {
    path: string;
    redirectTo: string;
    as: string;
    constructor({path, redirectTo}: {
        path: string;
        redirectTo: string;
    });
}