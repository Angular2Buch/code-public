/// <reference path="./typings/angular2/angular2"/>

import {
  Component,
  View,
  For,
  bootstrap
} from 'angular2/angular2';

class Article{
  title : string;
  link  : string;
  votes : number;

  constructor(title, link) {
    this.title = title;
    this.link  = link;
    this.votes = 0;
  }

  voteUp() {
    this.votes += 1;
  }

  voteDown() {
    this.votes -= 1;
  }
}

@Component({
  selector: 'reddit-article',
  properties: {'article' : 'article'}
})
@View({
  template: `
    <article>
      <div class="votes">{{ article.votes }}</div>
      <div class="main">
        <h2>
          <a href="{{ article.link }}">{{ article.title }}</a>
        </h2>
        <ul>
          <li><a href (click)="voteUp()">upvote</a></li>
          <li><a href (click)="voteDown()">downvote</a></li>
        </ul>
      </div>
    </article>
  `
})
class RedditArticle {
  article: Article;
  
  voteUp(){
    this.article.voteUp();
    // Stops event propagation and avoids browser reload
    return false;
  }

  voteDown(){
    this.article.voteDown();
    return false;
  }
}

@Component({
  selector: 'reddit'
})
@View({
  directives: [RedditArticle, For],
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
      *for="#article of articles"
      [article]="article">
    </reddit-article>
  `
})
class RedditApp {
  articles: Array<Article>;

  constructor() {
    this.articles = [
      new Article(
        'Angular 2 - Beispiel Code',
        'https://github.com/Angular2Buch/code'),
      new Article(
        'Angular 2 - Buch',
        'https://github.com/Angular2Buch/book'),
      new Article(
        'Angular 2',
        'https://angular.io'),
    ]
  }

  addArticle(title, link) {
    this.articles.push(new Article(title.value, link.value));
    title.value = '';
    link.value  = '';
  }
}

bootstrap(RedditApp);
