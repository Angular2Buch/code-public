import {Component, View, NgFor, bootstrap} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';

/**
* Item class - data holder for shopping list items
*/
class Item {
  name: string;
  quantity: string;
  checked: boolean;

  constructor(name: string, quantity: string = '', checked:boolean = false) {
    this.name = name;
    this.quantity  = quantity;
    this.checked  = checked;
  }
}


/**
* Component for shopping list items
*/
@Component({
  selector: 'tbody',
  properties: ['item'],
})
@View({
  templateUrl: 'templates/item.html'
})
class ShoppingItem {
  item: Item;

  toggleChecked(thisItem: Item) {
    thisItem.checked = !thisItem.checked;
  }
}


/**
* Component for shopping list
*/
@Component({
  selector: 'shopping'
})
@View({
  directives: [ShoppingItem, NgFor, FORM_DIRECTIVES ],
  templateUrl: 'templates/main.html'
})
class ShoppingApp {

  items: Array<Item>;

  newName: string = '';
  newQuantity: string = '1';

  constructor() {
    this.items = [
      new Item('Beer','3', true),
      new Item('Water','3 Bottles'),
      new Item('Apple','20'),
      new Item('Milk','2', true),
      new Item('Coffee','1'),
      new Item('Sausage'),
    ]
  }

  /** add a new item to shopping list */
  addItem() {
    var newItem = new Item(this.newName, this.newQuantity, false);
    this.items.push(newItem);
  }

  /** check all items in list */
  checkAll() {
    for (var item of this.items) {
      item.checked = true
    }
  }

  /** uncheck all items in list */
  uncheckAll() {
    for (var item of this.items) {
      item.checked = false
    }
  }

  /** delete all checked items in list */
  deleteChecked() {
    this.items = this.items.filter((item) => {
       return !item.checked;
    });
  }
}


bootstrap(ShoppingApp);
