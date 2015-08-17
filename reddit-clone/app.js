/// <reference path="./typings/angular2/angular2"/>
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
var Article = (function () {
    function Article(title, link) {
        this.title = title;
        this.link = link;
        this.votes = 0;
    }
    Article.prototype.voteUp = function () {
        this.votes += 1;
    };
    Article.prototype.voteDown = function () {
        this.votes -= 1;
    };
    return Article;
})();
var RedditArticle = (function () {
    function RedditArticle() {
    }
    RedditArticle.prototype.voteUp = function () {
        this.article.voteUp();
        return false;
    };
    RedditArticle.prototype.voteDown = function () {
        this.article.voteDown();
        return false;
    };
    RedditArticle = __decorate([
        angular2_1.Component({
            selector: 'reddit-article',
            properties: { 'article': 'article' }
        }),
        angular2_1.View({
            template: "\n    <article>\n      <div class=\"votes\">{{ article.votes }}</div>\n      <div class=\"main\">\n        <h2>\n          <a href=\"{{ article.link }}\">{{ article.title }}</a>\n        </h2>\n        <ul>\n          <li><a href (click)=\"voteUp()\">upvote</a></li>\n          <li><a href (click)=\"voteDown()\">downvote</a></li>\n        </ul>\n      </div>\n    </article>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RedditArticle);
    return RedditArticle;
})();
var RedditApp = (function () {
    function RedditApp() {
        this.articles = [
            new Article('Angular 2 - Beispiel Code', 'https://github.com/Angular2Buch/code'),
            new Article('Angular 2 - Buch', 'https://github.com/Angular2Buch/book'),
            new Article('Angular 2', 'https://angular.io'),
        ];
    }
    RedditApp.prototype.addArticle = function (title, link) {
        this.articles.push(new Article(title.value, link.value));
        title.value = '';
        link.value = '';
    };
    RedditApp = __decorate([
        angular2_1.Component({
            selector: 'reddit'
        }),
        angular2_1.View({
            directives: [RedditArticle, angular2_1.For],
            template: "\n    <section class=\"new-link\">\n      <div class=\"control-group\">\n        <div><label for=\"title\">Title:</label></div>\n        <div><input name=\"title\" #newtitle></div>\n      </div>\n      <div class=\"control-group\">\n        <div><label for=\"link\">Link:</label></div>\n        <div><input name=\"link\" #newlink/></div>\n      </div>\n\n      <button (click)=\"addArticle(newtitle, newlink)\">Submit link</button>\n    </section>\n\n    <reddit-article\n      *for=\"#article of articles\"\n      [article]=\"article\">\n    </reddit-article>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RedditApp);
    return RedditApp;
})();
angular2_1.bootstrap(RedditApp);
