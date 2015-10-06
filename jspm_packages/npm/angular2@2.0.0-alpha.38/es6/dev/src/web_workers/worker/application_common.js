/* */ 
"format cjs";
import { bind } from 'angular2/src/core/di';
import { FORM_BINDINGS } from 'angular2/src/core/forms';
import { isPresent, print } from 'angular2/src/core/facade/lang';
import { ExceptionHandler } from 'angular2/src/core/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/core/facade/async';
import { XHR } from 'angular2/src/core/compiler/xhr';
import { WebWorkerXHRImpl } from 'angular2/src/web_workers/worker/xhr_impl';
import { AppRootUrl } from 'angular2/src/core/compiler/app_root_url';
import { WebWorkerRenderer } from './renderer';
import { Renderer } from 'angular2/src/core/render/api';
import { ClientMessageBrokerFactory } from 'angular2/src/web_workers/shared/client_message_broker';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { platformCommon, applicationCommonBindings } from 'angular2/src/core/application_ref';
import { Serializer } from "angular2/src/web_workers/shared/serializer";
import { ON_WEB_WORKER } from "angular2/src/web_workers/shared/api";
import { RenderProtoViewRefStore } from 'angular2/src/web_workers/shared/render_proto_view_ref_store';
import { RenderViewWithFragmentsStore } from 'angular2/src/web_workers/shared/render_view_with_fragments_store';
import { ObservableWrapper } from 'angular2/src/core/facade/async';
import { SETUP_CHANNEL } from 'angular2/src/web_workers/shared/messaging_api';
import { WebWorkerEventDispatcher } from 'angular2/src/web_workers/worker/event_dispatcher';
import { compilerBindings } from 'angular2/src/core/compiler/compiler';
/**
 * Initialize the Angular 'platform' on the page in a manner suitable for applications
 * running in a web worker. Applications running on a web worker do not have direct
 * access to DOM APIs.
 *
 * See {@link PlatformRef} for details on the Angular platform.
 *
 * # Without specified bindings
 *
 * If no bindings are specified, `platform`'s behavior depends on whether an existing
 * platform exists:
 *
 * If no platform exists, a new one will be created with the default {@link platformBindings}.
 *
 * If a platform already exists, it will be returned (regardless of what bindings it
 * was created with). This is a convenience feature, allowing for multiple applications
 * to be loaded into the same platform without awareness of each other.
 *
 * # With specified bindings
 *
 * It is also possible to specify bindings to be made in the new platform. These bindings
 * will be shared between all applications on the page. For example, an abstraction for
 * the browser cookie jar should be bound at the platform level, because there is only one
 * cookie jar regardless of how many applications on the age will be accessing it.
 *
 * If bindings are specified directly, `platform` will create the Angular platform with
 * them if a platform did not exist already. If it did exist, however, an error will be
 * thrown.
 *
 * # For Web Worker Appplications
 *
 * This version of `platform` initializes Angular for use with applications
 * that do not directly touch the DOM, such as applications which run in a
 * web worker context. Applications that need direct access to the DOM should
 * use `platform` from `core/application_common` instead.
 */
export function platform(bindings) {
    return platformCommon(bindings);
}
class PrintLogger {
    constructor() {
        this.log = print;
        this.logError = print;
        this.logGroup = print;
    }
    logGroupEnd() { }
}
function webWorkerBindings(appComponentType, bus, initData) {
    return [
        compilerBindings(),
        Serializer,
        bind(MessageBus).toValue(bus),
        ClientMessageBrokerFactory,
        WebWorkerRenderer,
        bind(Renderer).toAlias(WebWorkerRenderer),
        bind(ON_WEB_WORKER).toValue(true),
        RenderViewWithFragmentsStore,
        RenderProtoViewRefStore,
        bind(ExceptionHandler).toFactory(() => new ExceptionHandler(new PrintLogger()), []),
        WebWorkerXHRImpl,
        bind(XHR).toAlias(WebWorkerXHRImpl),
        bind(AppRootUrl).toValue(new AppRootUrl(initData['rootUrl'])),
        WebWorkerEventDispatcher,
        FORM_BINDINGS
    ];
}
export function bootstrapWebWorkerCommon(appComponentType, bus, appBindings = null) {
    var bootstrapProcess = PromiseWrapper.completer();
    var appPromise = platform().asyncApplication((zone) => {
        // TODO(rado): prepopulate template cache, so applications with only
        // index.html and main.js are possible.
        //
        bus.attachToZone(zone);
        bus.initChannel(SETUP_CHANNEL, false);
        var subscription;
        var emitter = bus.from(SETUP_CHANNEL);
        subscription = ObservableWrapper.subscribe(emitter, (message) => {
            var bindings = [applicationCommonBindings(), webWorkerBindings(appComponentType, bus, message)];
            if (isPresent(appBindings)) {
                bindings.push(appBindings);
            }
            bootstrapProcess.resolve(bindings);
            ObservableWrapper.dispose(subscription);
        });
        ObservableWrapper.callNext(bus.to(SETUP_CHANNEL), "ready");
        return bootstrapProcess.promise;
    });
    return PromiseWrapper.then(appPromise, (app) => app.bootstrap(appComponentType));
}
//# sourceMappingURL=application_common.js.map