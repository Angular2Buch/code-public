/* */ 
"format cjs";
import { MergeMapToOperator } from './mergeMapTo-support';
export default function mergeMapTo(observable, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeMapToOperator(observable, resultSelector, concurrent));
}
