/* */ 
"format cjs";
import Subscriber from '../Subscriber';
import tryCatch from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import bindCallback from '../util/bindCallback';
import EmptyError from '../util/EmptyError';
export default function last(predicate, thisArg, defaultValue) {
    return this.lift(new LastOperator(predicate, thisArg, defaultValue, this));
}
class LastOperator {
    constructor(predicate, thisArg, defaultValue, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer) {
        return new LastSubscriber(observer, this.predicate, this.thisArg, this.defaultValue, this.source);
    }
}
class LastSubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, defaultValue, source) {
        super(destination);
        this.thisArg = thisArg;
        this.defaultValue = defaultValue;
        this.source = source;
        this.hasValue = false;
        this.index = 0;
        if (typeof defaultValue !== 'undefined') {
            this.lastValue = defaultValue;
            this.hasValue = true;
        }
        if (typeof predicate === 'function') {
            this.predicate = bindCallback(predicate, thisArg, 3);
        }
    }
    _next(value) {
        const predicate = this.predicate;
        if (predicate) {
            let result = tryCatch(predicate)(value, this.index++, this.source);
            if (result === errorObject) {
                this.destination.error(result.e);
            }
            else if (result) {
                this.lastValue = value;
                this.hasValue = true;
            }
        }
        else {
            this.lastValue = value;
            this.hasValue = true;
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.hasValue) {
            destination.next(this.lastValue);
            destination.complete();
        }
        else {
            destination.error(new EmptyError);
        }
    }
}
