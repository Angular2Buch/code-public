/* */ 
"format cjs";
import ArrayObservable from '../observables/ArrayObservable';
import { CombineLatestOperator } from './combineLatest-support';
export default function combineLatest(...observables) {
    let project, scheduler;
    if (typeof observables[observables.length - 1].schedule === 'function') {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    return new ArrayObservable(observables, scheduler).lift(new CombineLatestOperator(project));
}
