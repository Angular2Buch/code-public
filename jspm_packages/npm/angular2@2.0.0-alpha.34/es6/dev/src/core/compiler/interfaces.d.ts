/**
 * Defines lifecycle method {@link annotations/LifeCycleEvent#onChange `LifeCycleEvent.onChange`}
 * called after all of component's bound properties are updated.
 */
export interface OnChange {
    onChange(changes: StringMap<string, any>): void;
}
/**
 * Defines lifecycle method {@link annotations/LifeCycleEvent#onDestroy `LifeCycleEvent.onDestroy`}
 * called when a directive is being destroyed.
 */
export interface OnDestroy {
    onDestroy(): void;
}
/**
 * Defines lifecycle method {@link annotations/LifeCycleEvent#onCheck `LifeCycleEvent.onCheck`}
 * called when a directive is being checked.
 */
export interface OnCheck {
    onCheck(): void;
}
/**
 * Defines lifecycle method {@link annotations/LifeCycleEvent#onInit `LifeCycleEvent.onInit`}
 * called when a directive is being checked the first time.
 */
export interface OnInit {
    onInit(): void;
}
/**
 * Defines lifecycle method
 * {@link annotations/LifeCycleEvent#onAllChangesDone `LifeCycleEvent.onAllChangesDone`}
 * called when the bindings of all its children have been changed.
 */
export interface OnAllChangesDone {
    onAllChangesDone(): void;
}
