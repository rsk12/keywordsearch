import { Product } from '../src/models/product-model';
import { ProductsSaver, ProductsFetcher } from '../src/providers/products/products-provider';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export class ProductsProviderMock implements ProductsFetcher, ProductsSaver {
  private items: Product[];
  observable: Observable<Product[]>;
  subscriber: Subscriber<Product[]>;

  constructor() {
    this.observable = new Observable<Product[]>((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  setItems(items: Product[]) {
    this.items = items;
  }

  getItems(): Promise<Product[]> {
    return Promise.resolve(this.items);
  }

  getItemsForTesting(): Product[] {
    return this.items;
  }

  save(items): Promise<any> {
    return Promise.resolve(this.items);
  }

  updates(): Observable<Product[]> {
    return this.observable;
  }
}
