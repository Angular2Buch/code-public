import {Injectable, Observable} from 'angular2/core';
import {Http, HTTP_PROVIDERS, URLSearchParams } from 'angular2/http';
import Station from './Station';

// enforce TypeScript to emit the needed metadata,
// see http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html
@Injectable()
export default class GasService {

  apiUrl: string = 'https://creativecommons.tankerkoenig.de/json/list.php?lat=52.52099975265203&lng=13.43803882598877&rad=4&sort=price&type=diesel';
  apiKey: string = '&apikey=acc6ad94-2b49-9190-5fcf-94d683f66887';
  listUrlAndKey: string;

  constructor(private http: Http) {

    this.listUrlAndKey = this.apiUrl + this.apiKey
  }

  getBestPrice(): Observable {

    return this.http.get(this.listUrlAndKey)
      .map(result => result.json().stations)
      .map((stations: Array<Station>): number =>
        stations[0].price
      )
  }
}
