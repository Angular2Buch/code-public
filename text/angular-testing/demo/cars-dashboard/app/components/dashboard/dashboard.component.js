var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var car_component_1 = require('../car/car.component');
var car_1 = require('../../models/car');
var DashboardComponent = (function () {
    function DashboardComponent() {
        this.totalDamages = 0;
        this.cars = [
            new car_1.default('ng-car 1.0'),
            new car_1.default('ng-car 2.0')
        ];
    }
    DashboardComponent.prototype.notifyCarDamaged = function () {
        this.totalDamages++;
    };
    DashboardComponent = __decorate([
        angular2_1.Component({ selector: 'dashboard' }),
        angular2_1.View({
            directives: [car_component_1.default, angular2_1.NgFor, angular2_1.NgIf],
            template: "\n    <div class=\"row\">\n      <template [ng-if]=\"totalDamages > 0\">\n        <div class=\"col-md-4\">\n          <p class=\"lead\">Reported Damages <span class=\"badge\">{{ totalDamages }}</span></p>\n        </div>\n      </template>\n    </div>\n    <div\n      *ng-for=\"#c of cars\"\n      class=\"row\">\n      <div class=\"col-md-4\">\n        <car #car [model]=\"c\" (damaged)=\"notifyCarDamaged($event)\"></car>\n      </div>\n      <div class=\"col-md-3 form-inline\">\n\n          <div class=\"form-group\">\n\n            <button\n              (click)=\"car.refillTank(money.value)\"\n              [disabled]=\"c == null\"\n              class=\"btn btn-primary form-control\">\n              &#x26fd; Refill for\n            </button>\n\n            <input #money value=\"100\" class=\"form-control\" placeholder=\"amount to spend\" style=\"width: 50px\">\n\n            <label>&euro;</label>\n\n          </div>\n\n        </div>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], DashboardComponent);
    return DashboardComponent;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map