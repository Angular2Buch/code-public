/* */ 
"format cjs";
import Observable from '../Observable';
import VirtualTimeScheduler from './VirtualTimeScheduler';
import Notification from '../Notification';
import Subject from '../Subject';
export default class TestScheduler extends VirtualTimeScheduler {
    constructor(assertDeepEqual) {
        super();
        this.assertDeepEqual = assertDeepEqual;
        this.hotObservables = [];
        this.flushTests = [];
    }
    createColdObservable(marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        let messages = TestScheduler.parseMarbles(marbles, values, error);
        return Observable.create(subscriber => {
            messages.forEach(({ notification, frame }) => {
                subscriber.add(this.schedule(() => {
                    notification.observe(subscriber);
                }, frame));
            }, this);
        });
    }
    createHotObservable(marbles, values, error) {
        let messages = TestScheduler.parseMarbles(marbles, values, error);
        let subject = new Subject();
        this.hotObservables.push({
            setup(scheduler) {
                messages.forEach(({ notification, frame }) => {
                    scheduler.schedule(() => {
                        notification.observe(subject);
                    }, frame);
                });
            },
            subject
        });
        return subject;
    }
    expect(observable) {
        let actual = [];
        let flushTest = {
            observable, actual, marbles: null, ready: false
        };
        this.schedule(() => {
            observable.subscribe((value) => {
                actual.push({ frame: this.frame, notification: Notification.createNext(value) });
            }, (err) => {
                actual.push({ frame: this.frame, notification: Notification.createError(err) });
            }, () => {
                actual.push({ frame: this.frame, notification: Notification.createComplete() });
            });
        }, 0);
        this.flushTests.push(flushTest);
        return {
            toBe(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.marbles = marbles;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue);
            }
        };
    }
    flush() {
        const hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup(this);
        }
        super.flush();
        const flushTests = this.flushTests.filter(test => test.ready);
        while (flushTests.length > 0) {
            var test = flushTests.shift();
            test.actual.sort((a, b) => a.frame === b.frame ? 0 : (a.frame > b.frame ? 1 : -1));
            this.assertDeepEqual(test.actual, test.expected);
        }
    }
    static parseMarbles(marbles, values, errorValue) {
        let len = marbles.length;
        let results = [];
        let subIndex = marbles.indexOf('^');
        let frameOffset = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        let getValue = typeof values !== 'object' ? (x) => x : (x) => values[x];
        let groupStart = -1;
        for (let i = 0; i < len; i++) {
            let frame = i * this.frameTimeFactor;
            let notification;
            let c = marbles[i];
            switch (c) {
                case '-':
                    break;
                case '(':
                    groupStart = frame;
                    break;
                case ')':
                    groupStart = -1;
                    break;
                case '|':
                    notification = Notification.createComplete();
                    break;
                case '^':
                    break;
                case '#':
                    notification = Notification.createError(errorValue || 'error');
                    break;
                default:
                    notification = Notification.createNext(getValue(c));
                    break;
            }
            frame += frameOffset;
            if (notification) {
                results.push({ frame: groupStart > -1 ? groupStart : frame, notification });
            }
        }
        return results;
    }
}
