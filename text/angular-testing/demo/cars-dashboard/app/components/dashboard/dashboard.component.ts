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
        <car [model]="c" (damaged)="notifyCarDamaged($event)" var-car></car>
      </div>
      <div class="col-md-3">
        <button
          (click)="car.getTankCapacity()"
          [disabled]="c == null"
          class="btn btn-primary">
          Get tank capacity
        </button>
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
      new CarModel('ng-car 2.0'),
      null,
      undefined
    ]
  }

  notifyCarDamaged() {
    this.totalDamages++;
  }
}
