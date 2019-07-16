import uuidv4 from 'uuid/v4';
import { BaseModel } from "./base-model";
import { Allergen } from './allergen-model';

export enum Status {
  NotScanned = "Not Scanned",
  NothingFound = "Nothing Found",
  SomethingFound = "Something Found"
}

export class Picture extends BaseModel {
  static from(data: any): Picture {
    const { allergens: _allergens } = data;
    const allergens = _allergens ? _allergens.map(Allergen.from): [];

    return new Picture(data.name, data.id, data.dateAdded, data.dateScanned, data.text, allergens);
  }

  constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date(),
              public dateScanned: Date = null, public text: string = '', public allergens: Allergen[] = []) {
    super(name, id, dateAdded);
  }

  extractedWords(): string[] {
    return this.text.split(' ');
  }

  toData() {
    return `data:image/jpeg;base64,${this.name}`;
  }

  containsAllergens(): boolean {
    return this.numAllergens() > 0;
  }

  numAllergens(): number {
    return this.allergens.length;
  }

  get status() {
    if (!this.dateScanned) {
      return Status.NotScanned
    }

    if (this.containsAllergens()) {
      return Status.SomethingFound
    }

    return Status.NothingFound
  }
}
