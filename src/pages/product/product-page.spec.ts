import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { IonicModule, IonicPage, ModalController  } from 'ionic-angular';
import { Platform  } from 'ionic-angular';
import { PlatformMock } from '../../../test-config/mocks-ionic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraMock } from '@ionic-native-mocks/camera';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../../test-config/nav-params-mock';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/storage-mock';

import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { Allergen } from '../../models/allergen-model';

import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider, AllergensFetcher, AllergensChecker } from '../../providers/allergens/allergens-provider';
import { AllergensProviderMock } from '../../../test-config/allergens-provider-mock';
import { GenericAlerter, Alerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider, ProductFetcher, ProductSaver } from '../../providers/product/product-provider';
import { ProductsProvider } from '../../providers/products/products-provider';
import { ProductsProviderMock } from '../../../test-config/products-provider-mock';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductPage } from './product-page';
import { By } from '@angular/platform-browser';
import { GenericAlerterMock } from '../../../test-config/generic-alerter-mock';
import { OcrProviderMock } from '../../../test-config/ocr-provider-mock';

class ProductProviderMock implements ProductFetcher, ProductSaver {
  public static product: Product = null;

  getItem(id: string): Promise<Product> {
    console.log('MOCK PRODUCT GET', ProductProviderMock.product);

    return Promise.resolve(ProductProviderMock.product);
  }

  save(product: Product) {
    console.log('MOCK PRODUCT SAVE', product);

    ProductProviderMock.product = product;
  }
}

describe('ProductPage', () => {
  const ALERT_MESSAGE_SELECTOR = '.alert-message';

  let fixture: ComponentFixture<ProductPage>;
  let component: ProductPage;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  let picture: Picture;
  let product: Product;

  beforeEach(async(() => {
    picture = Picture.from({ name: 'dummy pic' });
    product = Product.from({ name: 'dummy product' });

    product.addPicture(picture)

    ProductProviderMock.product = product;

    TestBed.configureTestingModule({
      declarations: [ProductPage],
      imports: [
        IonicModule.forRoot(ProductPage),
        PipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: Camera, useClass: CameraMock },
        { provide: NavParams, useClass: NavParamsMock },
        // TODO: not a valid use
        { provide: Storage, useClass: StorageMock },
        { provide: OcrProvider, useClass: OcrProviderMock },
        { provide: AllergensProvider, useClass: AllergensProviderMock },
        { provide: GenericAlerter, useClass: GenericAlerterMock },
        { provide: ProductProvider, useClass: ProductProviderMock },
        { provide: ProductsProvider, useClass: ProductsProviderMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;

    setupAllergens();
  });

  function setupAllergens() {
    const allergens = makeAllergens(['Sunflower', 'Fragrance', 'Parfum']);
    const allergensProvider = getAllergensProviderInstance();

    // @ts-ignore: Property 'items' is missing in type 'AllergensProvider'.
    const allergensProviderMock = allergensProvider as AllergensProviderMock;

    allergensProviderMock.setItems(allergens);
  }

  function makeAllergens(names: string[]) {
    return names.map(name => Allergen.from({ name }));
  }

  function getAllergensProviderInstance() {
    return fixture.debugElement.injector.get(AllergensProvider);
  }

  it('should be created', () => {
    expect(component instanceof ProductPage).toBe(true);
  });

  it('should identify all allergens in text extracted from scanned images', fakeAsync(() => {
    component.ionViewDidLoad();
    updateState();

    component.scanPicture(picture);
    fixture.detectChanges();

    updateState();

    product = ProductProviderMock.product;
    expect(product.numAllergens()).toBe(3);
  }));

  it('should track whether or not an image is being scanned', fakeAsync(() => {
    expect(component.isScanning(picture)).toBeFalsy();

    component.scanPicture(picture);
    fixture.detectChanges();

    expect(component.isScanning(picture)).toBeTruthy();

    updateState();

    expect(component.isScanning(picture)).toBeFalsy();;
  }));

  it('should be able to remove picture', fakeAsync(() => {
    component.removePicture(picture);
    fixture.detectChanges();
    updateState();

    product = ProductProviderMock.product;
    expect(product.numPictures()).toBe(0);
  }));

  function updateState() {
    tick();
    fixture.detectChanges();
  }
});
