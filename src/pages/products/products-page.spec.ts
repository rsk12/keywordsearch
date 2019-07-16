import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { IonicModule, NavController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/storage-mock';
import { Camera } from '@ionic-native/camera';
import { CameraMock } from '@ionic-native-mocks/camera';
import { OcrProvider } from '../../providers/ocr/ocr';
import { OcrProviderMock } from '../../../test-config/ocr-provider-mock';

import { ProductsPage } from './products-page';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductsProvider } from '../../providers/products/products-provider';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../models/product-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { PlatformMock } from '../../../test-config/mocks-ionic';

import { NavControllerMock, NavMockAction } from '../../../test-config/nav-controller-mock';
import { GenericAlerterMock } from '../../../test-config/generic-alerter-mock';
import { ProductsProviderMock } from '../../../test-config/products-provider-mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


describe('ProductsPage', () => {
  let fixture: ComponentFixture<ProductsPage>;
  let component: ProductsPage;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsPage],
      imports: [
        IonicModule.forRoot(ProductsPage),
        PipesModule,
      ],
      providers: [
        { provide: Storage, useClass: StorageMock },
        { provide: ProductsProvider, useClass: ProductsProviderMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: GenericAlerter, useClass: GenericAlerterMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: Camera, useClass: CameraMock },
        { provide: OcrProvider, useClass: OcrProviderMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ProductsPage).toBe(true);
  });

  it('should load items when platform is ready', fakeAsync(() => {
    givenStoredProductsNumbering(3);
    andALoadedView();
    whenListElementIsGrabbed();
    thenCountIs(3);
  }));

  function givenStoredProductsNumbering(count: number) {
    const products = makeNumberOfProducts(count);
    const productsProvider = getProductsProviderInstance();

    productsProvider.setItems(products);
  }

  function makeNumberOfProducts(count: number) {
    const products = [];

    for (let i = 0; i < count; i++) {
      products.push(Product.from({ name: i }));
    }

    return products;
  }

  function getProductsProviderInstance() {
    // @ts-ignore: Property 'items' is missing in type 'ProductsProvider'.
    return fixture.debugElement.injector.get(ProductsProvider) as ProductsProviderMock;
  }

  function andALoadedView() {
    component.ionViewDidLoad();
    updateState();
  }

  function updateState() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function whenListElementIsGrabbed() {
    debugElement = fixture.debugElement.query(By.css('.list'));
    nativeElement = debugElement.nativeElement;
  }

  function andListElementIsGrabbed() {
    whenListElementIsGrabbed();
  }

  function thenCountIs(expectedCount: number) {
    expect(nativeElement.children.length).toBe(expectedCount);
  }

  it('should allow items to be added, update list after', fakeAsync(() => {
    givenStoredProductsNumbering(3);
    andALoadedView();
    whenAProductIsAdded();
    andListElementIsGrabbed();
    thenCountIs(4);
  }));

  function whenAProductIsAdded() {
    component.add();
    updateState();
  }

  it('should allow individual items to be viewed', fakeAsync(() => {
    givenStoredProductsNumbering(1);
    andALoadedView();
    whenFirstProductIsViewed();
    thenNavigationPointsToFirstProduct();
  }));

  function whenFirstProductIsViewed() {
    component.view(getTestItems()[0]);
    updateState()
  }

  function getTestItems(): Product[] {
    const productsProvider = getProductsProviderInstance();
    return productsProvider.getItemsForTesting();
  }

  function thenNavigationPointsToFirstProduct() {
    const navConttroller = getNavControllerInstance();
    const lastNavAction: NavMockAction = navConttroller.peekForTest();

    expect(lastNavAction.page).toBe('ProductPage');
    expect(lastNavAction.params.id).toBe(getTestItems()[0].id);
  }

  function getNavControllerInstance() {
    return fixture.debugElement.injector.get(NavController) as NavControllerMock;
  }

  it('should allow items to be added from the camera', fakeAsync(() => {
    givenStoredProductsNumbering(1);
    andALoadedView();
    whenProductIsAddedViaCamera();
    andListElementIsGrabbed();
    thenCountIs(2);
    andLastProductHasNameExtractedFromImage();
    andLastProductHasAPicture();
  }));

  function whenProductIsAddedViaCamera() {
    component.addFromPicture();
    updateState();
  }

  function andLastProductHasNameExtractedFromImage() {
    const product = getTestItems()[1];

    expect(product.name).toBe(OcrProviderMock.EXTRACTED_LABEL);
  }

  function andLastProductHasAPicture() {
    const product = getTestItems()[1];

    expect(product.hasPictures).toBeTruthy();
  }
});
