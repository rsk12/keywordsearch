import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { IonicPage, NavParams, ModalController, Platform } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider } from '../../providers/allergens/allergens-provider';
import { Allergen } from '../../models/allergen-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider } from '../../providers/product/product-provider';
import { Camera, CameraOptions } from '@ionic-native/camera';

export enum CameraReadyStatus {
  ViewDataNotLoaded = "Can't take photo - data not loaded",
  NotOnDevice = "Can't take photo - not on device",
  Ready = "Ready"
}

@IonicPage({
  defaultHistory: ['ProductsPage'],
  segment: 'products/:id'
})
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private cameraOptions: CameraOptions;

  private isDataLoaded: boolean = false;
  private pictureScanningMap: object = {};
  // TODO: use async pipe?
  private product: Product = Product.from({});

  constructor(private platform: Platform, private camera: Camera, private domSanitizer: DomSanitizer,
              private modalCtrl: ModalController, private navParams: NavParams, private ocrProvider: OcrProvider,
              private productProvider: ProductProvider, private allergensProvider: AllergensProvider, private alerter: GenericAlerter,) {
    this.cameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:      this.camera.PictureSourceType.CAMERA,
      encodingType:    this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      saveToPhotoAlbum:true
    };
  }

  transform(html) {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');

    const id = this.navParams.get('id');

    this
      .productProvider
      .getItem(id)
      .then(product => this.handleProductLoad(product))
      .catch(error => this.handleProductLoadError(error, id));
  }

  handleProductLoad(product: Product) {
    console.log('loaded product', product);
    this.product = product;
    this.isDataLoaded = true;
  }

  private handleProductLoadError(error: any, id: string) {
    const message = `Failed to load product ${id}`
    this.logAndPresentError(error, message.toLowerCase(), message);
  }

  private logAndPresentError(error: any, logMessage: string, displasyMessasge: string): void {
    console.error(logMessage, error);

    this.alerter.presentError(displasyMessasge);
    this.isDataLoaded = true;
  }

  presentEdit(): void {
    this
      .alerter
      .presentRename(this.product, () => this.save());
  }

  save(): Promise<any> {
    return this.productProvider.save(this.product);
  }

  viewText(picture: Picture): void {
    this
      .modalCtrl
      .create('PictureExtractedTextPage', { picture, product: this.product })
      .present();
  }

  removePicture(picture: Picture): Promise<any> {
    this.product.removePicture(picture);
    return this.save();
  }

  addPicture() {
    if (this.cantTakePhoto()) {
      this.alerter.presentError(this.cameraReadyStatus());
      return false;
    }

    this
      .camera
      .getPicture(this.cameraOptions)
      .then(imagePath => this.handleImageCapture(this.product, imagePath))
      .catch(error => this.handleImageCaptureError(error));
  }

  private cantTakePhoto(): boolean {
    return this.cameraReadyStatus() !== CameraReadyStatus.Ready;
  }

  private cameraReadyStatus(): CameraReadyStatus {
    if(!this.isDataLoaded) {
      return CameraReadyStatus.ViewDataNotLoaded;
    }

    if(!this.platform.is('cordova')){
      return CameraReadyStatus.NotOnDevice;
    }

    return CameraReadyStatus.Ready;
  }

  private handleImageCapture(product: Product, imagePath: string): void {
    console.log("captured image at path:", imagePath);

    this
      .handleImagePersistence(product, imagePath)
      .catch(error => this.handleImagePersistenceError(error));
  }

  private handleImagePersistence(product: Product, path: string): Promise<any> {
    console.log("image for", product, "persisted to path:", path);

    const picture = new Picture(path);
    product.addPicture(picture);

    return this.save();
  }

  private handleImagePersistenceError(error: any): void {
    console.error("image persistence error:", error);

    this.alerter.presentError('Failed to persist image on device');
  }

  private handleImageCaptureError(error: any): void {
    console.error("error capturing image:", error);

    this.alerter.presentError('Failed to capture image');
  }

  scanPicture(picture: Picture): void {
    console.log('scanning picture', picture);
    this.flagScanStart(picture);

    this
      .ocrProvider
      .extractText(picture)
      .then(text => this.handleTextExtraction(picture, text))
      .catch(error => this.handleTextExtractionError(error))
      .then(() => this.flagScanStop(picture));
  }

  private flagScanStart(picture: Picture) {
    this.pictureScanningMap[picture.id] = true;
  }

  private flagScanStop(picture: Picture) {
    this.pictureScanningMap[picture.id] = false;
  }

  private handleTextExtraction(picture: Picture, text: string): Promise<void> {
    console.log("text extraction produced", text);

    picture.dateScanned = new Date();
    picture.text = text;

    return this
      .allergensProvider
      .checkForAllergens(text)
      .then((allergens: Allergen[]) => this.handleAllergenCheck(picture, allergens))
      .catch(error => this.handleAllergenCheckError(error));
  }

  private handleAllergenCheck(picture: Picture,allergens: Allergen[]): Promise<void> {
    console.log("allergen check results", JSON.stringify(allergens));

    if(!allergens.length) {
      this.alerter.presentConfirmation("No allergens found!");
      return Promise.resolve();
    }

    this.presentAllergensDetected(allergens);
    this.handleAllergensFound(picture, allergens);

    return this.save();
  }

  private presentAllergensDetected(allergens: Allergen[]) {
    const title = 'Allergens Detected';
    const message = `Found ${allergens.length} allergens:\n ${allergens.map(allergen => allergen.name + '\n')}`;

    this
      .alerter
      .present(title, message);
  }

  private handleAllergensFound(picture: Picture, allergens: Allergen[]): void {
    picture.allergens = allergens;
  }

  private handleAllergenCheckError(error: any): void {
    this.logAndPresentError(error,'allergen check error', 'Failed to process image');

  }

  private handleTextExtractionError(error: any): void {
    this.logAndPresentError(error,'text extraction error', 'Failed to process text from image');
  }

  isScanning(picture: Picture): boolean {
    return this.pictureScanningMap[picture.id];
  }

}
