import { IQueryList } from './interface_query';
/**
 * Injectable Objects that contains a live list of child directives in the light Dom of a directive.
 * The directives are kept in depth-first pre-order traversal of the DOM.
 *
 * In the future this class will implement an Observable interface.
 * For now it uses a plain list of observable callbacks.
 */
export declare class QueryList<T> implements IQueryList<T> {
    protected _results: List<T>;
    protected _callbacks: List<() => void>;
    protected _dirty: boolean;
    reset(newList: List<T>): void;
    add(obj: T): void;
    fireCallbacks(): void;
    onChange(callback: () => void): void;
    removeCallback(callback: () => void): void;
    length: number;
    first: T;
    last: T;
    map<U>(fn: (item: T) => U): U[];
    [Symbol.iterator](): any;
}