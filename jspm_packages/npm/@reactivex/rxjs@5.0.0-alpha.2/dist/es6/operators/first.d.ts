import Observable from '../Observable';
export default function first<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any, defaultValue?: any): Observable<T>;
