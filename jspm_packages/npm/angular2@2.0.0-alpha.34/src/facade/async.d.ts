/// <reference path="../../../../../angular2/typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../../../../angular2/typings/rx/rx.d.ts" />
import * as Rx from 'rx';
export { Promise };
export interface PromiseCompleter<R> {
    promise: Promise<R>;
    resolve: (value?: R | Thenable<R>) => void;
    reject: (error?: any, stackTrace?: string) => void;
}
export declare class PromiseWrapper {
    static resolve<T>(obj: T): Promise<T>;
    static reject(obj: any, _: any): Promise<any>;
    static catchError<T>(promise: Promise<T>, onError: (error: any) => T | Thenable<T>): Promise<T>;
    static all(promises: List<any>): Promise<any>;
    static then<T, U>(promise: Promise<T>, success: (value: T) => U | Thenable<U>, rejection?: (error: any, stack?: any) => U | Thenable<U>): Promise<U>;
    static wrap<T>(computation: () => T): Promise<T>;
    static completer(): PromiseCompleter<any>;
}
export declare class TimerWrapper {
    static setTimeout(fn: Function, millis: int): int;
    static clearTimeout(id: int): void;
    static setInterval(fn: Function, millis: int): int;
    static clearInterval(id: int): void;
}
export declare class ObservableWrapper {
    static subscribe<T>(emitter: Observable, onNext: (value: T) => void, onThrow?: (exception: any) => void, onReturn?: () => void): Object;
    static isObservable(obs: any): boolean;
    static dispose(subscription: any): void;
    static callNext(emitter: EventEmitter, value: any): void;
    static callThrow(emitter: EventEmitter, error: any): void;
    static callReturn(emitter: EventEmitter): void;
}
export declare class Observable {
    observer(generator: any): Object;
}
/**
 * Use Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 */
export declare class EventEmitter extends Observable {
    _subject: Rx.Subject<any>;
    _immediateScheduler: any;
    constructor();
    observer(generator: any): Rx.IDisposable;
    toRx(): Rx.Observable<any>;
    next(value: any): void;
    throw(error: any): void;
    return(value?: any): void;
}