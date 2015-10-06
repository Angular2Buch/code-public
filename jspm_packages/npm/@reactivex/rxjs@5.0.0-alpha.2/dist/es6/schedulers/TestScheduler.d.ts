import Observable from '../Observable';
import VirtualTimeScheduler from './VirtualTimeScheduler';
import Notification from '../Notification';
import Subject from '../Subject';
export default class TestScheduler extends VirtualTimeScheduler {
    assertDeepEqual: (actual: any, expected: any) => boolean | void;
    private hotObservables;
    constructor(assertDeepEqual: (actual: any, expected: any) => boolean | void);
    createColdObservable(marbles: string, values?: any, error?: any): any;
    createHotObservable<T>(marbles: string, values?: any, error?: any): Subject<T>;
    flushTests: ({
        observable: Observable<any>;
        marbles: string;
        actual?: any[];
        expected?: any[];
        ready: boolean;
    })[];
    expect(observable: Observable<any>): ({
        toBe: (marbles: string, values?: any, errorValue?: any) => void;
    });
    flush(): void;
    static parseMarbles(marbles: string, values?: any, errorValue?: any): ({
        frame: number;
        notification: Notification<any>;
    })[];
}
