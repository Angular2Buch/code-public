/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isPresent, isString } from 'angular2/src/facade/lang';
import { Directive, LifecycleEvent } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';
import { Renderer } from 'angular2/src/render/api';
import { IterableDiffers, KeyValueDiffers } from 'angular2/change_detection';
import { ListWrapper, StringMapWrapper, isListLikeIterable } from 'angular2/src/facade/collection';
/**
 * Adds and removes CSS classes based on an {expression} value.
 *
 * The result of expression is used to add and remove CSS classes using the following logic,
 * based on expression's value type:
 * - {string} - all the CSS classes (space - separated) are added
 * - {Array} - all the CSS classes (Array elements) are added
 * - {Object} - each key corresponds to a CSS class name while values
 * are interpreted as {boolean} expression. If a given expression
 * evaluates to {true} a corresponding CSS class is added - otherwise
 * it is removed.
 *
 * # Example:
 *
 * ```
 * <div class="message" [class]="{error: errorCount > 0}">
 *     Please check errors.
 * </div>
 * ```
 */
export let CSSClass = class {
    constructor(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
        this._iterableDiffers = _iterableDiffers;
        this._keyValueDiffers = _keyValueDiffers;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
    }
    set rawClass(v) {
        this._cleanupClasses(this._rawClass);
        if (isString(v)) {
            v = v.split(' ');
        }
        this._rawClass = v;
        if (isPresent(v)) {
            if (isListLikeIterable(v)) {
                this._differ = this._iterableDiffers.find(v).create(null);
                this._mode = 'iterable';
            }
            else {
                this._differ = this._keyValueDiffers.find(v).create(null);
                this._mode = 'keyValue';
            }
        }
    }
    onCheck() {
        if (isPresent(this._differ)) {
            var changes = this._differ.diff(this._rawClass);
            if (isPresent(changes)) {
                if (this._mode == 'iterable') {
                    this._applyIterableChanges(changes);
                }
                else {
                    this._applyKeyValueChanges(changes);
                }
            }
        }
    }
    onDestroy() { this._cleanupClasses(this._rawClass); }
    _cleanupClasses(rawClassVal) {
        if (isPresent(rawClassVal)) {
            if (isListLikeIterable(rawClassVal)) {
                ListWrapper.forEach(rawClassVal, (className) => { this._toggleClass(className, false); });
            }
            else {
                StringMapWrapper.forEach(rawClassVal, (expVal, className) => {
                    if (expVal)
                        this._toggleClass(className, false);
                });
            }
        }
    }
    _applyKeyValueChanges(changes) {
        changes.forEachAddedItem((record) => { this._toggleClass(record.key, record.currentValue); });
        changes.forEachChangedItem((record) => { this._toggleClass(record.key, record.currentValue); });
        changes.forEachRemovedItem((record) => {
            if (record.previousValue) {
                this._toggleClass(record.key, false);
            }
        });
    }
    _applyIterableChanges(changes) {
        changes.forEachAddedItem((record) => { this._toggleClass(record.item, true); });
        changes.forEachRemovedItem((record) => { this._toggleClass(record.item, false); });
    }
    _toggleClass(className, enabled) {
        this._renderer.setElementClass(this._ngEl, className, enabled);
    }
};
CSSClass = __decorate([
    Directive({
        selector: '[class]',
        lifecycle: [LifecycleEvent.onCheck, LifecycleEvent.onDestroy],
        properties: ['rawClass: class']
    }), 
    __metadata('design:paramtypes', [IterableDiffers, KeyValueDiffers, ElementRef, Renderer])
], CSSClass);
//# sourceMappingURL=class.js.map