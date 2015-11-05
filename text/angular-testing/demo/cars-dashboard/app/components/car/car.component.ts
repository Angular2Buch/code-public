import { Component, View , Input, Output, EventEmitter } from 'angular2/angular2';
import CarModel from '../../models/car';

@Component({ selector: 'car' })
@View({
  template: `
  <div class="panel panel-default">
  <div class="panel-heading">ID {{ model?.id | uppercase }}</div>
    <table class="table table-striped">
      <tr
        [class.success]="model?.hasDamage == false"
        [class.danger]="model?.hasDamage == true">
        <td>Damaged</td>
        <td>{{ model?.hasDamage }}</td>
      </tr>
      <tr
        [class.warning]="model?.tankCapacity < 60"
        [class.danger]="model?.tankCapacity < 20">
        <td>Tank Capacity</td>
        <td>{{ model?.tankCapacity }}</td>
      </tr>
      <tr>
        <td>Driver {{ model?.driver }}</td>
        <td>
        <input
          [value]="model?.driver"
          [disabled]="model == null"
          (input)="model.driver=$event.target.value"
          class="form-control"
          placeholder="Insert driver...">
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button
            (click)="rockfall()"
            [disabled]="model == null"
            class="btn btn-danger">
            Report rockfall
          </button>
        </td>
      </tr>
    </table>
  </div>
  `
})
export default class CarComponent {
  @Input() model: CarModel;
  @Output() damaged: EventEmitter = new EventEmitter();

  rockfall() {
    this.model.hasDamage = true;
    this.damaged.next(this.model);
  }

  getTankCapacity() {
    this.model.tankCapacity = Math.floor(Math.random() * 100);
  }
}
