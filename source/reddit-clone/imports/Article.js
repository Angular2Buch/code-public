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
exports.default = Article;
//# sourceMappingURL=Article.js.map