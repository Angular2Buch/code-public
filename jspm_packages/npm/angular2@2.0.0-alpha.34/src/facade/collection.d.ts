export declare var List: ArrayConstructor;
export declare var Map: {
    new (): Map<any, any>;
    new <K, V>(): Map<K, V>;
    new <K, V>(m: Map<K, V>): Map<any, any>;
    new <K, V>(l: List<any>): Map<any, any>;
    prototype: Map<any, any>;
};
export declare var Set: {
    new (): Set<any>;
    new <T>(): Set<T>;
    new <T>(s: Set<T>): Set<T>;
    new <T>(l: List<T>): Set<T>;
    prototype: Set<any>;
};
export declare var StringMap: ObjectConstructor;
export declare class MapWrapper {
    static clone<K, V>(m: Map<K, V>): Map<K, V>;
    static createFromStringMap<T>(stringMap: StringMap<string, T>): Map<string, T>;
    static toStringMap<T>(m: Map<string, T>): StringMap<string, T>;
    static createFromPairs(pairs: List<any>): Map<any, any>;
    static forEach<K, V>(m: Map<K, V>, fn: Function): void;
    static get<K, V>(map: Map<K, V>, key: K): V;
    static size(m: Map<any, any>): number;
    static delete<K>(m: Map<K, any>, k: K): void;
    static clearValues(m: Map<any, any>): void;
    static iterable<T>(m: T): T;
    static keys<K>(m: Map<K, any>): List<K>;
    static values<V>(m: Map<any, V>): List<V>;
}
/**
 * Wraps Javascript Objects
 */
export declare class StringMapWrapper {
    static create(): StringMap<any, any>;
    static contains(map: StringMap<string, any>, key: string): boolean;
    static get<V>(map: StringMap<string, V>, key: string): V;
    static set<V>(map: StringMap<string, V>, key: string, value: V): void;
    static keys(map: StringMap<string, any>): List<string>;
    static isEmpty(map: StringMap<string, any>): boolean;
    static delete(map: StringMap<string, any>, key: string): void;
    static forEach<K, V>(map: StringMap<string, V>, callback: Function): void;
    static merge<V>(m1: StringMap<string, V>, m2: StringMap<string, V>): StringMap<string, V>;
    static equals<V>(m1: StringMap<string, V>, m2: StringMap<string, V>): boolean;
}
export interface Predicate<T> {
    (value: T, index?: number, array?: T[]): boolean;
}
export declare class ListWrapper {
    static createFixedSize(size: number): List<any>;
    static createGrowableSize(size: number): List<any>;
    static get<T>(m: List<T>, k: number): T;
    static set<T>(m: List<T>, k: number, v: T): void;
    static clone<T>(array: List<T>): T[];
    static map<T, V>(array: List<T>, fn: (T) => V): List<V>;
    static forEach<T>(array: List<T>, fn: (T) => void): void;
    static first<T>(array: List<T>): T;
    static last<T>(array: List<T>): T;
    static find<T>(list: List<T>, pred: Predicate<T>): T;
    static indexOf<T>(array: List<T>, value: T, startIndex?: number): number;
    static reduce<T, E>(list: List<T>, fn: (accumValue: E, currentValue: T, currentIndex: number, array: T[]) => E, init: E): E;
    static filter<T>(array: List<T>, pred: Predicate<T>): T[];
    static any(list: List<any>, pred: Function): boolean;
    static contains<T>(list: List<T>, el: T): boolean;
    static reversed<T>(array: List<T>): T[];
    static concat(a: List<any>, b: List<any>): List<any>;
    static insert<T>(list: List<T>, index: number, value: T): void;
    static removeAt<T>(list: List<T>, index: number): T;
    static removeAll<T>(list: List<T>, items: List<T>): void;
    static removeLast<T>(list: List<T>): T;
    static remove<T>(list: List<T>, el: T): boolean;
    static clear(list: List<any>): void;
    static join(list: List<any>, s: string): string;
    static isEmpty(list: List<any>): boolean;
    static fill(list: List<any>, value: any, start?: number, end?: number): void;
    static equals(a: List<any>, b: List<any>): boolean;
    static slice<T>(l: List<T>, from?: number, to?: number): List<T>;
    static splice<T>(l: List<T>, from: number, length: number): List<T>;
    static sort<T>(l: List<T>, compareFn?: (a: T, b: T) => number): void;
    static toString<T>(l: List<T>): string;
    static toJSON<T>(l: List<T>): string;
}
export declare function isListLikeIterable(obj: any): boolean;
export declare function iterateListLike(obj: any, fn: Function): void;
export declare class SetWrapper {
    static createFromList<T>(lst: List<T>): Set<T>;
    static has<T>(s: Set<T>, key: T): boolean;
    static delete<K>(m: Set<K>, k: K): void;
}