/// <reference path="../lib/angular-latest-typings/angular2/angular2"/>
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
var HelloWorld = (function () {
    function HelloWorld() {
        this.name = 'Angular 2 - Eine praktische Einführung in das JS Framework.';
        this.authors = ['Danny', 'Ferdinand', 'Johannes', 'Gregor'];
    }
    HelloWorld = __decorate([
        angular2_1.Component({
            selector: 'hello-world'
        }),
        angular2_1.View({
            directives: [angular2_1.NgFor],
            template: "\n  <div>\n      <h2>Unser Buch</h2>\n      <span>{{ name }}</span>\n      <h2>Autoren</h2>\n      <ul>\n        <li *ng-for=\"#author of authors\">{{ author }}</li>\n      </ul>\n  </div>"
        }), 
        __metadata('design:paramtypes', [])
    ], HelloWorld);
    return HelloWorld;
})();
angular2_1.bootstrap(HelloWorld);
//# sourceMappingURL=app.js.map