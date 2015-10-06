/* */ 
"format cjs";
import Observable from '../Observable';
export default function concatProto(...observables) {
    var args = observables;
    args.unshift(this);
    if (args.length > 1 && typeof args[args.length - 1].schedule === 'function') {
        args.splice(args.length - 2, 0, 1);
    }
    return Observable.fromArray(args).mergeAll(1);
}
