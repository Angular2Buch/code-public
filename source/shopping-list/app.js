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
var angular2_2 = require('angular2/angular2');
var Item = (function () {
    function Item(name, quantity, checked) {
        if (quantity === void 0) { quantity = ''; }
        if (checked === void 0) { checked = false; }
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
        this.newName = '';
        this.newQuantity = '1';
        this.items = [
            new Item('Beer', '3', true),
            new Item('Water', '3 Bottles'),
            new Item('Apple', '20'),
            new Item('Milk', '2', true),
            new Item('Coffee', '1'),
            new Item('Sausage'),
        ];
    }
    ShoppingApp.prototype.addItem = function () {
        var newItem = new Item(this.newName, this.newQuantity, false);
        this.items.push(newItem);
    };
    ShoppingApp.prototype.checkAll = function () {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            item.checked = true;
        }
    };
    ShoppingApp.prototype.uncheckAll = function () {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            item.checked = false;
        }
    };
    ShoppingApp.prototype.deleteChecked = function () {
        this.items = this.items.filter(function (item) {
            return !item.checked;
        });
    };
    ShoppingApp = __decorate([
        angular2_1.Component({
            selector: 'shopping'
        }),
        angular2_1.View({
            directives: [ShoppingItem, angular2_1.NgFor, angular2_2.FORM_DIRECTIVES],
            templateUrl: 'templates/main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ShoppingApp);
    return ShoppingApp;
})();
angular2_1.bootstrap(ShoppingApp);
//# sourceMappingURL=app.js.map