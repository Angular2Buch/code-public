/* */ 
"format cjs";
import { PromiseWrapper, EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { ListWrapper } from 'angular2/src/facade/collection';
import { isBlank, isString, StringWrapper, isPresent, BaseException } from 'angular2/src/facade/lang';
import { getCanActivateHook } from './route_lifecycle_reflector';
let _resolveToTrue = PromiseWrapper.resolve(true);
let _resolveToFalse = PromiseWrapper.resolve(false);
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
export class Router {
    // todo(jeffbcross): rename _registry to registry since it is accessed from subclasses
    // todo(jeffbcross): rename _pipeline to pipeline since it is accessed from subclasses
    constructor(registry, _pipeline, parent, hostComponent) {
        this.registry = registry;
        this._pipeline = _pipeline;
        this.parent = parent;
        this.hostComponent = hostComponent;
        this.navigating = false;
        this._currentInstruction = null;
        this._currentNavigation = _resolveToTrue;
        this._outlet = null;
        this._subject = new EventEmitter();
    }
    /**
     * Constructs a child router. You probably don't need to use this unless you're writing a reusable
     * component.
     */
    childRouter(hostComponent) { return new ChildRouter(this, hostComponent); }
    /**
     * Register an object to notify of route changes. You probably don't need to use this unless
     * you're writing a reusable component.
     */
    registerOutlet(outlet) {
        // TODO: sibling routes
        this._outlet = outlet;
        if (isPresent(this._currentInstruction)) {
            return outlet.commit(this._currentInstruction);
        }
        return _resolveToTrue;
    }
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
    config(definitions) {
        definitions.forEach((routeDefinition) => {
            this.registry.config(this.hostComponent, routeDefinition, this instanceof RootRouter);
        });
        return this.renavigate();
    }
    /**
     * Navigate to a URL. Returns a promise that resolves when navigation is complete.
     *
     * If the given URL begins with a `/`, router will navigate absolutely.
     * If the given URL does not begin with `/`, the router will navigate relative to this component.
     */
    navigate(url, _skipLocationChange = false) {
        return this._currentNavigation = this._currentNavigation.then((_) => {
            this.lastNavigationAttempt = url;
            this._startNavigating();
            return this._afterPromiseFinishNavigating(this.recognize(url).then((matchedInstruction) => {
                if (isBlank(matchedInstruction)) {
                    return false;
                }
                return this._reuse(matchedInstruction)
                    .then((_) => this._canActivate(matchedInstruction))
                    .then((result) => {
                    if (!result) {
                        return false;
                    }
                    return this._canDeactivate(matchedInstruction)
                        .then((result) => {
                        if (result) {
                            return this.commit(matchedInstruction, _skipLocationChange)
                                .then((_) => {
                                this._emitNavigationFinish(matchedInstruction.accumulatedUrl);
                                return true;
                            });
                        }
                    });
                });
            }));
        });
    }
    _emitNavigationFinish(url) { ObservableWrapper.callNext(this._subject, url); }
    _afterPromiseFinishNavigating(promise) {
        return PromiseWrapper.catchError(promise.then((_) => this._finishNavigating()), (err) => {
            this._finishNavigating();
            throw err;
        });
    }
    _reuse(instruction) {
        if (isBlank(this._outlet)) {
            return _resolveToFalse;
        }
        return this._outlet.canReuse(instruction)
            .then((result) => {
            instruction.reuse = result;
            if (isPresent(this._outlet.childRouter) && isPresent(instruction.child)) {
                return this._outlet.childRouter._reuse(instruction.child);
            }
        });
    }
    _canActivate(instruction) {
        return canActivateOne(instruction, this._currentInstruction);
    }
    _canDeactivate(instruction) {
        if (isBlank(this._outlet)) {
            return _resolveToTrue;
        }
        var next;
        if (isPresent(instruction) && instruction.reuse) {
            next = _resolveToTrue;
        }
        else {
            next = this._outlet.canDeactivate(instruction);
        }
        return next.then((result) => {
            if (result == false) {
                return false;
            }
            if (isPresent(this._outlet.childRouter)) {
                return this._outlet.childRouter._canDeactivate(isPresent(instruction) ? instruction.child :
                    null);
            }
            return true;
        });
    }
    /**
     * Updates this router and all descendant routers according to the given instruction
     */
    commit(instruction, _skipLocationChange = false) {
        this._currentInstruction = instruction;
        if (isPresent(this._outlet)) {
            return this._outlet.commit(instruction);
        }
        return _resolveToTrue;
    }
    _startNavigating() { this.navigating = true; }
    _finishNavigating() { this.navigating = false; }
    /**
     * Subscribe to URL updates from the router
     */
    subscribe(onNext) {
        ObservableWrapper.subscribe(this._subject, onNext);
    }
    /**
     * Removes the contents of this router's outlet and all descendant outlets
     */
    deactivate(instruction) {
        if (isPresent(this._outlet)) {
            return this._outlet.deactivate(instruction);
        }
        return _resolveToTrue;
    }
    /**
     * Given a URL, returns an instruction representing the component graph
     */
    recognize(url) {
        return this.registry.recognize(url, this.hostComponent);
    }
    /**
     * Navigates to either the last URL successfully navigated to, or the last URL requested if the
     * router has yet to successfully navigate.
     */
    renavigate() {
        if (isBlank(this.lastNavigationAttempt)) {
            return this._currentNavigation;
        }
        return this.navigate(this.lastNavigationAttempt);
    }
    /**
     * Generate a URL from a component name and optional map of parameters. The URL is relative to the
     * app's base href.
     */
    generate(linkParams) {
        let normalizedLinkParams = splitAndFlattenLinkParams(linkParams);
        var first = ListWrapper.first(normalizedLinkParams);
        var rest = ListWrapper.slice(normalizedLinkParams, 1);
        var router = this;
        // The first segment should be either '.' (generate from parent) or '' (generate from root).
        // When we normalize above, we strip all the slashes, './' becomes '.' and '/' becomes ''.
        if (first == '') {
            while (isPresent(router.parent)) {
                router = router.parent;
            }
        }
        else if (first == '..') {
            router = router.parent;
            while (ListWrapper.first(rest) == '..') {
                rest = ListWrapper.slice(rest, 1);
                router = router.parent;
                if (isBlank(router)) {
                    throw new BaseException(`Link "${ListWrapper.toJSON(linkParams)}" has too many "../" segments.`);
                }
            }
        }
        else if (first != '.') {
            throw new BaseException(`Link "${ListWrapper.toJSON(linkParams)}" must start with "/", "./", or "../"`);
        }
        if (rest[rest.length - 1] == '') {
            ListWrapper.removeLast(rest);
        }
        if (rest.length < 1) {
            let msg = `Link "${ListWrapper.toJSON(linkParams)}" must include a route name.`;
            throw new BaseException(msg);
        }
        let url = '';
        if (isPresent(router.parent) && isPresent(router.parent._currentInstruction)) {
            url = router.parent._currentInstruction.capturedUrl;
        }
        return url + '/' + this.registry.generate(rest, router.hostComponent);
    }
}
export class RootRouter extends Router {
    constructor(registry, pipeline, location, hostComponent) {
        super(registry, pipeline, null, hostComponent);
        this._location = location;
        this._location.subscribe((change) => this.navigate(change['url'], isPresent(change['pop'])));
        this.registry.configFromComponent(hostComponent, true);
        this.navigate(location.path());
    }
    commit(instruction, _skipLocationChange = false) {
        var promise = super.commit(instruction);
        if (!_skipLocationChange) {
            promise = promise.then((_) => { this._location.go(instruction.accumulatedUrl); });
        }
        return promise;
    }
}
class ChildRouter extends Router {
    constructor(parent, hostComponent) {
        super(parent.registry, parent._pipeline, parent, hostComponent);
        this.parent = parent;
    }
    navigate(url, _skipLocationChange = false) {
        // Delegate navigation to the root router
        return this.parent.navigate(url, _skipLocationChange);
    }
}
/*
 * Given: ['/a/b', {c: 2}]
 * Returns: ['', 'a', 'b', {c: 2}]
 */
var SLASH = new RegExp('/');
function splitAndFlattenLinkParams(linkParams) {
    return ListWrapper.reduce(linkParams, (accumulation, item) => {
        if (isString(item)) {
            return ListWrapper.concat(accumulation, StringWrapper.split(item, SLASH));
        }
        accumulation.push(item);
        return accumulation;
    }, []);
}
function canActivateOne(nextInstruction, currentInstruction) {
    var next = _resolveToTrue;
    if (isPresent(nextInstruction.child)) {
        next = canActivateOne(nextInstruction.child, isPresent(currentInstruction) ? currentInstruction.child : null);
    }
    return next.then((res) => {
        if (res == false) {
            return false;
        }
        if (nextInstruction.reuse) {
            return true;
        }
        var hook = getCanActivateHook(nextInstruction.component);
        if (isPresent(hook)) {
            return hook(nextInstruction, currentInstruction);
        }
        return true;
    });
}
//# sourceMappingURL=router.js.map