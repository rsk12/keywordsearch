import { StorageDataProvider } from "../providers/storage-data";
import { Platform } from "ionic-angular";
import { BaseModel } from "../models/base-model";
import { GenericAlerter } from "../providers/generic-alerter/generic-alerter";

export abstract class ListPage<T extends BaseModel> {
  protected items: T[] = [];
  protected isListDataLoaded: boolean = false;

  constructor (protected entityType, protected platform: Platform, private dataProvider: StorageDataProvider,
               protected alerter: GenericAlerter) {
    this.handleAddItem = this.handleAddItem.bind(this);
    this.save = this.save.bind(this);
  }

  ionViewDidLoad() {
    console.log(`ionViewDidLoad ${this.entityType}sPage`);
    this.setupPlatformReady();
  }

  private setupPlatformReady(): void {
    this.platform.ready().then(() => {
      console.log('platform ready');
      this.loadItems();
    });
  }

  protected loadItems(): void {
    this
      .dataProvider
      .getItems()
      .then((items: T[]) => this.handleItemsLoad(items))
      .catch(error => this.handleItemsLoadErorr(error));
  }

  protected handleItemsLoad(items: T[]): void {
    console.log("loaded items", items);

    this.isListDataLoaded = true;
    this.items = items;
  }

  protected handleItemsLoadErorr(error: any): void {
    console.error("load error:", error);
    this.isListDataLoaded = true;

    this.alerter.presentError(`Failed to load ${this.entityType}s`);
  }

  save() {
    this.dataProvider.save(this.items);
  }

  add(): void {
    this.alerter.presentCreate(`Add An ${this.entityType}`, this.handleAddItem);
  }

  private handleAddItem(name: string): void {
    const item: T = this.createItem(name);

    this.items.push(item);
    this.save();
  }

  protected abstract createItem(name)

  remove(item: T): void {
    this
      .dataProvider
      .remove(item, this.items)
      .then((items: T[]) => this.items = items);
  }

  edit(item: T): void {
    this
      .alerter
      .presentRename(item, this.save);
  }
}
