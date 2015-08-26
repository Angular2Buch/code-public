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
var RedditArticle = (function () {
    function RedditArticle() {
        this.voted = new angular2_1.EventEmitter();
    }
    RedditArticle.prototype.voteUp = function () {
        this.article.voteUp();
        this.voted.next(this.article);
        return false;
    };
    RedditArticle.prototype.voteDown = function () {
        this.article.voteDown();
        this.voted.next(this.article);
        return false;
    };
    RedditArticle = __decorate([
        angular2_1.Component({
            selector: 'reddit-article',
            properties: ['article'],
            events: ['voted']
        }),
        angular2_1.View({
            template: "\n    <article>\n      <div class=\"votes\">{{ article.votes }}</div>\n      <div class=\"main\">\n        <h2>\n          <a href=\"{{ article.link }}\">{{ article.title }}</a>\n        </h2>\n        <ul>\n          <li><a href (click)=\"voteUp()\">upvote</a></li>\n          <li><a href (click)=\"voteDown()\">downvote</a></li>\n        </ul>\n      </div>\n    </article>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RedditArticle);
    return RedditArticle;
})();
exports.default = RedditArticle;
//# sourceMappingURL=RedditArticle.js.map