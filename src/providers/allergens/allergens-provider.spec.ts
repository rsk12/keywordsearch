import { AllergensProvider } from './allergens-provider';
import { Allergen } from '../../models/allergen-model';
import { StorageMock } from '../../../test-config/storage-mock';

describe('AllergensProvider', () => {
  let provider: AllergensProvider;
  let allergen: Allergen;

  const testContainsText = (done, text) => {
    // when text is checked for matching allergen...
    provider
    .checkForAllergens(text)
    .then(results => {
      // ...then match is detected...
      expect(results[0].id).toBe(allergen.id);
      done();
    });
  }

  beforeEach(() => {
    // ...given the stored allergen "Foo"
    allergen = Allergen.from({name: 'Foo'});

    const json = JSON.stringify([allergen]);
    const storage = StorageMock.instance('allergens', json);

    provider = new AllergensProvider(storage);
  });

  it('should flag word if there exists an allergen with that name', (done) => {
    testContainsText(done, 'Foo');
  });

  it('should be case insensitive', (done) => {
    testContainsText(done, 'foo');
  });

  it('should match first word in sentence', (done) => {
    testContainsText(done, 'Foo is bar');
  });

  it('should match last word in sentence', (done) => {
    testContainsText(done, 'Bar is foo');
  });

  it('should match middle word in sentence', (done) => {
    testContainsText(done, 'Bar foo baz');
  });

  it('should match partials', (done) => {
    testContainsText(done, 'Foobar');
  });

  it('should match in presence of non-alpha/special chars', (done) => {
    testContainsText(done, 'Foobar\n');
    testContainsText(done, 'Foobar||');
    testContainsText(done, ':Foo||');
  });
});
