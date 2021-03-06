/* */ 
import Observable from './Observable';
import Subscriber from './Subscriber';
import Subscription from './Subscription';
import SubjectSubscription from './subjects/SubjectSubscription';
const subscriptionAdd = Subscription.prototype.add;
const subscriptionRemove = Subscription.prototype.remove;
const subscriptionUnsubscribe = Subscription.prototype.unsubscribe;
const subscriberNext = Subscriber.prototype.next;
const subscriberError = Subscriber.prototype.error;
const subscriberComplete = Subscriber.prototype.complete;
const _subscriberNext = Subscriber.prototype._next;
const _subscriberError = Subscriber.prototype._error;
const _subscriberComplete = Subscriber.prototype._complete;
const _observableSubscribe = Observable.prototype._subscribe;
export default class Subject extends Observable {
    constructor(...args) {
        super(...args);
        this.observers = [];
        this.isUnsubscribed = false;
        this.dispatching = false;
        this.errorSignal = false;
        this.completeSignal = false;
    }
    static create(source, destination) {
        return new BidirectionalSubject(source, destination);
    }
    lift(operator) {
        const subject = new BidirectionalSubject(this, this.destination || this);
        subject.operator = operator;
        return subject;
    }
    _subscribe(subscriber) {
        if (subscriber.isUnsubscribed) {
            return;
        }
        else if (this.errorSignal) {
            subscriber.error(this.errorInstance);
            return;
        }
        else if (this.completeSignal) {
            subscriber.complete();
            return;
        }
        else if (this.isUnsubscribed) {
            throw new Error("Cannot subscribe to a disposed Subject.");
        }
        this.observers.push(subscriber);
        return new SubjectSubscription(this, subscriber);
    }
    add(subscription) {
        subscriptionAdd.call(this, subscription);
    }
    remove(subscription) {
        subscriptionRemove.call(this, subscription);
    }
    unsubscribe() {
        this.observers = void 0;
        subscriptionUnsubscribe.call(this);
    }
    next(value) {
        if (this.isUnsubscribed) {
            return;
        }
        this.dispatching = true;
        this._next(value);
        this.dispatching = false;
        if (this.errorSignal) {
            this.error(this.errorInstance);
        }
        else if (this.completeSignal) {
            this.complete();
        }
    }
    error(error) {
        if (this.isUnsubscribed || this.completeSignal) {
            return;
        }
        this.errorSignal = true;
        this.errorInstance = error;
        if (this.dispatching) {
            return;
        }
        this._error(error);
        this.unsubscribe();
    }
    complete() {
        if (this.isUnsubscribed || this.errorSignal) {
            return;
        }
        this.completeSignal = true;
        if (this.dispatching) {
            return;
        }
        this._complete();
        this.unsubscribe();
    }
    _next(value) {
        let index = -1;
        const observers = this.observers.slice(0);
        const len = observers.length;
        while (++index < len) {
            observers[index].next(value);
        }
    }
    _error(error) {
        let index = -1;
        const observers = this.observers;
        const len = observers.length;
        // optimization -- block next, complete, and unsubscribe while dispatching
        this.observers = void 0;
        this.isUnsubscribed = true;
        while (++index < len) {
            observers[index].error(error);
        }
        this.isUnsubscribed = false;
    }
    _complete() {
        let index = -1;
        const observers = this.observers;
        const len = observers.length;
        // optimization -- block next, complete, and unsubscribe while dispatching
        this.observers = void 0; // optimization
        this.isUnsubscribed = true;
        while (++index < len) {
            observers[index].complete();
        }
        this.isUnsubscribed = false;
    }
}
class BidirectionalSubject extends Subject {
    constructor(source, destination) {
        super();
        this.source = source;
        this.destination = destination;
    }
    _subscribe(subscriber) {
        return _observableSubscribe.call(this, subscriber);
    }
    next(x) {
        subscriberNext.call(this, x);
    }
    error(e) {
        subscriberError.call(this, e);
    }
    complete() {
        subscriberComplete.call(this);
    }
    _next(x) {
        _subscriberNext.call(this, x);
    }
    _error(e) {
        _subscriberError.call(this, e);
    }
    _complete() {
        _subscriberComplete.call(this);
    }
}
