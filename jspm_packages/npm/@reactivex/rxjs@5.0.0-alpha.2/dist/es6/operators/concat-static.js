/* */ 
"format cjs";
import Observable from '../Observable';
import immediate from '../schedulers/immediate';
export default function concat(...observables) {
    let scheduler = immediate;
    let args = observables;
    const len = args.length;
    if (typeof (args[observables.length - 1]).schedule === 'function') {
        scheduler = args.pop();
        args.push(1, scheduler);
    }
    return Observable.fromArray(observables).mergeAll(1);
}
