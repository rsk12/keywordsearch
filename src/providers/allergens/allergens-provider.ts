import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Allergen } from '../../models/allergen-model';
import { StorageDataProvider } from '../storage-data';

export interface AllergensFetcher {
  getItems(): Promise<Allergen[]>;
}

export interface AllergensSaver {
  save(items): Promise<any>;
}

export interface AllergensChecker {
  checkForAllergens(text: string): Promise<Allergen[]>;
}

@Injectable()
export class AllergensProvider extends StorageDataProvider implements AllergensFetcher, AllergensSaver, AllergensChecker {

  constructor(storage: Storage) {
    super(storage, 'allergens');
    console.log('Hello AllergensProvider');
  }

  getItems(): Promise<Allergen[]> {
    return super._getItems<Allergen>(Allergen.from);
  }

  checkForAllergens(text: string): Promise<Allergen[]> {
    return this
      .getItems()
      .then((allergens: Allergen[]) => this.handleAllergensCheck(text, allergens));
  }

  private handleAllergensCheck(text: string, allergens: Allergen[]): Allergen[] {
    const tokens = this.tokenizeText(text);

    // CONSIDER: new AllergenMatch concept that includes allergen and matching word
    return allergens.reduce((allTriggeredAllergens, allergen) => {
      const doesContainAllergen: boolean = this.doesCorpusContainAllergen(tokens, allergen);

      if (doesContainAllergen) {
        // console.log("FOUND ALLERGEN", allergen.name);
        return [...allTriggeredAllergens, allergen];
      }

      return allTriggeredAllergens;
    }, []);
  }

  private tokenizeText(text: string): string[] {
    return text
      .split(' ')
      .filter(token => token != '');
  }

  private doesCorpusContainAllergen(tokens: string[], allergen: Allergen): boolean {
    return !!tokens.find(token => allergen.matches(token));

  }
}
