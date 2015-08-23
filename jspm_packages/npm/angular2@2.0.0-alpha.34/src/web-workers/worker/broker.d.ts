/// <reference path="../../../../../../angular2/globals.d.ts" />
import { MessageBus } from "angular2/src/web-workers/shared/message_bus";
import { Promise } from "angular2/src/facade/async";
import { Serializer } from "angular2/src/web-workers/shared/serializer";
import { Type } from "angular2/src/facade/lang";
import { RenderViewRef, RenderEventDispatcher } from 'angular2/src/render/api';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
export declare class MessageBroker {
    private _messageBus;
    protected _serializer: Serializer;
    private _zone;
    private _pending;
    private _eventDispatchRegistry;
    constructor(_messageBus: MessageBus, _serializer: Serializer, _zone: NgZone);
    private _generateMessageId(name);
    runOnUiThread(args: UiArguments, returnType: Type): Promise<any>;
    private _handleMessage(message);
    private _dispatchEvent(eventData);
    registerEventDispatcher(viewRef: RenderViewRef, dispatcher: RenderEventDispatcher): void;
}
export declare class FnArg {
    value: any;
    type: any;
    constructor(value: any, type: any);
}
export declare class UiArguments {
    type: string;
    method: string;
    args: List<FnArg>;
    constructor(type: string, method: string, args?: List<FnArg>);
}
