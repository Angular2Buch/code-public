import { RouteHandler } from './route_handler';
import { Promise } from 'angular2/src/facade/async';
import { Type } from 'angular2/src/facade/lang';
export declare class SyncRouteHandler implements RouteHandler {
    componentType: Type;
    _resolvedComponent: Promise<any>;
    constructor(componentType: Type);
    resolveComponentType(): Promise<any>;
}
