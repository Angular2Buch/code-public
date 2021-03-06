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
import { Binding } from 'angular2/src/core/di';
import { CONST_EXPR } from 'angular2/src/core/facade/lang';
import { Directive } from 'angular2/src/core/metadata';
import { Validators, NG_VALIDATORS } from '../validators';
const DEFAULT_VALIDATORS = CONST_EXPR(new Binding(NG_VALIDATORS, { toValue: Validators.required, multi: true }));
export let DefaultValidators = class {
};
DefaultValidators = __decorate([
    Directive({
        selector: '[required][ng-control],[required][ng-form-control],[required][ng-model]',
        bindings: [DEFAULT_VALIDATORS]
    }), 
    __metadata('design:paramtypes', [])
], DefaultValidators);
//# sourceMappingURL=validators.js.map