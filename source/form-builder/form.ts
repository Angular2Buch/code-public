/// <reference path="../../lib/angular-latest-typings/angular2/angular2"/>

import {bootstrap, Component, View} from "angular2/angular2";
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup} from 'angular2/angular2';
import {Validators, NgIf} from 'angular2/angular2';

@Component({
  selector: 'demo-form-sku-builder',
  viewBindings: [FormBuilder]
})
@View({
  directives: [FORM_DIRECTIVES, NgIf],
  template: `
    <h2>Form</h2>
    <form ng-form-model="myForm"
          class="form form-inline"
          (submit)="onSubmit(myForm.value)">
      <div class="form-group">
        <label for="skuInput">SKU</label>
        <input type="text"
               class="form-control"
               [class.has-error]="!sku.valid && sku.touched"
               id="skuInput"
               placeholder="SKU"
               [ng-form-control]="myForm.controls['sku']" />

        <button type="submit" class="btn btn-default">Submit</button>
      </div>
    </form>

    <hr>
    <h2>Sku control</h2>
    <div *ng-if="!sku.valid" class="bg-warning">Sku has some errors.</div>
    <div *ng-if="sku.hasError('required')" class="bg-warning">Sku is required</div>

    <hr>
    <h2>Whole form</h2>
    <div *ng-if="!myForm.valid" class="bg-warning">Form is invalid</div>
  `
})
export class DemoForSku {

  myForm: ControlGroup;
  sku: Control;

  constructor(form: FormBuilder) {
    this.myForm = form.group({
      'sku': ['', Validators.required]
    });

    this.sku = this.myForm.controls['sku'];
  }

  onSubmit(value) {
    console.log('You submitted value: ', value);
  }
}

bootstrap(DemoForSku);
// var nameControl = new Control();
// var name = nameControl.value;
//
// nameControl.errors;
// nameControl.dirty;
// nameControl.valid;
//
// var personInfo = new ControlGroup({
//   firstName: new Control("Nate"),
//   lastName: new Control("Murray"),
//   zip: new Control(90210)
// });
//
// personInfo.errors;
// personInfo.dirty;
// personInfo.valid;
