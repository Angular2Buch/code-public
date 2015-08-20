/// <reference path="../lib/angular-latest-bundle/typings/angular2/angular2"/>

import {Component, View, NgFor, bootstrap} from 'angular2/angular2';

// Component Annotation
@Component({
  // Telling angular resolve this component via <hello-world></hello-world>
  selector: 'hello-world'
})
// View Annotation
@View({
  directives: [NgFor],
  template: `
  <div>
      <h2>Unser Buch</h2>
      <span>{{ name }}</span>
      <h2>Autoren</h2>
      <ul>
        <li *ng-for="#author of authors">{{ author }}</li>
      </ul>
  </div>`
})
// Class
class HelloWorld {
  name   : string;
  authors: Array<string>;

  constructor() {
    this.name    = 'Angular 2 - Eine praktische Einführung in das JS Framework.';
    this.authors = ['Danny', 'Ferdinand', 'Johannes', 'Gregor'];
  }
}

// Tells that main component of app is HelloWorld
bootstrap(HelloWorld);
