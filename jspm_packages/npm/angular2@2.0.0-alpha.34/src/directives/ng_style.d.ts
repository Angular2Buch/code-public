import { ElementRef } from 'angular2/core';
import { KeyValueDiffer, KeyValueDiffers } from 'angular2/change_detection';
import { Renderer } from 'angular2/src/render/api';
/**
 * Adds or removes styles based on an {expression}.
 *
 * When the expression assigned to `ng-style` evaluates to an object, the corresponding element
 * styles are updated. Style names to update are taken from the object keys and values - from the
 * corresponding object values.
 *
 * # Example:
 *
 * ```
 * <div ng-style="{'text-align': alignEpr}"></div>
 * ```
 *
 * In the above example the `text-align` style will be updated based on the `alignEpr` value
 * changes.
 *
 * # Syntax
 *
 * - `<div ng-style="{'text-align': alignEpr}"></div>`
 * - `<div ng-style="styleExp"></div>`
 */
export declare class NgStyle {
    private _differs;
    private _ngEl;
    private _renderer;
    _rawStyle: any;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer);
    rawStyle: any;
    onCheck(): void;
    private _applyChanges(changes);
    private _setStyle(name, val);
}
