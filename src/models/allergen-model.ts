import uuidv4 from 'uuid/v4';
import { BaseModel } from "./base-model";

export class Allergen extends BaseModel {

  static from(data: any): Allergen {
    const dateAdded = data.dataAdded ? new Date(data.dataAdded) : new Date();
    return new Allergen(data.name, data.id, dateAdded);
  }

  constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date() ) {
    super(name, id, dateAdded);
  }

  matches(word: string): boolean {
    return word.toLowerCase().includes(this.name.toLowerCase());
  }
}
