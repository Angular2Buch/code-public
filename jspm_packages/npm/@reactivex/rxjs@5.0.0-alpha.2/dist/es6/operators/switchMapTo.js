/* */ 
"format cjs";
import { MergeMapToSubscriber } from './mergeMapTo-support';
export default function switchMapTo(observable, projectResult) {
    return this.lift(new SwitchMapToOperator(observable, projectResult));
}
class SwitchMapToOperator {
    constructor(observable, resultSelector) {
        this.observable = observable;
        this.resultSelector = resultSelector;
    }
    call(subscriber) {
        return new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector);
    }
}
class SwitchMapToSubscriber extends MergeMapToSubscriber {
    constructor(destination, observable, resultSelector) {
        super(destination, observable, resultSelector, 1);
    }
}
