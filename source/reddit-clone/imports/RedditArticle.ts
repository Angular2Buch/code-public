import { Component, View, EventEmitter } from 'angular2/angular2';
import Article from 'imports/Article';

@Component({
  selector: 'reddit-article',
  properties: ['article'],
  events: ['voted']
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
export default class RedditArticle {
  article: Article;
  voted: EventEmitter;

  constructor() {
    this.voted = new EventEmitter();
  }

  voteUp(){
    this.article.voteUp();
    this.voted.next(this.article);
    // Stops event propagation and avoids browser reload
    return false;
  }

  voteDown(){
    this.article.voteDown();
    this.voted.next(this.article);
    return false;
  }
}
