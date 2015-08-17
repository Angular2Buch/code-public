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
var angular2_1 = require('angular2/angular2');
var _ = require('lodash');
var Item = (function () {
    function Item(name, quantity, checked) {
        this.name = name;
        this.quantity = quantity;
        this.checked = checked;
    }
    return Item;
})();
var ShoppingItem = (function () {
    function ShoppingItem() {
    }
    ShoppingItem.prototype.toggleChecked = function (thisItem) {
        thisItem.checked = !thisItem.checked;
    };
    ShoppingItem = __decorate([
        angular2_1.Component({
            selector: 'tbody',
            properties: ['item'],
        }),
        angular2_1.View({
            templateUrl: 'templates/item.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ShoppingItem);
    return ShoppingItem;
})();
var ShoppingApp = (function () {
    function ShoppingApp() {
        this.items = [
            new Item('Beer', '3', true),
            new Item('Water', '3 Bottles', false),
            new Item('Apple', '20', false),
            new Item('Milk', '2', true),
            new Item('Coffee', '1', false),
            new Item('Sausage', '', false),
        ];
    }
    ShoppingApp.prototype.addItem = function (name, quantity) {
        this.items.push(new Item(name, quantity, false));
    };
    ShoppingApp.prototype.checkAll = function () {
        _.each(this.items, function (item) { item.checked = true; });
    };
    ShoppingApp.prototype.uncheckAll = function () {
        _.each(this.items, function (item) { item.checked = false; });
    };
    ShoppingApp.prototype.deleteChecked = function () {
        _.remove(this.items, function (item) { return item.checked; });
    };
    ShoppingApp = __decorate([
        angular2_1.Component({
            selector: 'shopping'
        }),
        angular2_1.View({
            directives: [ShoppingItem, angular2_1.NgFor],
            templateUrl: 'templates/main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ShoppingApp);
    return ShoppingApp;
})();
angular2_1.bootstrap(ShoppingApp);
//# sourceMappingURL=app.js.map