import { Injectable } from '@angular/core';
import { ProductsProvider } from '../products/products-provider';
import { Product } from '../../models/product-model';

export interface ProductFetcher {
  getItem(id: string): Promise<Product>;
}

export interface ProductSaver {
  save(product: Product);
}

@Injectable()
export class ProductProvider implements ProductFetcher, ProductSaver {

  constructor(private productsProvider: ProductsProvider) {
    console.log('Hello ProductProvider Provider');
  }

  getItem(id: string): Promise<Product> {
    return this
      .fetchItems()
      .then((products: Product[]) => this.pluckItem(id, products));
  }

  private fetchItems() {
    return this
      .productsProvider
      .getItems();
  }

  private pluckItem(id: string, items: Product[]): Product {
    const item = items.find(item => item.id === id);

    if (item){ return item; }

    throw new Error(`Unable to find ${id} in ${items}`);
  }

  save(product: Product): Promise<any> {
    console.log('saving product', product);

    return this
      .fetchItems()
      .then((products: Product[]) => this.updateItem(product, products));
  }

  private updateItem(item: Product, items: Product[]): Promise<any> {
    console.log('updateItem', item, 'in items', items);

    const updatedItems = items.map(_item => _item.id === item.id ? item : _item);
    return this.productsProvider.save(updatedItems);
  }
}
