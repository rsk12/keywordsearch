import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products/products-provider';
import { Product } from '../../models/product-model';
import { ListPage } from '../list-page';
'../../providers/image-persistence/image-persistence';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraReadyStatus } from '../product/product-page';
import { OcrProvider } from '../../providers/ocr/ocr';
import { Picture } from '../../models/picture-model';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage extends ListPage<Product> {
  private cameraOptions: CameraOptions;

  constructor(protected platform: Platform, private productsProvider: ProductsProvider,
              protected alerter: GenericAlerter, private navController: NavController,
              private camera: Camera, private ocrProvider: OcrProvider) {
    super('Product', platform, productsProvider, alerter);

    this.createPicture = this.createPicture.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.extractLabelFor = this.extractLabelFor.bind(this);
    this.handleImageCaptureError = this.handleImageCaptureError.bind(this);

    // TODO: dedupte w/ ProductPage
    this.cameraOptions = {
      quality: 50,
      destinationType: camera.DestinationType.DATA_URL,
      sourceType: camera.PictureSourceType.CAMERA,
      encodingType: camera.EncodingType.JPEG,
      cameraDirection: camera.Direction.BACK,
      saveToPhotoAlbum: true
    };
  }

  protected createItem(name): Product {
    return new Product(name);
  }

  protected loadItems(): void {
    super.loadItems();
    this.monitorProductsForUpdates();
  }

  private monitorProductsForUpdates() {
    this
      .productsProvider
      .updates()
      .subscribe((items: Product[]) => this.handleItemsLoad(items));
  }

  view(product: Product): void {
    this.navController.push('ProductPage', {
      id: product.id,
    });
  }

  addFromPicture() {
    if (this.cantTakePhoto()) {
      this.alerter.presentError(this.cameraReadyStatus());
      return;
    }

    this
      .camera
      .getPicture(this.cameraOptions)
      .then(this.createPicture)
      .then(this.createProduct)
      .then(this.extractLabelFor)
      .catch(this.handleImageCaptureError);
  }

  // TODO: dedupte w/ ProductPage
  private cantTakePhoto(): boolean {
    return this.cameraReadyStatus() !== CameraReadyStatus.Ready;
  }

  // TODO: dedupte w/ ProductPage
  private cameraReadyStatus(): CameraReadyStatus {
    if (!this.platform.is('cordova')) {
      return CameraReadyStatus.NotOnDevice;
    }

    return CameraReadyStatus.Ready;
  }

  private createPicture(imagePath): Picture {
    return new Picture(imagePath)
  }

  private createProduct(picture: Picture): Product {
    return Product.from({ pictures: [picture] });
  }

  private extractLabelFor(product: Product) {
    const picture: Picture = product.lastPicture();

    return this
      .ocrProvider
      .extractLbel(picture)
      .then(text => this.handleTextExtraction(product, picture, text))
      .then(() => this.updateItems(product))
  }

  private handleTextExtraction(product: Product, picture: Picture, text: string) {
    product.name = text;
    picture.text = text;
  }

  private updateItems(product: Product) {
    this.items.push(product);
    this.save()
  }

  // TODO: dedupte w/ ProductPage
  private handleImageCaptureError(error: any): void {
    console.error("error capturing image:", error);

    this.alerter.presentError('Failed to capture image');
  }
}
