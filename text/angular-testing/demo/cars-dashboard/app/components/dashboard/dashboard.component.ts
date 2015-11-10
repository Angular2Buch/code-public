import { Component, View, NgFor, NgIf } from 'angular2/angular2';
import CarComponent from '../car/car.component';
import CarModel from '../../models/car';

@Component({ selector: 'dashboard' })
@View({
  directives: [CarComponent, NgFor, NgIf],
  template: `
    <div class="row">
      <template [ng-if]="totalDamages > 0">
        <div class="col-md-4">
          <p class="lead">Reported Damages <span class="badge">{{ totalDamages }}</span></p>
        </div>
      </template>
    </div>
    <div
      *ng-for="#c of cars"
      class="row">
      <div class="col-md-4">
        <car #car [model]="c" (damaged)="notifyCarDamaged($event)"></car>
      </div>
      <div class="col-md-3 form-inline">

          <div class="form-group">

            <button
              (click)="car.refillTank(money.value)"
              [disabled]="c == null"
              class="btn btn-primary form-control">
              &#x26fd; Refill for
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

  constructor() {
    this.totalDamages = 0;
    this.cars = [
      new CarModel('ng-car 1.0'),
      new CarModel('ng-car 2.0')
    ]
  }

  notifyCarDamaged() {
    this.totalDamages++;
  }
}
