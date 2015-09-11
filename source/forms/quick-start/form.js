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
var DemoForSku = (function () {
    function DemoForSku() {
    }
    DemoForSku.prototype.onSubmit = function (value) {
        console.log('You submitted value: ', value);
    };
    DemoForSku = __decorate([
        angular2_1.Component({
            selector: 'demo-form-sku'
        }),
        angular2_1.View({
            directives: [angular2_2.FORM_DIRECTIVES],
            template: "\n    <div>\n    <h2>Form</h2>\n    <form #f=\"form\"\n          (submit)=\"onSubmit(f.value)\">\n      <div class=\"form-group\">\n        <label for=\"skuInput\">SKU</label>\n        <input type=\"text\"\n               class=\"form-control\"\n               id=\"skuInput\"\n               placeholder=\"SKU\"\n               ng-control=\"sku\" />\n\n        <button type=\"submit\" class=\"btn btn-default\">Submit</button>\n      </div>\n    </form>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], DemoForSku);
    return DemoForSku;
})();
exports.DemoForSku = DemoForSku;
angular2_1.bootstrap(DemoForSku);
