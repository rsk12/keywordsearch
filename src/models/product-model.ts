import uuidv4 from 'uuid/v4';
import { BaseModel } from "./base-model";
import { Picture, Status } from "./picture-model";

export class Product extends BaseModel {

  static from(data: any): Product {
    const { pictures: _pictures } = data;
    const pictures  = _pictures  ? _pictures.map(Picture.from) : [];

    return new Product(data.name, data.id, data.dateAdded, pictures);
  }

  constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date(),
              public pictures: Picture[] = []) {
    super(name, id, dateAdded);
  }

  addPicture(picture: Picture): void {
    this.pictures = [picture, ...this.pictures];
  }

  removePicture(picture: Picture): void {
    let index = this.pictures.indexOf(picture);

    this.pictures = [
      ...this.pictures.slice(0, index),
      ...this.pictures.slice(index + 1)
    ];
  }

  numAllergens(): number {
    return this.allergens.length;
  }

  containsAllergens(): boolean {
    return this.numAllergens() > 0;
  }

  numPictures(): number {
    return this.pictures.length;
  }

  hasPictures(): boolean {
    return this.numPictures() > 0;
  }

  lastPicture(): Picture|null {
    return this.hasPictures() ? this.pictures[this.numPictures() - 1] : null;
  }

  thumbnail(): string {
    return this.hasPictures() ? this.lastPicture().toData() : ''
  }

  isAllergenMatch(word: string): boolean {
    return !!this
      .allergens
      .find(allergen => allergen.matches(word));
  }

  get dateScanned() {
    return this.hasPictures() ? this.lastPicture().dateScanned : null;
  }

  get allergens() {
    return this.pictures.reduce((allergens, picture) =>
      [...allergens, ...picture.allergens],
    []);
  }

  get status() {
    const statuses: Status[] = this.pictures.map(picture => picture.status);

    if (statuses.indexOf(Status.SomethingFound) >= 0) {
      return Status.SomethingFound;
    }

    if (statuses.indexOf(Status.NothingFound) >= 0) {
      return Status.NothingFound;
    }

    return Status.NotScanned;
  }
}
