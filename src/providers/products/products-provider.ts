import { Observable } from "rxjs/Observable"
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageDataProvider } from '../storage-data';
import { Product } from '../../models/product-model';
import { Subscriber } from "rxjs/Subscriber";

export interface ProductsFetcher {
  getItems(): Promise<Product[]>;
}

export interface ProductsSaver {
  save(items): Promise<any>;
  updates(): Observable<Product[]>;
}

@Injectable()
export class ProductsProvider extends StorageDataProvider implements ProductsFetcher, ProductsSaver {
  observable: Observable<Product[]>;
  subscriber: Subscriber<Product[]>;

  constructor(storage: Storage) {
    super(storage, 'products');

    this.observable = new Observable<Product[]>((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  getItems(): Promise<Product[]> {
    return super._getItems<Product>(Product.from);
  }

  save(items): Promise<any> {
    const output = super.save(items);
    this.subscriber.next(items);

    return output;
  }

  updates(): Observable<Product[]> {
    return this.observable;
  }
}
