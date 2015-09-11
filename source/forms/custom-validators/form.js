/// <reference path="../../../lib/angular-latest-typings/angular2/angular2"/>
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
var angular2_1 = require("angular2/angular2");
var angular2_2 = require('angular2/angular2');
var angular2_3 = require('angular2/angular2');
var DemoForSku = (function () {
    function DemoForSku(form) {
        this.myForm = form.group({
            'sku': ['', angular2_3.Validators.compose([
                    angular2_3.Validators.required,
                    this.skuValidator])]
        });
    }
    DemoForSku.prototype.onSubmit = function (value) {
        console.log('You submitted value: ', value);
    };
    DemoForSku.prototype.skuValidator = function (control) {
        if (!control.value.match(/^123/)) {
            return { invalidSku: true };
        }
    };
    DemoForSku = __decorate([
        angular2_1.Component({
            selector: 'demo-form-sku-builder',
            viewBindings: [angular2_2.FormBuilder]
        }),
        angular2_1.View({
            directives: [angular2_2.FORM_DIRECTIVES, angular2_3.NgIf],
            template: "\n    <form ng-form-model=\"myForm\"\n          class=\"form form-inline\"\n          (submit)=\"onSubmit(myForm.value)\">\n      <div class=\"form-group\"\n           [class.has-error]=\"!myForm.find('sku').valid &&\n                               myForm.find('sku').touched\">\n        <label for=\"skuInput\">SKU</label>\n        <input type=\"text\"\n               class=\"form-control\"\n               id=\"skuInput\"\n               placeholder=\"Type a unique number\"\n               [ng-form-control]=\"myForm.controls['sku']\" />\n\n        <button type=\"submit\" class=\"btn btn-default\">Submit</button>\n      </div>\n    </form>\n\n    <hr>\n    <h2>Sku control</h2>\n    <div *ng-if=\"!myForm.find('sku').valid\" class=\"bg-warning\">Sku has some errors.</div>\n    <div *ng-if=\"myForm.find('sku').hasError('required')\" class=\"bg-warning\">Sku is required</div>\n    <div *ng-if=\"myForm.find('sku').hasError('invalidSku')\" class=\"bg-warning\">Sku hast to start with '123'</div>\n\n    <hr>\n    <h2>Whole form</h2>\n    <div *ng-if=\"!myForm.valid\" class=\"bg-warning\">Form is invalid</div>\n  "
        }), 
        __metadata('design:paramtypes', [angular2_2.FormBuilder])
    ], DemoForSku);
    return DemoForSku;
})();
exports.DemoForSku = DemoForSku;
angular2_1.bootstrap(DemoForSku);
