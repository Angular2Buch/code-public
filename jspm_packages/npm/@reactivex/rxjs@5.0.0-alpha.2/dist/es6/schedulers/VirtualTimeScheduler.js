/* */ 
"format cjs";
import Subscription from '../Subscription';
export default class VirtualTimeScheduler {
    constructor() {
        this.actions = [];
        this.active = false;
        this.scheduled = false;
        this.index = 0;
        this.sorted = false;
        this.frame = 0;
        this.maxFrames = 750;
    }
    now() {
        return this.frame * VirtualTimeScheduler.frameTimeFactor;
    }
    flush() {
        const actions = this.actions;
        const maxFrames = this.maxFrames;
        while (actions.length > 0) {
            let action = actions.shift();
            this.frame = action.delay;
            if (this.frame <= maxFrames) {
                action.execute();
            }
            else {
                break;
            }
        }
        actions.length = 0;
        this.frame = 0;
    }
    addAction(action) {
        const findDelay = action.delay;
        const actions = this.actions;
        const len = actions.length;
        const vaction = action;
        actions.push(action);
        actions.sort((a, b) => {
            return (a.delay === b.delay) ? (a.index === b.index ? 0 : (a.index > b.index ? 1 : -1)) : (a.delay > b.delay ? 1 : -1);
        });
    }
    schedule(work, delay = 0, state) {
        this.sorted = false;
        return new VirtualAction(this, work, this.index++).schedule(state, delay);
    }
}
VirtualTimeScheduler.frameTimeFactor = 10;
class VirtualAction extends Subscription {
    constructor(scheduler, work, index) {
        super();
        this.scheduler = scheduler;
        this.work = work;
        this.index = index;
    }
    schedule(state, delay = 0) {
        if (this.isUnsubscribed) {
            return this;
        }
        const scheduler = this.scheduler;
        var action = scheduler.frame === this.delay ? this :
            new VirtualAction(scheduler, this.work, scheduler.index += 1);
        action.state = state;
        action.delay = scheduler.frame + delay;
        scheduler.addAction(action);
        return this;
    }
    execute() {
        if (this.isUnsubscribed) {
            throw new Error("How did did we execute a canceled Action?");
        }
        this.work(this.state);
    }
    unsubscribe() {
        const scheduler = this.scheduler;
        const actions = scheduler.actions;
        const index = actions.indexOf(this);
        this.work = void 0;
        this.state = void 0;
        this.scheduler = void 0;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        super.unsubscribe();
    }
}
