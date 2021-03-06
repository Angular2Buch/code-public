/* */ 
"format cjs";
import { MergeMapOperator } from './mergeMap-support';
export default function mergeMap(project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
}
