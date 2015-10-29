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
var CarComponent = (function () {
    function CarComponent() {
        this.damaged = new angular2_1.EventEmitter();
    }
    CarComponent.prototype.rockfall = function () {
        this.damaged.next(this.id);
    };
    CarComponent.prototype.getTankCapicity = function () {
        this.tankCapacity = Math.floor(Math.random() * 100);
    };
    __decorate([
        angular2_1.Input(), 
        __metadata('design:type', String)
    ], CarComponent.prototype, "id", void 0);
    __decorate([
        angular2_1.Input(), 
        __metadata('design:type', Number)
    ], CarComponent.prototype, "tankCapacity", void 0);
    __decorate([
        angular2_1.Output(), 
        __metadata('design:type', angular2_1.EventEmitter)
    ], CarComponent.prototype, "damaged", void 0);
    CarComponent = __decorate([
        angular2_1.Component({ selector: 'car' }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES],
            template: "\n  <div class=\"panel panel-default\">\n  <div class=\"panel-heading\">ID {{ id | uppercase }}</div>\n    <table class=\"table table-striped\">\n      <tr\n        [class.warning]=\"tankCapacity < 60\"\n        [class.danger]=\"tankCapacity < 20\">\n        <td>Tank Capacity</td>\n        <td>{{ tankCapacity }}</td>\n      </tr>\n      <tr>\n        <td>Change ID</td>\n        <td>\n        <input\n          [(ng-model)]=\"id\"\n          class=\"form-control\"\n          placeholder=\"Insert driver...\">\n        </td>\n      </tr>\n      <tr>\n        <td colspan=\"2\">\n          <button\n            class=\"btn btn-danger\"\n            (click)=\"rockfall()\">\n            Report rockfall\n          </button>\n        </td>\n      </tr>\n    </table>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], CarComponent);
    return CarComponent;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CarComponent;
//# sourceMappingURL=car.component.js.map