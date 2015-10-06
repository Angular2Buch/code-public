/* */ 
"format cjs";
import { MergeMapToOperator } from './mergeMapTo-support';
export default function concatMapTo(observable, projectResult) {
    return this.lift(new MergeMapToOperator(observable, projectResult, 1));
}
