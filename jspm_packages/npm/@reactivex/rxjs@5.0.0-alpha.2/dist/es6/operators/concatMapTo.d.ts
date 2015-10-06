import Observable from '../Observable';
export default function concatMapTo<T, R, R2>(observable: Observable<R>, projectResult?: (innerValue: R, outerValue: T, innerIndex: number, outerIndex: number) => R2): Observable<R2>;
