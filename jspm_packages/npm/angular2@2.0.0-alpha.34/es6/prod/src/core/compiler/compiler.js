/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Binding, resolveForwardRef, Injectable } from 'angular2/di';
import { Type, isBlank, isType, isPresent, BaseException, normalizeBlank, stringify, isArray, isPromise } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { ListWrapper, Map, MapWrapper } from 'angular2/src/facade/collection';
import { DirectiveResolver } from './directive_resolver';
import { AppProtoViewMergeMapping } from './view';
import { DirectiveBinding } from './element_injector';
import { ViewResolver } from './view_resolver';
import { ComponentUrlMapper } from './component_url_mapper';
import { ProtoViewFactory } from './proto_view_factory';
import { UrlResolver } from 'angular2/src/services/url_resolver';
import { AppRootUrl } from 'angular2/src/services/app_root_url';
import { wtfStartTimeRange, wtfEndTimeRange } from '../../profile/profile';
import * as renderApi from 'angular2/src/render/api';
/**
 * Cache that stores the AppProtoView of the template of a component.
 * Used to prevent duplicate work and resolve cyclic dependencies.
 */
export let CompilerCache = class {
    constructor() {
        this._cache = new Map();
        this._hostCache = new Map();
    }
    set(component, protoView) { this._cache.set(component, protoView); }
    get(component) {
        var result = this._cache.get(component);
        return normalizeBlank(result);
    }
    setHost(component, protoView) {
        this._hostCache.set(component, protoView);
    }
    getHost(component) {
        var result = this._hostCache.get(component);
        return normalizeBlank(result);
    }
    clear() {
        this._cache.clear();
        this._hostCache.clear();
    }
};
CompilerCache = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], CompilerCache);
/**
 *
 * ## URL Resolution
 *
 * ```
 * var appRootUrl: AppRootUrl = ...;
 * var componentUrlMapper: ComponentUrlMapper = ...;
 * var urlResolver: UrlResolver = ...;
 *
 * var componentType: Type = ...;
 * var componentAnnotation: ComponentAnnotation = ...;
 * var viewAnnotation: ViewAnnotation = ...;
 *
 * // Resolving a URL
 *
 * var url = viewAnnotation.templateUrl;
 * var componentUrl = componentUrlMapper.getUrl(componentType);
 * var componentResolvedUrl = urlResolver.resolve(appRootUrl.value, componentUrl);
 * var templateResolvedUrl = urlResolver.resolve(componetResolvedUrl, url);
 * ```
 */
export let Compiler = class {
    /**
     * @private
     */
    constructor(reader, cache, viewResolver, componentUrlMapper, urlResolver, render, protoViewFactory, appUrl) {
        this._reader = reader;
        this._compilerCache = cache;
        this._compiling = new Map();
        this._viewResolver = viewResolver;
        this._componentUrlMapper = componentUrlMapper;
        this._urlResolver = urlResolver;
        this._appUrl = appUrl.value;
        this._render = render;
        this._protoViewFactory = protoViewFactory;
    }
    _bindDirective(directiveTypeOrBinding) {
        if (directiveTypeOrBinding instanceof DirectiveBinding) {
            return directiveTypeOrBinding;
        }
        else if (directiveTypeOrBinding instanceof Binding) {
            let annotation = this._reader.resolve(directiveTypeOrBinding.token);
            return DirectiveBinding.createFromBinding(directiveTypeOrBinding, annotation);
        }
        else {
            let annotation = this._reader.resolve(directiveTypeOrBinding);
            return DirectiveBinding.createFromType(directiveTypeOrBinding, annotation);
        }
    }
    // Create a hostView as if the compiler encountered <hostcmp></hostcmp>.
    // Used for bootstrapping.
    compileInHost(componentTypeOrBinding) {
        var componentType = isType(componentTypeOrBinding) ? componentTypeOrBinding :
            componentTypeOrBinding.token;
        var r = wtfStartTimeRange('Compiler#compile()', stringify(componentType));
        var hostAppProtoView = this._compilerCache.getHost(componentType);
        var hostPvPromise;
        if (isPresent(hostAppProtoView)) {
            hostPvPromise = PromiseWrapper.resolve(hostAppProtoView);
        }
        else {
            var componentBinding = this._bindDirective(componentTypeOrBinding);
            Compiler._assertTypeIsComponent(componentBinding);
            var directiveMetadata = componentBinding.metadata;
            hostPvPromise =
                this._render.compileHost(directiveMetadata)
                    .then((hostRenderPv) => {
                    var protoViews = this._protoViewFactory.createAppProtoViews(componentBinding, hostRenderPv, [componentBinding]);
                    return this._compileNestedProtoViews(protoViews, componentType, new Map());
                })
                    .then((appProtoView) => {
                    this._compilerCache.setHost(componentType, appProtoView);
                    return appProtoView;
                });
        }
        return hostPvPromise.then((hostAppProtoView) => {
            wtfEndTimeRange(r);
            return hostAppProtoView.ref;
        });
    }
    _compile(componentBinding, componentPath) {
        var component = componentBinding.key.token;
        var protoView = this._compilerCache.get(component);
        if (isPresent(protoView)) {
            // The component has already been compiled into an AppProtoView,
            // returns a plain AppProtoView, not wrapped inside of a Promise, for performance reasons.
            return protoView;
        }
        var resultPromise = this._compiling.get(component);
        if (isPresent(resultPromise)) {
            // The component is already being compiled, attach to the existing Promise
            // instead of re-compiling the component.
            // It happens when a template references a component multiple times.
            return resultPromise;
        }
        var view = this._viewResolver.resolve(component);
        var directives = this._flattenDirectives(view);
        for (var i = 0; i < directives.length; i++) {
            if (!Compiler._isValidDirective(directives[i])) {
                throw new BaseException(`Unexpected directive value '${stringify(directives[i])}' on the View of component '${stringify(component)}'`);
            }
        }
        var boundDirectives = this._removeDuplicatedDirectives(ListWrapper.map(directives, (directive) => this._bindDirective(directive)));
        var renderTemplate = this._buildRenderTemplate(component, view, boundDirectives);
        resultPromise =
            this._render.compile(renderTemplate)
                .then((renderPv) => {
                var protoViews = this._protoViewFactory.createAppProtoViews(componentBinding, renderPv, boundDirectives);
                return this._compileNestedProtoViews(protoViews, component, componentPath);
            })
                .then((appProtoView) => {
                this._compilerCache.set(component, appProtoView);
                MapWrapper.delete(this._compiling, component);
                return appProtoView;
            });
        this._compiling.set(component, resultPromise);
        return resultPromise;
    }
    _removeDuplicatedDirectives(directives) {
        var directivesMap = new Map();
        directives.forEach((dirBinding) => { directivesMap.set(dirBinding.key.id, dirBinding); });
        return MapWrapper.values(directivesMap);
    }
    _compileNestedProtoViews(appProtoViews, componentType, componentPath) {
        var nestedPVPromises = [];
        componentPath = MapWrapper.clone(componentPath);
        if (appProtoViews[0].type === renderApi.ViewType.COMPONENT) {
            componentPath.set(componentType, appProtoViews[0]);
        }
        appProtoViews.forEach(appProtoView => {
            this._collectComponentElementBinders(appProtoView)
                .forEach((elementBinder) => {
                var nestedComponent = elementBinder.componentDirective;
                var nestedComponentType = nestedComponent.key.token;
                var elementBinderDone = (nestedPv) => { elementBinder.nestedProtoView = nestedPv; };
                if (componentPath.has(nestedComponentType)) {
                    // cycle...
                    if (appProtoView.isEmbeddedFragment) {
                        throw new BaseException(`<ng-content> is used within the recursive path of ${stringify(nestedComponentType)}`);
                    }
                    else if (appProtoView.type === renderApi.ViewType.COMPONENT) {
                        throw new BaseException(`Unconditional component cycle in ${stringify(nestedComponentType)}`);
                    }
                    else {
                        elementBinderDone(componentPath.get(nestedComponentType));
                    }
                }
                else {
                    var nestedCall = this._compile(nestedComponent, componentPath);
                    if (isPromise(nestedCall)) {
                        nestedPVPromises.push(nestedCall.then(elementBinderDone));
                    }
                    else {
                        elementBinderDone(nestedCall);
                    }
                }
            });
        });
        return PromiseWrapper.all(nestedPVPromises)
            .then(_ => PromiseWrapper.all(appProtoViews.map(appProtoView => this._mergeProtoView(appProtoView))))
            .then(_ => appProtoViews[0]);
    }
    _mergeProtoView(appProtoView) {
        if (appProtoView.type !== renderApi.ViewType.HOST &&
            appProtoView.type !== renderApi.ViewType.EMBEDDED) {
            return null;
        }
        return this._render.mergeProtoViewsRecursively(this._collectMergeRenderProtoViews(appProtoView))
            .then((mergeResult) => {
            appProtoView.mergeMapping = new AppProtoViewMergeMapping(mergeResult);
        });
    }
    _collectMergeRenderProtoViews(appProtoView) {
        var result = [appProtoView.render];
        for (var i = 0; i < appProtoView.elementBinders.length; i++) {
            var binder = appProtoView.elementBinders[i];
            if (isPresent(binder.nestedProtoView)) {
                if (binder.hasStaticComponent() ||
                    (binder.hasEmbeddedProtoView() && binder.nestedProtoView.isEmbeddedFragment)) {
                    result.push(this._collectMergeRenderProtoViews(binder.nestedProtoView));
                }
                else {
                    result.push(null);
                }
            }
        }
        return result;
    }
    _collectComponentElementBinders(appProtoView) {
        var componentElementBinders = [];
        appProtoView.elementBinders.forEach((elementBinder) => {
            if (isPresent(elementBinder.componentDirective)) {
                componentElementBinders.push(elementBinder);
            }
        });
        return componentElementBinders;
    }
    _buildRenderTemplate(component, view, directives) {
        var componentUrl = this._urlResolver.resolve(this._appUrl, this._componentUrlMapper.getUrl(component));
        var templateAbsUrl = null;
        var styleAbsUrls = null;
        if (isPresent(view.templateUrl)) {
            templateAbsUrl = this._urlResolver.resolve(componentUrl, view.templateUrl);
        }
        else if (isPresent(view.template)) {
            // Note: If we have an inline template, we also need to send
            // the url for the component to the render so that it
            // is able to resolve urls in stylesheets.
            templateAbsUrl = componentUrl;
        }
        if (isPresent(view.styleUrls)) {
            styleAbsUrls =
                ListWrapper.map(view.styleUrls, url => this._urlResolver.resolve(componentUrl, url));
        }
        return new renderApi.ViewDefinition({
            componentId: stringify(component),
            templateAbsUrl: templateAbsUrl, template: view.template,
            styleAbsUrls: styleAbsUrls,
            styles: view.styles,
            directives: ListWrapper.map(directives, directiveBinding => directiveBinding.metadata),
            encapsulation: view.encapsulation
        });
    }
    _flattenDirectives(template) {
        if (isBlank(template.directives))
            return [];
        var directives = [];
        this._flattenList(template.directives, directives);
        return directives;
    }
    _flattenList(tree, out) {
        for (var i = 0; i < tree.length; i++) {
            var item = resolveForwardRef(tree[i]);
            if (isArray(item)) {
                this._flattenList(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    static _isValidDirective(value) {
        return isPresent(value) && (value instanceof Type || value instanceof Binding);
    }
    static _assertTypeIsComponent(directiveBinding) {
        if (directiveBinding.metadata.type !== renderApi.DirectiveMetadata.COMPONENT_TYPE) {
            throw new BaseException(`Could not load '${stringify(directiveBinding.key.token)}' because it is not a component.`);
        }
    }
};
Compiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [DirectiveResolver, CompilerCache, ViewResolver, ComponentUrlMapper, UrlResolver, renderApi.RenderCompiler, ProtoViewFactory, AppRootUrl])
], Compiler);
//# sourceMappingURL=compiler.js.map