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
import { EventEmitter } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { Injectable } from "angular2/di";
/**
 * A TypeScript implementation of {@link MessageBus} for communicating via JavaScript's
 * postMessage API.
 */
export let PostMessageBus = class {
    constructor(_sink, _source) {
        this._sink = _sink;
        this._source = _source;
    }
    from(channel) { return this._source.from(channel); }
    to(channel) { return this._sink.to(channel); }
};
PostMessageBus = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [PostMessageBusSink, PostMessageBusSource])
], PostMessageBus);
export class PostMessageBusSink {
    constructor(_postMessageTarget) {
        this._postMessageTarget = _postMessageTarget;
        this._channels = StringMapWrapper.create();
    }
    to(channel) {
        if (StringMapWrapper.contains(this._channels, channel)) {
            return this._channels[channel];
        }
        else {
            var emitter = new EventEmitter();
            emitter.observer({
                next: (message) => {
                    this._postMessageTarget.postMessage({ channel: channel, message: message });
                }
            });
            return emitter;
        }
    }
}
export class PostMessageBusSource {
    constructor(eventTarget) {
        this._channels = StringMapWrapper.create();
        if (eventTarget) {
            eventTarget.addEventListener("message", (ev) => this._handleMessage(ev));
        }
        else {
            // if no eventTarget is given we assume we're in a WebWorker and listen on the global scope
            addEventListener("message", (ev) => this._handleMessage(ev));
        }
    }
    _handleMessage(ev) {
        var data = ev.data;
        var channel = data.channel;
        if (StringMapWrapper.contains(this._channels, channel)) {
            this._channels[channel].next(data.message);
        }
    }
    from(channel) {
        if (StringMapWrapper.contains(this._channels, channel)) {
            return this._channels[channel];
        }
        else {
            var emitter = new EventEmitter();
            this._channels[channel] = emitter;
            return emitter;
        }
    }
}
//# sourceMappingURL=post_message_bus.js.map