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
import { ReadyStates, RequestMethods } from '../enums';
import { Response } from '../static_response';
import { ResponseOptions } from '../base_response_options';
import { Injectable } from 'angular2/di';
import { BrowserJsonp } from './browser_jsonp';
import { EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { StringWrapper, isPresent, makeTypeError } from 'angular2/src/facade/lang';
export class JSONPConnection {
    constructor(req, _dom, baseResponseOptions) {
        this._dom = _dom;
        this.baseResponseOptions = baseResponseOptions;
        this._finished = false;
        if (req.method !== RequestMethods.GET) {
            throw makeTypeError("JSONP requests must use GET request method.");
        }
        this.request = req;
        this.response = new EventEmitter();
        this.readyState = ReadyStates.LOADING;
        this._id = _dom.nextRequestID();
        _dom.exposeConnection(this._id, this);
        // Workaround Dart
        // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
        let callback = _dom.requestCallback(this._id);
        let url = req.url;
        if (url.indexOf('=JSONP_CALLBACK&') > -1) {
            url = StringWrapper.replace(url, '=JSONP_CALLBACK&', `=${callback}&`);
        }
        else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
            url = StringWrapper.substring(url, 0, url.length - '=JSONP_CALLBACK'.length) + `=${callback}`;
        }
        let script = this._script = _dom.build(url);
        script.addEventListener('load', (event) => {
            if (this.readyState === ReadyStates.CANCELLED)
                return;
            this.readyState = ReadyStates.DONE;
            _dom.cleanup(script);
            if (!this._finished) {
                ObservableWrapper.callThrow(this.response, makeTypeError('JSONP injected script did not invoke callback.'));
                return;
            }
            let responseOptions = new ResponseOptions({ body: this._responseData });
            if (isPresent(this.baseResponseOptions)) {
                responseOptions = this.baseResponseOptions.merge(responseOptions);
            }
            ObservableWrapper.callNext(this.response, new Response(responseOptions));
        });
        script.addEventListener('error', (error) => {
            if (this.readyState === ReadyStates.CANCELLED)
                return;
            this.readyState = ReadyStates.DONE;
            _dom.cleanup(script);
            ObservableWrapper.callThrow(this.response, error);
        });
        _dom.send(script);
    }
    finished(data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === ReadyStates.CANCELLED)
            return;
        this._responseData = data;
    }
    dispose() {
        this.readyState = ReadyStates.CANCELLED;
        let script = this._script;
        this._script = null;
        if (isPresent(script)) {
            this._dom.cleanup(script);
        }
        ObservableWrapper.callReturn(this.response);
    }
}
export let JSONPBackend = class {
    constructor(_browserJSONP, _baseResponseOptions) {
        this._browserJSONP = _browserJSONP;
        this._baseResponseOptions = _baseResponseOptions;
    }
    createConnection(request) {
        return new JSONPConnection(request, this._browserJSONP, this._baseResponseOptions);
    }
};
JSONPBackend = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [BrowserJsonp, ResponseOptions])
], JSONPBackend);
//# sourceMappingURL=jsonp_backend.js.map