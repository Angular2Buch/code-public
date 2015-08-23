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
import { bootstrapWebworkerCommon } from "angular2/src/web-workers/worker/application_common";
import { Injectable } from "angular2/di";
/**
 * Bootstrapping a Webworker Application
 *
 * You instantiate the application side by calling bootstrapWebworker from your webworker index
 * script.
 * You can call bootstrapWebworker() exactly as you would call bootstrap() in a regular Angular
 * application
 * See the bootstrap() docs for more details.
 */
export function bootstrapWebworker(appComponentType, componentInjectableBindings = null) {
    var bus = new WorkerMessageBus(new WorkerMessageBusSink(), new WorkerMessageBusSource());
    return bootstrapWebworkerCommon(appComponentType, bus, componentInjectableBindings);
}
export let WorkerMessageBus = class {
    constructor(sink, source) {
        this.sink = sink;
        this.source = source;
    }
};
WorkerMessageBus = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [WorkerMessageBusSink, WorkerMessageBusSource])
], WorkerMessageBus);
export class WorkerMessageBusSink {
    send(message) { postMessage(message, null); }
}
export class WorkerMessageBusSource {
    constructor() {
        this.numListeners = 0;
        this.listenerStore = new Map();
    }
    addListener(fn) {
        addEventListener("message", fn);
        this.listenerStore[++this.numListeners] = fn;
        return this.numListeners;
    }
    removeListener(index) {
        removeEventListener("message", this.listenerStore[index]);
        this.listenerStore.delete(index);
    }
}
//# sourceMappingURL=application.js.map