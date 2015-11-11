import { Component, View, NgFor, NgIf } from 'angular2/angular2';
import {HTTP_PROVIDERS, Http} from 'angular2/http';

import CarComponent from '../car/car.component';
import CarModel from '../../models/car';

@Component({
  selector: 'dashboard',
  providers: [HTTP_PROVIDERS]}
)
@View({
  directives: [CarComponent, NgFor, NgIf],
  template: `
    <div class="row">
      <template [ng-if]="totalDamages > 0">
        <div class="col-md-4">
          <p class="lead">Reported Damages <span class="badge">{{ totalDamages }}</span></p>
        </div>
      </template>

      <template [ng-if]="bestPrice > 0">
        <div class="col-md-4">
          <p class="lead">Best Oil Price <span class="badge">{{ bestPrice }} €</span></p>
        </div>
      </template>
    </div>
    <div
      *ng-for="#c of cars"
      class="row">
      <div class="col-md-4">
        <car [model]="c" (damaged)="notifyCarDamaged($event)"></car>
      </div>
      <div class="col-md-3 form-inline">

          <div class="form-group">

            <button
              (click)="refillTank(c, money.value)"
              [disabled]="c == null"
              class="btn btn-primary form-control">
              &#9981; Refill for
            </button>

            <input #money value="100" class="form-control" placeholder="amount to spend" style="width: 50px">

            <label>&euro;</label>

          </div>

        </div>
      </div>
    </div>
  `
})
export default class DashboardComponent {
  cars: Array<CarModel>;
  totalDamages: number;
  bestPrice: number

  constructor(public http: Http) {
    this.totalDamages = 0;
    this.cars = [
      new CarModel('ng-car 1.0'),
      new CarModel('ng-car 2.0')
    ]
  }

  refillTank(car: CarModel, money: number) {

    this.http.get('https://creativecommons.tankerkoenig.de/json/list.php?lat=52.52099975265203&lng=13.43803882598877&rad=4&sort=price&type=diesel&apikey=acc6ad94-2b49-9190-5fcf-94d683f66887')
      .map(res => res.json())
      .subscribe(
        data => {
          this.bestPrice = data.stations[0].price;
          var oil = Math.floor(money / this.bestPrice);

          car.refillTank(oil);
        },
        err => console.error(err)
      );
  }

  notifyCarDamaged() {
    this.totalDamages++;
  }
}
