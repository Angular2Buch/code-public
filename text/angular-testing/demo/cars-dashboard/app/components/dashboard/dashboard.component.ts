import { Component, View, NgFor, NgIf } from 'angular2/angular2';

import CarComponent from '../car/car.component';
import Car from '../../models/car';
import GasService from '../../models/gasService';

@Component({selector: 'dashboard'})
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
  cars: Array<Car>;
  totalDamages: number = 0;
  bestPrice: number = 0;

  constructor(private gasService: GasService) {
    this.cars = [new Car('ng-car 1.0'), new Car('ng-car 2.0')]
  }

  refillTank(car: Car, amountOfMoneyToSpend: number) {

    this.gasService
      .getBestPrice()
      .subscribe((bestPrice: number) => {

        this.bestPrice = bestPrice;
        car.refillTank(amountOfMoneyToSpend / bestPrice);
      },
      err => console.error(err));
  }

  notifyCarDamaged() {
    this.totalDamages++;
  }
}
