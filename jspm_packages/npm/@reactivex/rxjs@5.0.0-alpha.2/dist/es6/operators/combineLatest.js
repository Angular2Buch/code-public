/* */ 
"format cjs";
import ArrayObservable from '../observables/ArrayObservable';
import { CombineLatestOperator } from './combineLatest-support';
export default function combineLatest(...observables) {
    observables.unshift(this);
    let project;
    if (typeof observables[observables.length - 1] === "function") {
        project = observables.pop();
    }
    return new ArrayObservable(observables).lift(new CombineLatestOperator(project));
}
