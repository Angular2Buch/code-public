/* */ 
'use strict';
var di_1 = require('../../core/di');
var pipes_1 = require('../../core/pipes');
var animation_builder_1 = require('../../animate/animation_builder');
var browser_details_1 = require('../../animate/browser_details');
var reflection_1 = require('../../core/reflection/reflection');
var change_detection_1 = require('../../core/change_detection/change_detection');
var event_manager_1 = require('../../core/render/dom/events/event_manager');
var proto_view_factory_1 = require('../../core/linker/proto_view_factory');
var browser_adapter_1 = require('../../core/dom/browser_adapter');
var key_events_1 = require('../../core/render/dom/events/key_events');
var hammer_gestures_1 = require('../../core/render/dom/events/hammer_gestures');
var view_pool_1 = require('../../core/linker/view_pool');
var api_1 = require('../../core/render/api');
var app_root_url_1 = require('../../core/compiler/app_root_url');
var render_1 = require('../../core/render/render');
var application_tokens_1 = require('../../core/application_tokens');
var element_schema_registry_1 = require('../../core/compiler/schema/element_schema_registry');
var dom_element_schema_registry_1 = require('../../core/compiler/schema/dom_element_schema_registry');
var shared_styles_host_1 = require('../../core/render/dom/shared_styles_host');
var dom_adapter_1 = require('../../core/dom/dom_adapter');
var ng_zone_1 = require('../../core/zone/ng_zone');
var view_manager_1 = require('../../core/linker/view_manager');
var view_manager_utils_1 = require('../../core/linker/view_manager_utils');
var view_listener_1 = require('../../core/linker/view_listener');
var view_resolver_1 = require('../../core/linker/view_resolver');
var directive_resolver_1 = require('../../core/linker/directive_resolver');
var exceptions_1 = require('../../core/facade/exceptions');
var dynamic_component_loader_1 = require('../../core/linker/dynamic_component_loader');
var url_resolver_1 = require('../../core/compiler/url_resolver');
var testability_1 = require('../../core/testability/testability');
var xhr_1 = require('../../core/compiler/xhr');
var xhr_impl_1 = require('../../core/compiler/xhr_impl');
var serializer_1 = require('../shared/serializer');
var api_2 = require('../shared/api');
var render_proto_view_ref_store_1 = require('../shared/render_proto_view_ref_store');
var render_view_with_fragments_store_1 = require('../shared/render_view_with_fragments_store');
var anchor_based_app_root_url_1 = require('../../core/compiler/anchor_based_app_root_url');
var impl_1 = require('./impl');
var message_bus_1 = require('../shared/message_bus');
var renderer_1 = require('./renderer');
var xhr_impl_2 = require('./xhr_impl');
var setup_1 = require('./setup');
var service_message_broker_1 = require('../shared/service_message_broker');
var client_message_broker_1 = require('../shared/client_message_broker');
var _rootInjector;
var _rootBindings = [di_1.bind(reflection_1.Reflector).toValue(reflection_1.reflector)];
function _injectorBindings() {
  return [di_1.bind(render_1.DOCUMENT).toValue(dom_adapter_1.DOM.defaultDoc()), event_manager_1.EventManager, new di_1.Binding(event_manager_1.EVENT_MANAGER_PLUGINS, {
    toClass: event_manager_1.DomEventsPlugin,
    multi: true
  }), new di_1.Binding(event_manager_1.EVENT_MANAGER_PLUGINS, {
    toClass: key_events_1.KeyEventsPlugin,
    multi: true
  }), new di_1.Binding(event_manager_1.EVENT_MANAGER_PLUGINS, {
    toClass: hammer_gestures_1.HammerGesturesPlugin,
    multi: true
  }), render_1.DomRenderer, di_1.bind(api_1.Renderer).toAlias(render_1.DomRenderer), application_tokens_1.APP_ID_RANDOM_BINDING, shared_styles_host_1.DomSharedStylesHost, di_1.bind(shared_styles_host_1.SharedStylesHost).toAlias(shared_styles_host_1.DomSharedStylesHost), serializer_1.Serializer, di_1.bind(api_2.ON_WEB_WORKER).toValue(false), di_1.bind(element_schema_registry_1.ElementSchemaRegistry).toValue(new dom_element_schema_registry_1.DomElementSchemaRegistry()), render_view_with_fragments_store_1.RenderViewWithFragmentsStore, render_proto_view_ref_store_1.RenderProtoViewRefStore, view_pool_1.AppViewPool, di_1.bind(view_pool_1.APP_VIEW_POOL_CAPACITY).toValue(10000), view_manager_1.AppViewManager, view_manager_utils_1.AppViewManagerUtils, view_listener_1.AppViewListener, proto_view_factory_1.ProtoViewFactory, view_resolver_1.ViewResolver, pipes_1.DEFAULT_PIPES, directive_resolver_1.DirectiveResolver, change_detection_1.Parser, change_detection_1.Lexer, di_1.bind(exceptions_1.ExceptionHandler).toFactory(function() {
    return new exceptions_1.ExceptionHandler(dom_adapter_1.DOM);
  }, []), di_1.bind(xhr_1.XHR).toValue(new xhr_impl_1.XHRImpl()), url_resolver_1.UrlResolver, dynamic_component_loader_1.DynamicComponentLoader, testability_1.Testability, anchor_based_app_root_url_1.AnchorBasedAppRootUrl, di_1.bind(app_root_url_1.AppRootUrl).toAlias(anchor_based_app_root_url_1.AnchorBasedAppRootUrl), impl_1.WebWorkerApplication, setup_1.WebWorkerSetup, xhr_impl_2.MessageBasedXHRImpl, renderer_1.MessageBasedRenderer, service_message_broker_1.ServiceMessageBrokerFactory, client_message_broker_1.ClientMessageBrokerFactory, browser_details_1.BrowserDetails, animation_builder_1.AnimationBuilder];
}
function createInjector(zone, bus) {
  browser_adapter_1.BrowserDomAdapter.makeCurrent();
  _rootBindings.push(di_1.bind(ng_zone_1.NgZone).toValue(zone));
  _rootBindings.push(di_1.bind(message_bus_1.MessageBus).toValue(bus));
  var injector = di_1.Injector.resolveAndCreate(_rootBindings);
  return injector.resolveAndCreateChild(_injectorBindings());
}
exports.createInjector = createInjector;
