import uuidv4 from 'uuid/v4';

export class BaseModel {

    constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date() ) {
    }

    static from(data: any): BaseModel {
      return new BaseModel(data.name, data.id, data.dateAdded);
    }
  }
