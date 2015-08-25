import {Component, View, NgFor, bootstrap} from 'angular2/angular2';

/**
* Item class - data holder for shopping list items
*/
class Item {
  name : string;
  quantity  : string;
  checked  : boolean;

  constructor(name, quantity, checked) {
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
  directives: [ShoppingItem, NgFor],
  templateUrl: 'templates/main.html'
})
class ShoppingApp {
  items: Array<Item>;

  constructor() {
    this.items = [
      new Item('Beer','3', true),
      new Item('Water','3 Bottles', false),
      new Item('Apple','20', false),
      new Item('Milk','2', true),
      new Item('Coffee','1', false),
      new Item('Sausage','', false),
    ]
  }

  /** add a new item to shopping list */
  addItem(name: String, quantity: String) {
    this.items.push(new Item(name, quantity, false));
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
