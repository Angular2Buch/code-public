/* */ 
"format cjs";
import Subscriber from '../Subscriber';
import tryCatch from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import bindCallback from '../util/bindCallback';
import EmptyError from '../util/EmptyError';
export default function first(predicate, thisArg, defaultValue) {
    return this.lift(new FirstOperator(predicate, thisArg, defaultValue, this));
}
class FirstOperator {
    constructor(predicate, thisArg, defaultValue, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer) {
        return new FirstSubscriber(observer, this.predicate, this.thisArg, this.defaultValue, this.source);
    }
}
class FirstSubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, defaultValue, source) {
        super(destination);
        this.thisArg = thisArg;
        this.defaultValue = defaultValue;
        this.source = source;
        this.index = 0;
        this.hasCompleted = false;
        if (typeof predicate === 'function') {
            this.predicate = bindCallback(predicate, thisArg, 3);
        }
    }
    _next(value) {
        const destination = this.destination;
        const predicate = this.predicate;
        let passed = true;
        if (predicate) {
            passed = tryCatch(predicate)(value, this.index++, this.source);
            if (passed === errorObject) {
                destination.error(passed.e);
                return;
            }
        }
        if (passed) {
            destination.next(value);
            destination.complete();
            this.hasCompleted = true;
        }
    }
    _complete() {
        const destination = this.destination;
        if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
            destination.next(this.defaultValue);
            destination.complete();
        }
        else if (!this.hasCompleted) {
            destination.error(new EmptyError);
        }
    }
}
