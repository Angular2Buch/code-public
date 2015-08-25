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
var Article_1 = require('Article');
var RedditArticle_1 = require('RedditArticle');
var RedditApp = (function () {
    function RedditApp() {
        this.articles = [
            new Article_1.default('Angular 2 - Beispiel Code', 'https://github.com/Angular2Buch/code'),
            new Article_1.default('Angular 2 - Buch', 'https://github.com/Angular2Buch/book'),
            new Article_1.default('Angular 2', 'https://angular.io'),
        ];
    }
    RedditApp.prototype.addArticle = function (title, link) {
        this.articles.push(new Article_1.default(title.value, link.value));
        title.value = '';
        link.value = '';
    };
    RedditApp = __decorate([
        angular2_1.Component({
            selector: 'reddit'
        }),
        angular2_1.View({
            directives: [RedditArticle_1.default, angular2_1.NgFor],
            template: "\n    <section class=\"new-link\">\n      <div class=\"control-group\">\n        <div><label for=\"title\">Title:</label></div>\n        <div><input name=\"title\" #newtitle></div>\n      </div>\n      <div class=\"control-group\">\n        <div><label for=\"link\">Link:</label></div>\n        <div><input name=\"link\" #newlink/></div>\n      </div>\n\n      <button (click)=\"addArticle(newtitle, newlink)\">Submit link</button>\n    </section>\n\n    <reddit-article\n      *ng-for=\"#article of articles | orderBy: articles\"\n      [article]=\"article\">\n    </reddit-article>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RedditApp);
    return RedditApp;
})();
exports.default = RedditApp;
//# sourceMappingURL=RedditApp.js.map