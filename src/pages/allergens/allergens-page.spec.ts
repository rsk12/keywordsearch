import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { IonicModule, Platform, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/storage-mock';

import { AllergensPage } from './allergens';
import { PipesModule } from '../../pipes/pipes.module';
import { AllergensProvider } from '../../providers/allergens/allergens-provider';
import { Observable } from 'rxjs/Observable';
import { Allergen } from '../../models/allergen-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { PlatformMock } from '../../../test-config/mocks-ionic';

import { GenericAlerterMock } from '../../../test-config/generic-alerter-mock';
import { AllergensProviderMock } from '../../../test-config/allergens-provider-mock';
import { AlertControllerMock, AlertMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AllergensPage', () => {
  let fixture: ComponentFixture<AllergensPage>;
  let component: AllergensPage;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let alertMock = AlertMock.instance();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllergensPage],
      imports: [
        IonicModule.forRoot(AllergensPage),
        PipesModule,
      ],
      providers: [
        { provide: Storage, useClass: StorageMock },
        { provide: AlertController, useClass: AlertControllerMock.instance(alertMock) },
        { provide: Platform, useClass: PlatformMock },
        { provide: AllergensProvider, useClass: AllergensProviderMock },
        { provide: GenericAlerter, useClass: GenericAlerterMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergensPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof AllergensPage).toBe(true);
  });

  it('should load items when platform is ready', fakeAsync(() => {
    givenStoredAllergensNumbering(3);
    andALoadedView();
    whenListElementIsGrabbed();
    thenCountIs(3);
  }));

  function givenStoredAllergensNumbering(count: number) {
    const allergens = makeNumberOfAllergens(count);
    const allergensProvider = getAllergensProviderInstance();

    // @ts-ignore: Property 'items' is missing in type 'AllergensProvider'.
    const allergensProviderMock = allergensProvider as AllergensProviderMock;

    allergensProviderMock.setItems(allergens);
  }

  function makeNumberOfAllergens(count: number) {
    const allergens = [];

    for (let i = 0; i < count; i++) {
      allergens.push(Allergen.from({ name: i }));
    }

    return allergens;
  }

  function getAllergensProviderInstance() {
    // @ts-ignore: Property 'items' is missing in type 'AllergensProvider'.
    return fixture.debugElement.injector.get(AllergensProvider) as AllergensProviderMock;
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

  function thenCountIs(expectedCount: number) {
    expect(nativeElement.children.length).toBe(expectedCount);
  }

  it('should allow items to be added, update list after', fakeAsync(()=>{
    givenStoredAllergensNumbering(3);
    andALoadedView();
    whenAnAllergenIsAdded();
    andListElementIsGrabbed();
    thenCountIs(4);
  }));

  function whenAnAllergenIsAdded() {
    component.add();
    updateState();
  }

  function andListElementIsGrabbed() {
    whenListElementIsGrabbed();
  }

  it('should allow items to be edited, update list after', fakeAsync(() => {
    givenStoredAllergensNumbering(3);
    andALoadedView();
    whenFirstAllergenIsEdited();
    andListElementIsGrabbed();
    thenCountIs(3);
    andNameOfFirstItemIsUpdated();
  }));

  function whenFirstAllergenIsEdited() {
    const items = getItemsFromMockProvider();
    component.edit(items[0]);
  }

  function getItemsFromMockProvider() {
    const allergensProvider = getAllergensProviderInstance();
    const items = allergensProvider.getItemsForTesting();
    return items;
  }

  function andNameOfFirstItemIsUpdated() {
    const items = getItemsFromMockProvider();
    expect(items[0].name).toBe('edited');
  }

  it('should allow items to be removed, update list after', fakeAsync(() => {
    givenStoredAllergensNumbering(3);
    andALoadedView();
    whenFirstAllergenIsRemoved();
    andListElementIsGrabbed();
    thenCountIs(2);
  }));

  function whenFirstAllergenIsRemoved() {
    const items = getItemsFromMockProvider();
    component.remove(items[0]);
    updateState();
  }
});
