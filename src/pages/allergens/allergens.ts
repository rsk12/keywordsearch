import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AllergensProvider } from '../../providers/allergens/allergens-provider';
import { Allergen } from '../../models/allergen-model';
import { ListPage } from '../list-page';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';

@IonicPage()
@Component({
  selector: 'page-allergens',
  templateUrl: 'allergens.html',
})
export class AllergensPage extends ListPage<Allergen> {
  constructor(protected platform: Platform, allergensProvider: AllergensProvider,
              protected alerter: GenericAlerter) {
    super('Allergen', platform, allergensProvider, alerter);
  }

  protected createItem(name): Allergen {
    return new Allergen(name);
  }
}
