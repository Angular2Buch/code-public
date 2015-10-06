import Observable from '../Observable';
export default function last<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any, defaultValue?: any): Observable<T>;
