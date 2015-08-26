import { Component, View, NgFor } from 'angular2/angular2';
import Article from 'imports/Article';
import RedditArticle from 'imports/RedditArticle';

@Component({
  selector: 'reddit'
})
@View({
  directives: [RedditArticle, NgFor],
  template: `
    <section class="new-link">
      <div class="control-group">
        <div><label for="title">Title:</label></div>
        <div><input name="title" #newtitle></div>
      </div>
      <div class="control-group">
        <div><label for="link">Link:</label></div>
        <div><input name="link" #newlink/></div>
      </div>

      <button (click)="addArticle(newtitle, newlink)">Submit link</button>
    </section>

    <reddit-article
      *ng-for="#article of articles"
      [article]="article"
      (voted)="sortList(article)">
    </reddit-article>
  `
})
export default class RedditApp {
  articles: Array<Article>;

  constructor() {
    this.articles = [
      new Article('Angular 2 - Beispiel Code', 'https://github.com/Angular2Buch/code'),
      new Article('Angular 2 - Buch', 'https://github.com/Angular2Buch/book'),
      new Article('Angular 2', 'https://angular.io'),
    ]
  }

  addArticle(title, link) {
    var newArticle = new Article(title.value, link.value);

    this.articles.push(newArticle);
    title.value = '';
    link.value  = '';

    this.sortList(newArticle);
  }

  sortList(article) {
    //console.log(article, 'got a new vote!');
    this.articles.sort((a, b) => b.votes - a.votes);
  }
}
