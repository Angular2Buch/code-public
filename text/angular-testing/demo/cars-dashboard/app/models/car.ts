export default class Car {
  id: string;
  driver: string;
  tankCapacity: number;
  hasDamage: boolean;

  constructor(id) {
    this.id = id;
    this.driver = '';
    this.tankCapacity = 100;
    this.hasDamage = false;
  }
}
