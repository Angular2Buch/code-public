/* */ 
"format cjs";
import { PostMessageBus, PostMessageBusSink, PostMessageBusSource } from 'angular2/src/web_workers/shared/post_message_bus';
import { bootstrapWebWorkerCommon } from "angular2/src/web_workers/worker/application_common";
var _postMessage = postMessage;
/**
 * Bootstrapping a Webworker Application
 *
 * You instantiate the application side by calling bootstrapWebworker from your webworker index
 * script.
 * You can call bootstrapWebworker() exactly as you would call bootstrap() in a regular Angular
 * application
 * See the bootstrap() docs for more details.
 */
export function bootstrapWebWorker(appComponentType, componentInjectableBindings = null) {
    var sink = new PostMessageBusSink({
        postMessage: (message, transferrables) => { _postMessage(message, transferrables); }
    });
    var source = new PostMessageBusSource();
    var bus = new PostMessageBus(sink, source);
    return bootstrapWebWorkerCommon(appComponentType, bus, componentInjectableBindings);
}
//# sourceMappingURL=application.js.map