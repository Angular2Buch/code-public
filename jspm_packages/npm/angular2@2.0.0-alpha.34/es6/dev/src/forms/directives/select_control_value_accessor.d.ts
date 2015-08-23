import { Renderer } from 'angular2/render';
import { ElementRef, QueryList } from 'angular2/core';
import { NgControl } from './ng_control';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * Marks <option> as dynamic, so Angular can be notified when options change.
 *
 * #Example:
 *
 * ```
 * <select ng-control="city">
 *   <option *ng-for="#c of cities" [value]="c"></option>
 * </select>
 * ```
 */
export declare class NgSelectOption {
}
/**
 * The accessor for writing a value and listening to changes on a select element.
 */
export declare class SelectControlValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    private cd;
    value: string;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(cd: NgControl, renderer: Renderer, elementRef: ElementRef, query: QueryList<NgSelectOption>);
    writeValue(value: any): void;
    ngClassUntouched: boolean;
    ngClassTouched: boolean;
    ngClassPristine: boolean;
    ngClassDirty: boolean;
    ngClassValid: boolean;
    ngClassInvalid: boolean;
    registerOnChange(fn: () => any): void;
    registerOnTouched(fn: () => any): void;
    private _updateValueWhenListOfOptionsChanges(query);
}