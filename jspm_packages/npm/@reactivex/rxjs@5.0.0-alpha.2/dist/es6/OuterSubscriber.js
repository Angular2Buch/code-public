/* */ 
"format cjs";
import Subscriber from './Subscriber';
export default class OuterSubscriber extends Subscriber {
    notifyComplete(inner) {
        this.destination.complete();
    }
    notifyNext(innerValue, outerValue, innerIndex, outerIndex) {
        this.destination.next(innerValue);
    }
    notifyError(error, inner) {
        this.destination.error(error);
    }
}
