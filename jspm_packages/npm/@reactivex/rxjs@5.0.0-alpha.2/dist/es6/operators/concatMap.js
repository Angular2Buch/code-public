/* */ 
"format cjs";
import { MergeMapOperator } from './mergeMap-support';
export default function concatMap(project, projectResult) {
    return this.lift(new MergeMapOperator(project, projectResult, 1));
}
