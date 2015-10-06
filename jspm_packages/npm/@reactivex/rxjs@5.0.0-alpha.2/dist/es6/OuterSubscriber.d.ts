import InnerSubscriber from './InnerSubscriber';
import Subscriber from './Subscriber';
export default class OuterSubscriber<T, R> extends Subscriber<T> {
    notifyComplete(inner?: InnerSubscriber<T, R>): void;
    notifyNext(innerValue: R, outerValue: T, innerIndex: number, outerIndex: number): void;
    notifyError(error?: any, inner?: InnerSubscriber<T, R>): void;
}
