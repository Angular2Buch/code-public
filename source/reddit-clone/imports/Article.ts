export default class Article {
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
