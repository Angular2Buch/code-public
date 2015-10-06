import Observable from '../Observable';
export default function mergeMapTo<T, R, R2>(observable: Observable<R>, resultSelector?: (innerValue: R, outerValue: T, innerIndex: number, outerIndex: number) => R2, concurrent?: number): Observable<R2>;
