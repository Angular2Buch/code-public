/* */ 
"format cjs";
import { isPresent, isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { ObservableWrapper } from 'angular2/src/core/facade/async';
import { ListWrapper, StringMapWrapper } from 'angular2/src/core/facade/collection';
import { Injector, Key, Dependency, Binding, ResolvedBinding, NoBindingError } from 'angular2/src/core/di';
import { UNDEFINED, ProtoInjector, Visibility, InjectorInlineStrategy, BindingWithVisibility } from 'angular2/src/core/di/injector';
import { resolveBinding, ResolvedFactory } from 'angular2/src/core/di/binding';
import { AttributeMetadata, QueryMetadata } from '../metadata/di';
import * as avmModule from './view_manager';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';
import { TemplateRef } from './template_ref';
import { DirectiveMetadata, ComponentMetadata } from '../metadata/directives';
import { hasLifecycleHook } from './directive_lifecycle_reflector';
import { ChangeDetectorRef } from 'angular2/src/core/change_detection/change_detection';
import { QueryList } from './query_list';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { EventConfig } from 'angular2/src/core/linker/event_config';
import { PipeBinding } from '../pipes/pipe_binding';
import { LifecycleHooks } from './interfaces';
var _staticKeys;
export class StaticKeys {
    constructor() {
        this.viewManagerId = Key.get(avmModule.AppViewManager).id;
        this.templateRefId = Key.get(TemplateRef).id;
        this.viewContainerId = Key.get(ViewContainerRef).id;
        this.changeDetectorRefId = Key.get(ChangeDetectorRef).id;
        this.elementRefId = Key.get(ElementRef).id;
    }
    static instance() {
        if (isBlank(_staticKeys))
            _staticKeys = new StaticKeys();
        return _staticKeys;
    }
}
export class TreeNode {
    constructor(parent) {
        if (isPresent(parent)) {
            parent.addChild(this);
        }
        else {
            this._parent = null;
        }
    }
    addChild(child) { child._parent = this; }
    remove() { this._parent = null; }
    get parent() { return this._parent; }
}
export class DirectiveDependency extends Dependency {
    constructor(key, optional, lowerBoundVisibility, upperBoundVisibility, properties, attributeName, queryDecorator) {
        super(key, optional, lowerBoundVisibility, upperBoundVisibility, properties);
        this.attributeName = attributeName;
        this.queryDecorator = queryDecorator;
        this._verify();
    }
    _verify() {
        var count = 0;
        if (isPresent(this.queryDecorator))
            count++;
        if (isPresent(this.attributeName))
            count++;
        if (count > 1)
            throw new BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
    }
    static createFrom(d) {
        return new DirectiveDependency(d.key, d.optional, d.lowerBoundVisibility, d.upperBoundVisibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
    }
    static _attributeName(properties) {
        var p = ListWrapper.find(properties, (p) => p instanceof AttributeMetadata);
        return isPresent(p) ? p.attributeName : null;
    }
    static _query(properties) {
        return ListWrapper.find(properties, (p) => p instanceof QueryMetadata);
    }
}
export class DirectiveBinding extends ResolvedBinding {
    constructor(key, factory, deps, metadata, bindings, viewBindings) {
        super(key, [new ResolvedFactory(factory, deps)], false);
        this.metadata = metadata;
        this.bindings = bindings;
        this.viewBindings = viewBindings;
        this.callOnDestroy = hasLifecycleHook(LifecycleHooks.OnDestroy, key.token);
    }
    get displayName() { return this.key.displayName; }
    get queries() {
        if (isBlank(this.metadata.queries))
            return [];
        var res = [];
        StringMapWrapper.forEach(this.metadata.queries, (meta, fieldName) => {
            var setter = reflector.setter(fieldName);
            res.push(new QueryMetadataWithSetter(setter, meta));
        });
        return res;
    }
    get eventEmitters() {
        return isPresent(this.metadata) && isPresent(this.metadata.outputs) ? this.metadata.outputs :
            [];
    }
    static createFromBinding(binding, meta) {
        if (isBlank(meta)) {
            meta = new DirectiveMetadata();
        }
        var rb = resolveBinding(binding);
        var rf = rb.resolvedFactories[0];
        var deps = rf.dependencies.map(DirectiveDependency.createFrom);
        var bindings = isPresent(meta.bindings) ? meta.bindings : [];
        var viewBindigs = meta instanceof ComponentMetadata && isPresent(meta.viewBindings) ? meta.viewBindings : [];
        return new DirectiveBinding(rb.key, rf.factory, deps, meta, bindings, viewBindigs);
    }
    static createFromType(type, annotation) {
        var binding = new Binding(type, { toClass: type });
        return DirectiveBinding.createFromBinding(binding, annotation);
    }
}
// TODO(rado): benchmark and consider rolling in as ElementInjector fields.
export class PreBuiltObjects {
    constructor(viewManager, view, elementRef, templateRef) {
        this.viewManager = viewManager;
        this.view = view;
        this.elementRef = elementRef;
        this.templateRef = templateRef;
        this.nestedView = null;
    }
}
export class QueryMetadataWithSetter {
    constructor(setter, metadata) {
        this.setter = setter;
        this.metadata = metadata;
    }
}
export class EventEmitterAccessor {
    constructor(eventName, getter) {
        this.eventName = eventName;
        this.getter = getter;
    }
    subscribe(view, boundElementIndex, directive) {
        var eventEmitter = this.getter(directive);
        return ObservableWrapper.subscribe(eventEmitter, eventObj => view.triggerEventHandlers(this.eventName, eventObj, boundElementIndex));
    }
}
function _createEventEmitterAccessors(bwv) {
    var binding = bwv.binding;
    if (!(binding instanceof DirectiveBinding))
        return [];
    var db = binding;
    return ListWrapper.map(db.eventEmitters, eventConfig => {
        var parsedEvent = EventConfig.parse(eventConfig);
        return new EventEmitterAccessor(parsedEvent.eventName, reflector.getter(parsedEvent.fieldName));
    });
}
function _createProtoQueryRefs(bindings) {
    var res = [];
    ListWrapper.forEachWithIndex(bindings, (b, i) => {
        if (b.binding instanceof DirectiveBinding) {
            // field queries
            var queries = b.binding.queries;
            queries.forEach(q => res.push(new ProtoQueryRef(i, q.setter, q.metadata)));
            // queries passed into the constructor.
            // TODO: remove this after constructor queries are no longer supported
            var deps = b.binding.resolvedFactories[0].dependencies;
            deps.forEach(d => {
                if (isPresent(d.queryDecorator))
                    res.push(new ProtoQueryRef(i, null, d.queryDecorator));
            });
        }
    });
    return res;
}
export class ProtoElementInjector {
    constructor(parent, index, bwv, distanceToParent, _firstBindingIsComponent, directiveVariableBindings) {
        this.parent = parent;
        this.index = index;
        this.distanceToParent = distanceToParent;
        this._firstBindingIsComponent = _firstBindingIsComponent;
        this.directiveVariableBindings = directiveVariableBindings;
        var length = bwv.length;
        this.protoInjector = new ProtoInjector(bwv);
        this.eventEmitterAccessors = ListWrapper.createFixedSize(length);
        for (var i = 0; i < length; ++i) {
            this.eventEmitterAccessors[i] = _createEventEmitterAccessors(bwv[i]);
        }
        this.protoQueryRefs = _createProtoQueryRefs(bwv);
    }
    static create(parent, index, bindings, firstBindingIsComponent, distanceToParent, directiveVariableBindings) {
        var bd = [];
        ProtoElementInjector._createDirectiveBindingWithVisibility(bindings, bd, firstBindingIsComponent);
        if (firstBindingIsComponent) {
            ProtoElementInjector._createViewBindingsWithVisibility(bindings, bd);
        }
        ProtoElementInjector._createBindingsWithVisibility(bindings, bd);
        return new ProtoElementInjector(parent, index, bd, distanceToParent, firstBindingIsComponent, directiveVariableBindings);
    }
    static _createDirectiveBindingWithVisibility(dirBindings, bd, firstBindingIsComponent) {
        dirBindings.forEach(dirBinding => {
            bd.push(ProtoElementInjector._createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, dirBinding));
        });
    }
    static _createBindingsWithVisibility(dirBindings, bd) {
        var bindingsFromAllDirectives = [];
        dirBindings.forEach(dirBinding => {
            bindingsFromAllDirectives =
                ListWrapper.concat(bindingsFromAllDirectives, dirBinding.bindings);
        });
        var resolved = Injector.resolve(bindingsFromAllDirectives);
        resolved.forEach(b => bd.push(new BindingWithVisibility(b, Visibility.Public)));
    }
    static _createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, binding) {
        var isComponent = firstBindingIsComponent && dirBindings[0] === dirBinding;
        return new BindingWithVisibility(binding, isComponent ? Visibility.PublicAndPrivate : Visibility.Public);
    }
    static _createViewBindingsWithVisibility(dirBindings, bd) {
        var resolvedViewBindings = Injector.resolve(dirBindings[0].viewBindings);
        resolvedViewBindings.forEach(b => bd.push(new BindingWithVisibility(b, Visibility.Private)));
    }
    instantiate(parent) {
        return new ElementInjector(this, parent);
    }
    directParent() { return this.distanceToParent < 2 ? this.parent : null; }
    get hasBindings() { return this.eventEmitterAccessors.length > 0; }
    getBindingAtIndex(index) { return this.protoInjector.getBindingAtIndex(index); }
}
class _Context {
    constructor(element, componentElement, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.injector = injector;
    }
}
export class ElementInjector extends TreeNode {
    constructor(_proto, parent) {
        super(parent);
        this._proto = _proto;
        this._preBuiltObjects = null;
        this._injector =
            new Injector(this._proto.protoInjector, null, this, () => this._debugContext());
        // we couple ourselves to the injector strategy to avoid polymoprhic calls
        var injectorStrategy = this._injector.internalStrategy;
        this._strategy = injectorStrategy instanceof InjectorInlineStrategy ?
            new ElementInjectorInlineStrategy(injectorStrategy, this) :
            new ElementInjectorDynamicStrategy(injectorStrategy, this);
        this.hydrated = false;
        this._queryStrategy = this._buildQueryStrategy();
    }
    dehydrate() {
        this.hydrated = false;
        this._host = null;
        this._preBuiltObjects = null;
        this._strategy.callOnDestroy();
        this._strategy.dehydrate();
        this._queryStrategy.dehydrate();
    }
    hydrate(imperativelyCreatedInjector, host, preBuiltObjects) {
        this._host = host;
        this._preBuiltObjects = preBuiltObjects;
        this._reattachInjectors(imperativelyCreatedInjector);
        this._queryStrategy.hydrate();
        this._strategy.hydrate();
        this.hydrated = true;
    }
    _debugContext() {
        var p = this._preBuiltObjects;
        var index = p.elementRef.boundElementIndex - p.view.elementOffset;
        var c = this._preBuiltObjects.view.getDebugContext(index, null);
        return isPresent(c) ? new _Context(c.element, c.componentElement, c.injector) : null;
    }
    _reattachInjectors(imperativelyCreatedInjector) {
        // Dynamically-loaded component in the template. Not a root ElementInjector.
        if (isPresent(this._parent)) {
            if (isPresent(imperativelyCreatedInjector)) {
                // The imperative injector is similar to having an element between
                // the dynamic-loaded component and its parent => no boundaries.
                this._reattachInjector(this._injector, imperativelyCreatedInjector, false);
                this._reattachInjector(imperativelyCreatedInjector, this._parent._injector, false);
            }
            else {
                this._reattachInjector(this._injector, this._parent._injector, false);
            }
        }
        else if (isPresent(this._host)) {
            // The imperative injector is similar to having an element between
            // the dynamic-loaded component and its parent => no boundary between
            // the component and imperativelyCreatedInjector.
            // But since it is a root ElementInjector, we need to create a boundary
            // between imperativelyCreatedInjector and _host.
            if (isPresent(imperativelyCreatedInjector)) {
                this._reattachInjector(this._injector, imperativelyCreatedInjector, false);
                this._reattachInjector(imperativelyCreatedInjector, this._host._injector, true);
            }
            else {
                this._reattachInjector(this._injector, this._host._injector, true);
            }
        }
        else {
            if (isPresent(imperativelyCreatedInjector)) {
                this._reattachInjector(this._injector, imperativelyCreatedInjector, true);
            }
        }
    }
    _reattachInjector(injector, parentInjector, isBoundary) {
        injector.internalStrategy.attach(parentInjector, isBoundary);
    }
    hasVariableBinding(name) {
        var vb = this._proto.directiveVariableBindings;
        return isPresent(vb) && vb.has(name);
    }
    getVariableBinding(name) {
        var index = this._proto.directiveVariableBindings.get(name);
        return isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
    }
    get(token) { return this._injector.get(token); }
    hasDirective(type) { return isPresent(this._injector.getOptional(type)); }
    getEventEmitterAccessors() { return this._proto.eventEmitterAccessors; }
    getDirectiveVariableBindings() {
        return this._proto.directiveVariableBindings;
    }
    getComponent() { return this._strategy.getComponent(); }
    getInjector() { return this._injector; }
    getElementRef() { return this._preBuiltObjects.elementRef; }
    getViewContainerRef() {
        return new ViewContainerRef(this._preBuiltObjects.viewManager, this.getElementRef());
    }
    getNestedView() { return this._preBuiltObjects.nestedView; }
    getView() { return this._preBuiltObjects.view; }
    directParent() { return this._proto.distanceToParent < 2 ? this.parent : null; }
    isComponentKey(key) { return this._strategy.isComponentKey(key); }
    getDependency(injector, binding, dep) {
        var key = dep.key;
        if (binding instanceof DirectiveBinding) {
            var dirDep = dep;
            var dirBin = binding;
            var staticKeys = StaticKeys.instance();
            if (key.id === staticKeys.viewManagerId)
                return this._preBuiltObjects.viewManager;
            if (isPresent(dirDep.attributeName))
                return this._buildAttribute(dirDep);
            if (isPresent(dirDep.queryDecorator))
                return this._queryStrategy.findQuery(dirDep.queryDecorator).list;
            if (dirDep.key.id === StaticKeys.instance().changeDetectorRefId) {
                // We provide the component's view change detector to components and
                // the surrounding component's change detector to directives.
                if (dirBin.metadata instanceof ComponentMetadata) {
                    var componentView = this._preBuiltObjects.view.getNestedView(this._preBuiltObjects.elementRef.boundElementIndex);
                    return componentView.changeDetector.ref;
                }
                else {
                    return this._preBuiltObjects.view.changeDetector.ref;
                }
            }
            if (dirDep.key.id === StaticKeys.instance().elementRefId) {
                return this.getElementRef();
            }
            if (dirDep.key.id === StaticKeys.instance().viewContainerId) {
                return this.getViewContainerRef();
            }
            if (dirDep.key.id === StaticKeys.instance().templateRefId) {
                if (isBlank(this._preBuiltObjects.templateRef)) {
                    if (dirDep.optional) {
                        return null;
                    }
                    throw new NoBindingError(null, dirDep.key);
                }
                return this._preBuiltObjects.templateRef;
            }
        }
        else if (binding instanceof PipeBinding) {
            if (dep.key.id === StaticKeys.instance().changeDetectorRefId) {
                var componentView = this._preBuiltObjects.view.getNestedView(this._preBuiltObjects.elementRef.boundElementIndex);
                return componentView.changeDetector.ref;
            }
        }
        return UNDEFINED;
    }
    _buildAttribute(dep) {
        var attributes = this._proto.attributes;
        if (isPresent(attributes) && attributes.has(dep.attributeName)) {
            return attributes.get(dep.attributeName);
        }
        else {
            return null;
        }
    }
    addDirectivesMatchingQuery(query, list) {
        var templateRef = isBlank(this._preBuiltObjects) ? null : this._preBuiltObjects.templateRef;
        if (query.selector === TemplateRef && isPresent(templateRef)) {
            list.push(templateRef);
        }
        this._strategy.addDirectivesMatchingQuery(query, list);
    }
    _buildQueryStrategy() {
        if (this._proto.protoQueryRefs.length === 0) {
            return _emptyQueryStrategy;
        }
        else if (this._proto.protoQueryRefs.length <=
            InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES) {
            return new InlineQueryStrategy(this);
        }
        else {
            return new DynamicQueryStrategy(this);
        }
    }
    link(parent) { parent.addChild(this); }
    unlink() { this.remove(); }
    getDirectiveAtIndex(index) { return this._injector.getAt(index); }
    hasInstances() { return this._proto.hasBindings && this.hydrated; }
    getHost() { return this._host; }
    getBoundElementIndex() { return this._proto.index; }
    getRootViewInjectors() {
        if (!this.hydrated)
            return [];
        var view = this._preBuiltObjects.view;
        var nestedView = view.getNestedView(view.elementOffset + this.getBoundElementIndex());
        return isPresent(nestedView) ? nestedView.rootElementInjectors : [];
    }
    afterViewChecked() { this._queryStrategy.updateViewQueries(); }
    afterContentChecked() { this._queryStrategy.updateContentQueries(); }
    traverseAndSetQueriesAsDirty() {
        var inj = this;
        while (isPresent(inj)) {
            inj._setQueriesAsDirty();
            inj = inj.parent;
        }
    }
    _setQueriesAsDirty() {
        this._queryStrategy.setContentQueriesAsDirty();
        if (isPresent(this._host))
            this._host._queryStrategy.setViewQueriesAsDirty();
    }
}
class _EmptyQueryStrategy {
    setContentQueriesAsDirty() { }
    setViewQueriesAsDirty() { }
    hydrate() { }
    dehydrate() { }
    updateContentQueries() { }
    updateViewQueries() { }
    findQuery(query) {
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
var _emptyQueryStrategy = new _EmptyQueryStrategy();
class InlineQueryStrategy {
    constructor(ei) {
        var protoRefs = ei._proto.protoQueryRefs;
        if (protoRefs.length > 0)
            this.query0 = new QueryRef(protoRefs[0], ei);
        if (protoRefs.length > 1)
            this.query1 = new QueryRef(protoRefs[1], ei);
        if (protoRefs.length > 2)
            this.query2 = new QueryRef(protoRefs[2], ei);
    }
    setContentQueriesAsDirty() {
        if (isPresent(this.query0) && !this.query0.isViewQuery)
            this.query0.dirty = true;
        if (isPresent(this.query1) && !this.query1.isViewQuery)
            this.query1.dirty = true;
        if (isPresent(this.query2) && !this.query2.isViewQuery)
            this.query2.dirty = true;
    }
    setViewQueriesAsDirty() {
        if (isPresent(this.query0) && this.query0.isViewQuery)
            this.query0.dirty = true;
        if (isPresent(this.query1) && this.query1.isViewQuery)
            this.query1.dirty = true;
        if (isPresent(this.query2) && this.query2.isViewQuery)
            this.query2.dirty = true;
    }
    hydrate() {
        if (isPresent(this.query0))
            this.query0.hydrate();
        if (isPresent(this.query1))
            this.query1.hydrate();
        if (isPresent(this.query2))
            this.query2.hydrate();
    }
    dehydrate() {
        if (isPresent(this.query0))
            this.query0.dehydrate();
        if (isPresent(this.query1))
            this.query1.dehydrate();
        if (isPresent(this.query2))
            this.query2.dehydrate();
    }
    updateContentQueries() {
        if (isPresent(this.query0) && !this.query0.isViewQuery) {
            this.query0.update();
        }
        if (isPresent(this.query1) && !this.query1.isViewQuery) {
            this.query1.update();
        }
        if (isPresent(this.query2) && !this.query2.isViewQuery) {
            this.query2.update();
        }
    }
    updateViewQueries() {
        if (isPresent(this.query0) && this.query0.isViewQuery) {
            this.query0.update();
        }
        if (isPresent(this.query1) && this.query1.isViewQuery) {
            this.query1.update();
        }
        if (isPresent(this.query2) && this.query2.isViewQuery) {
            this.query2.update();
        }
    }
    findQuery(query) {
        if (isPresent(this.query0) && this.query0.protoQueryRef.query === query) {
            return this.query0;
        }
        if (isPresent(this.query1) && this.query1.protoQueryRef.query === query) {
            return this.query1;
        }
        if (isPresent(this.query2) && this.query2.protoQueryRef.query === query) {
            return this.query2;
        }
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES = 3;
class DynamicQueryStrategy {
    constructor(ei) {
        this.queries = ei._proto.protoQueryRefs.map(p => new QueryRef(p, ei));
    }
    setContentQueriesAsDirty() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery)
                q.dirty = true;
        }
    }
    setViewQueriesAsDirty() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery)
                q.dirty = true;
        }
    }
    hydrate() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            q.hydrate();
        }
    }
    dehydrate() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            q.dehydrate();
        }
    }
    updateContentQueries() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery) {
                q.update();
            }
        }
    }
    updateViewQueries() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery) {
                q.update();
            }
        }
    }
    findQuery(query) {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.protoQueryRef.query === query) {
                return q;
            }
        }
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 10 or less.
 * In such a case, inlining fields is beneficial for performances.
 */
class ElementInjectorInlineStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    hydrate() {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        i.resetConstructionCounter();
        if (p.binding0 instanceof DirectiveBinding && isPresent(p.keyId0) && i.obj0 === UNDEFINED)
            i.obj0 = i.instantiateBinding(p.binding0, p.visibility0);
        if (p.binding1 instanceof DirectiveBinding && isPresent(p.keyId1) && i.obj1 === UNDEFINED)
            i.obj1 = i.instantiateBinding(p.binding1, p.visibility1);
        if (p.binding2 instanceof DirectiveBinding && isPresent(p.keyId2) && i.obj2 === UNDEFINED)
            i.obj2 = i.instantiateBinding(p.binding2, p.visibility2);
        if (p.binding3 instanceof DirectiveBinding && isPresent(p.keyId3) && i.obj3 === UNDEFINED)
            i.obj3 = i.instantiateBinding(p.binding3, p.visibility3);
        if (p.binding4 instanceof DirectiveBinding && isPresent(p.keyId4) && i.obj4 === UNDEFINED)
            i.obj4 = i.instantiateBinding(p.binding4, p.visibility4);
        if (p.binding5 instanceof DirectiveBinding && isPresent(p.keyId5) && i.obj5 === UNDEFINED)
            i.obj5 = i.instantiateBinding(p.binding5, p.visibility5);
        if (p.binding6 instanceof DirectiveBinding && isPresent(p.keyId6) && i.obj6 === UNDEFINED)
            i.obj6 = i.instantiateBinding(p.binding6, p.visibility6);
        if (p.binding7 instanceof DirectiveBinding && isPresent(p.keyId7) && i.obj7 === UNDEFINED)
            i.obj7 = i.instantiateBinding(p.binding7, p.visibility7);
        if (p.binding8 instanceof DirectiveBinding && isPresent(p.keyId8) && i.obj8 === UNDEFINED)
            i.obj8 = i.instantiateBinding(p.binding8, p.visibility8);
        if (p.binding9 instanceof DirectiveBinding && isPresent(p.keyId9) && i.obj9 === UNDEFINED)
            i.obj9 = i.instantiateBinding(p.binding9, p.visibility9);
    }
    dehydrate() {
        var i = this.injectorStrategy;
        i.obj0 = UNDEFINED;
        i.obj1 = UNDEFINED;
        i.obj2 = UNDEFINED;
        i.obj3 = UNDEFINED;
        i.obj4 = UNDEFINED;
        i.obj5 = UNDEFINED;
        i.obj6 = UNDEFINED;
        i.obj7 = UNDEFINED;
        i.obj8 = UNDEFINED;
        i.obj9 = UNDEFINED;
    }
    callOnDestroy() {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (p.binding0 instanceof DirectiveBinding && p.binding0.callOnDestroy) {
            i.obj0.onDestroy();
        }
        if (p.binding1 instanceof DirectiveBinding && p.binding1.callOnDestroy) {
            i.obj1.onDestroy();
        }
        if (p.binding2 instanceof DirectiveBinding && p.binding2.callOnDestroy) {
            i.obj2.onDestroy();
        }
        if (p.binding3 instanceof DirectiveBinding && p.binding3.callOnDestroy) {
            i.obj3.onDestroy();
        }
        if (p.binding4 instanceof DirectiveBinding && p.binding4.callOnDestroy) {
            i.obj4.onDestroy();
        }
        if (p.binding5 instanceof DirectiveBinding && p.binding5.callOnDestroy) {
            i.obj5.onDestroy();
        }
        if (p.binding6 instanceof DirectiveBinding && p.binding6.callOnDestroy) {
            i.obj6.onDestroy();
        }
        if (p.binding7 instanceof DirectiveBinding && p.binding7.callOnDestroy) {
            i.obj7.onDestroy();
        }
        if (p.binding8 instanceof DirectiveBinding && p.binding8.callOnDestroy) {
            i.obj8.onDestroy();
        }
        if (p.binding9 instanceof DirectiveBinding && p.binding9.callOnDestroy) {
            i.obj9.onDestroy();
        }
    }
    getComponent() { return this.injectorStrategy.obj0; }
    isComponentKey(key) {
        return this._ei._proto._firstBindingIsComponent && isPresent(key) &&
            key.id === this.injectorStrategy.protoStrategy.keyId0;
    }
    addDirectivesMatchingQuery(query, list) {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (isPresent(p.binding0) && p.binding0.key.token === query.selector) {
            if (i.obj0 === UNDEFINED)
                i.obj0 = i.instantiateBinding(p.binding0, p.visibility0);
            list.push(i.obj0);
        }
        if (isPresent(p.binding1) && p.binding1.key.token === query.selector) {
            if (i.obj1 === UNDEFINED)
                i.obj1 = i.instantiateBinding(p.binding1, p.visibility1);
            list.push(i.obj1);
        }
        if (isPresent(p.binding2) && p.binding2.key.token === query.selector) {
            if (i.obj2 === UNDEFINED)
                i.obj2 = i.instantiateBinding(p.binding2, p.visibility2);
            list.push(i.obj2);
        }
        if (isPresent(p.binding3) && p.binding3.key.token === query.selector) {
            if (i.obj3 === UNDEFINED)
                i.obj3 = i.instantiateBinding(p.binding3, p.visibility3);
            list.push(i.obj3);
        }
        if (isPresent(p.binding4) && p.binding4.key.token === query.selector) {
            if (i.obj4 === UNDEFINED)
                i.obj4 = i.instantiateBinding(p.binding4, p.visibility4);
            list.push(i.obj4);
        }
        if (isPresent(p.binding5) && p.binding5.key.token === query.selector) {
            if (i.obj5 === UNDEFINED)
                i.obj5 = i.instantiateBinding(p.binding5, p.visibility5);
            list.push(i.obj5);
        }
        if (isPresent(p.binding6) && p.binding6.key.token === query.selector) {
            if (i.obj6 === UNDEFINED)
                i.obj6 = i.instantiateBinding(p.binding6, p.visibility6);
            list.push(i.obj6);
        }
        if (isPresent(p.binding7) && p.binding7.key.token === query.selector) {
            if (i.obj7 === UNDEFINED)
                i.obj7 = i.instantiateBinding(p.binding7, p.visibility7);
            list.push(i.obj7);
        }
        if (isPresent(p.binding8) && p.binding8.key.token === query.selector) {
            if (i.obj8 === UNDEFINED)
                i.obj8 = i.instantiateBinding(p.binding8, p.visibility8);
            list.push(i.obj8);
        }
        if (isPresent(p.binding9) && p.binding9.key.token === query.selector) {
            if (i.obj9 === UNDEFINED)
                i.obj9 = i.instantiateBinding(p.binding9, p.visibility9);
            list.push(i.obj9);
        }
    }
}
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 10 or less.
 * In such a case, inlining fields is beneficial for performances.
 */
class ElementInjectorDynamicStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    hydrate() {
        var inj = this.injectorStrategy;
        var p = inj.protoStrategy;
        inj.resetConstructionCounter();
        for (var i = 0; i < p.keyIds.length; i++) {
            if (p.bindings[i] instanceof DirectiveBinding && isPresent(p.keyIds[i]) &&
                inj.objs[i] === UNDEFINED) {
                inj.objs[i] = inj.instantiateBinding(p.bindings[i], p.visibilities[i]);
            }
        }
    }
    dehydrate() {
        var inj = this.injectorStrategy;
        ListWrapper.fill(inj.objs, UNDEFINED);
    }
    callOnDestroy() {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.bindings.length; i++) {
            if (p.bindings[i] instanceof DirectiveBinding &&
                p.bindings[i].callOnDestroy) {
                ist.objs[i].onDestroy();
            }
        }
    }
    getComponent() { return this.injectorStrategy.objs[0]; }
    isComponentKey(key) {
        var p = this.injectorStrategy.protoStrategy;
        return this._ei._proto._firstBindingIsComponent && isPresent(key) && key.id === p.keyIds[0];
    }
    addDirectivesMatchingQuery(query, list) {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.bindings.length; i++) {
            if (p.bindings[i].key.token === query.selector) {
                if (ist.objs[i] === UNDEFINED) {
                    ist.objs[i] = ist.instantiateBinding(p.bindings[i], p.visibilities[i]);
                }
                list.push(ist.objs[i]);
            }
        }
    }
}
export class ProtoQueryRef {
    constructor(dirIndex, setter, query) {
        this.dirIndex = dirIndex;
        this.setter = setter;
        this.query = query;
    }
    get usesPropertySyntax() { return isPresent(this.setter); }
}
export class QueryRef {
    constructor(protoQueryRef, originator) {
        this.protoQueryRef = protoQueryRef;
        this.originator = originator;
    }
    get isViewQuery() { return this.protoQueryRef.query.isViewQuery; }
    update() {
        if (!this.dirty)
            return;
        this._update();
        this.dirty = false;
        // TODO delete the check once only field queries are supported
        if (this.protoQueryRef.usesPropertySyntax) {
            var dir = this.originator.getDirectiveAtIndex(this.protoQueryRef.dirIndex);
            if (this.protoQueryRef.query.first) {
                this.protoQueryRef.setter(dir, this.list.length > 0 ? this.list.first : null);
            }
            else {
                this.protoQueryRef.setter(dir, this.list);
            }
        }
        this.list.notifyOnChanges();
    }
    _update() {
        var aggregator = [];
        if (this.protoQueryRef.query.isViewQuery) {
            var view = this.originator.getView();
            // intentionally skipping originator for view queries.
            var nestedView = view.getNestedView(view.elementOffset + this.originator.getBoundElementIndex());
            if (isPresent(nestedView))
                this._visitView(nestedView, aggregator);
        }
        else {
            this._visit(this.originator, aggregator);
        }
        this.list.reset(aggregator);
    }
    ;
    _visit(inj, aggregator) {
        var view = inj.getView();
        var startIdx = view.elementOffset + inj._proto.index;
        for (var i = startIdx; i < view.elementOffset + view.ownBindersCount; i++) {
            var curInj = view.elementInjectors[i];
            if (isBlank(curInj))
                continue;
            // The first injector after inj, that is outside the subtree rooted at
            // inj has to have a null parent or a parent that is an ancestor of inj.
            if (i > startIdx && (isBlank(curInj) || isBlank(curInj.parent) ||
                view.elementOffset + curInj.parent._proto.index < startIdx)) {
                break;
            }
            if (!this.protoQueryRef.query.descendants &&
                !(curInj.parent == this.originator || curInj == this.originator))
                continue;
            // We visit the view container(VC) views right after the injector that contains
            // the VC. Theoretically, that might not be the right order if there are
            // child injectors of said injector. Not clear whether if such case can
            // even be constructed with the current apis.
            this._visitInjector(curInj, aggregator);
            var vc = view.viewContainers[i];
            if (isPresent(vc))
                this._visitViewContainer(vc, aggregator);
        }
    }
    _visitInjector(inj, aggregator) {
        if (this.protoQueryRef.query.isVarBindingQuery) {
            this._aggregateVariableBindings(inj, aggregator);
        }
        else {
            this._aggregateDirective(inj, aggregator);
        }
    }
    _visitViewContainer(vc, aggregator) {
        for (var j = 0; j < vc.views.length; j++) {
            this._visitView(vc.views[j], aggregator);
        }
    }
    _visitView(view, aggregator) {
        for (var i = view.elementOffset; i < view.elementOffset + view.ownBindersCount; i++) {
            var inj = view.elementInjectors[i];
            if (isBlank(inj))
                continue;
            this._visitInjector(inj, aggregator);
            var vc = view.viewContainers[i];
            if (isPresent(vc))
                this._visitViewContainer(vc, aggregator);
        }
    }
    _aggregateVariableBindings(inj, aggregator) {
        var vb = this.protoQueryRef.query.varBindings;
        for (var i = 0; i < vb.length; ++i) {
            if (inj.hasVariableBinding(vb[i])) {
                aggregator.push(inj.getVariableBinding(vb[i]));
            }
        }
    }
    _aggregateDirective(inj, aggregator) {
        inj.addDirectivesMatchingQuery(this.protoQueryRef.query, aggregator);
    }
    dehydrate() { this.list = null; }
    hydrate() {
        this.list = new QueryList();
        this.dirty = true;
    }
}
//# sourceMappingURL=element_injector.js.map