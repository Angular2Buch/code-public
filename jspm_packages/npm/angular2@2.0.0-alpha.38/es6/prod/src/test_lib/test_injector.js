/* */ 
"format cjs";
import { bind, Binding } from 'angular2/src/core/di';
import { DEFAULT_PIPES } from 'angular2/src/core/pipes';
import { AnimationBuilder } from 'angular2/src/animate/animation_builder';
import { MockAnimationBuilder } from 'angular2/src/mock/animation_builder_mock';
import { ProtoViewFactory } from 'angular2/src/core/linker/proto_view_factory';
import { Reflector, reflector } from 'angular2/src/core/reflection/reflection';
import { IterableDiffers, defaultIterableDiffers, KeyValueDiffers, defaultKeyValueDiffers, ChangeDetectorGenConfig } from 'angular2/src/core/change_detection/change_detection';
import { ExceptionHandler } from 'angular2/src/core/facade/exceptions';
import { ViewResolver } from 'angular2/src/core/linker/view_resolver';
import { DirectiveResolver } from 'angular2/src/core/linker/directive_resolver';
import { PipeResolver } from 'angular2/src/core/linker/pipe_resolver';
import { DynamicComponentLoader } from 'angular2/src/core/linker/dynamic_component_loader';
import { XHR } from 'angular2/src/core/compiler/xhr';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
import { DOM } from 'angular2/src/core/dom/dom_adapter';
import { EventManager, DomEventsPlugin, EVENT_MANAGER_PLUGINS } from 'angular2/src/core/render/dom/events/event_manager';
import { MockDirectiveResolver } from 'angular2/src/mock/directive_resolver_mock';
import { MockViewResolver } from 'angular2/src/mock/view_resolver_mock';
import { MockXHR } from 'angular2/src/core/compiler/xhr_mock';
import { MockLocationStrategy } from 'angular2/src/mock/mock_location_strategy';
import { LocationStrategy } from 'angular2/src/router/location_strategy';
import { MockNgZone } from 'angular2/src/mock/ng_zone_mock';
import { TestComponentBuilder } from './test_component_builder';
import { Injector } from 'angular2/src/core/di';
import { ELEMENT_PROBE_BINDINGS } from 'angular2/src/core/debug';
import { ListWrapper } from 'angular2/src/core/facade/collection';
import { FunctionWrapper } from 'angular2/src/core/facade/lang';
import { AppViewPool, APP_VIEW_POOL_CAPACITY } from 'angular2/src/core/linker/view_pool';
import { AppViewManager } from 'angular2/src/core/linker/view_manager';
import { AppViewManagerUtils } from 'angular2/src/core/linker/view_manager_utils';
import { Renderer } from 'angular2/src/core/render/api';
import { DomRenderer, DOCUMENT, SharedStylesHost, DomSharedStylesHost } from 'angular2/src/core/render/render';
import { APP_ID } from 'angular2/src/core/application_tokens';
import { Serializer } from "angular2/src/web_workers/shared/serializer";
import { Log } from './utils';
import { compilerBindings } from 'angular2/src/core/compiler/compiler';
/**
 * Returns the root injector bindings.
 *
 * This must be kept in sync with the _rootBindings in application.js
 *
 * @returns {any[]}
 */
function _getRootBindings() {
    return [
        bind(Reflector)
            .toValue(reflector),
    ];
}
/**
 * Returns the application injector bindings.
 *
 * This must be kept in sync with _injectorBindings() in application.js
 *
 * @returns {any[]}
 */
function _getAppBindings() {
    var appDoc;
    // The document is only available in browser environment
    try {
        appDoc = DOM.defaultDoc();
    }
    catch (e) {
        appDoc = null;
    }
    return [
        compilerBindings(),
        bind(ChangeDetectorGenConfig).toValue(new ChangeDetectorGenConfig(true, true, false, true)),
        bind(DOCUMENT).toValue(appDoc),
        DomRenderer,
        bind(Renderer).toAlias(DomRenderer),
        bind(APP_ID).toValue('a'),
        DomSharedStylesHost,
        bind(SharedStylesHost).toAlias(DomSharedStylesHost),
        AppViewPool,
        AppViewManager,
        AppViewManagerUtils,
        Serializer,
        ELEMENT_PROBE_BINDINGS,
        bind(APP_VIEW_POOL_CAPACITY).toValue(500),
        ProtoViewFactory,
        bind(DirectiveResolver).toClass(MockDirectiveResolver),
        bind(ViewResolver).toClass(MockViewResolver),
        DEFAULT_PIPES,
        bind(IterableDiffers).toValue(defaultIterableDiffers),
        bind(KeyValueDiffers).toValue(defaultKeyValueDiffers),
        Log,
        DynamicComponentLoader,
        PipeResolver,
        bind(ExceptionHandler).toValue(new ExceptionHandler(DOM)),
        bind(LocationStrategy).toClass(MockLocationStrategy),
        bind(XHR).toClass(MockXHR),
        TestComponentBuilder,
        bind(NgZone).toClass(MockNgZone),
        bind(AnimationBuilder).toClass(MockAnimationBuilder),
        EventManager,
        new Binding(EVENT_MANAGER_PLUGINS, { toClass: DomEventsPlugin, multi: true })
    ];
}
export function createTestInjector(bindings) {
    var rootInjector = Injector.resolveAndCreate(_getRootBindings());
    return rootInjector.resolveAndCreateChild(ListWrapper.concat(_getAppBindings(), bindings));
}
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass, AsyncTestCompleter], (object, async) => {
 *   object.doSomething().then(() => {
 *     expect(...);
 *     async.done();
 *   });
 * })
 * ```
 *
 * Notes:
 * - injecting an `AsyncTestCompleter` allow completing async tests - this is the equivalent of
 *   adding a `done` parameter in Jasmine,
 * - inject is currently a function because of some Traceur limitation the syntax should eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn);
}
export class FunctionWithParamTokens {
    constructor(_tokens, _fn) {
        this._tokens = _tokens;
        this._fn = _fn;
    }
    /**
     * Returns the value of the executed function.
     */
    execute(injector) {
        var params = ListWrapper.map(this._tokens, (t) => injector.get(t));
        return FunctionWrapper.apply(this._fn, params);
    }
    hasToken(token) { return this._tokens.indexOf(token) > -1; }
}
//# sourceMappingURL=test_injector.js.map