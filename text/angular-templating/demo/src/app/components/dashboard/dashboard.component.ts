import { Component, View, NgFor, NgIf } from 'angular2/angular2';
import CarComponent from '../car/car.component';
import CarModel from '../../models/car';

@Component({ selector: 'dashboard' })
@View({
  directives: [CarComponent, NgFor, NgIf],
  templateUrl: 'app/components/dashboard/dashboard.tpl.html'
})
export default class DashboardComponent {
  cars: Array<CarModel>;
  totalDamages: number;
  videoId: string;

  constructor() {
    this.totalDamages = 0;
    this.cars = [
      new CarModel('ng-car 1.0'),
      new CarModel('ng-car 2.0'),
      null,
      undefined
    ];
    this.videoId = "ewxEFdMPMF0";
  }

  notifyCarDamaged() {
    this.totalDamages++;
  }
}
