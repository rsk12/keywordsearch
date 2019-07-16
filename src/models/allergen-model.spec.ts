import { Allergen } from "./allergen-model";

describe('Allergen', () => {
  let allergen: Allergen;
  let isMatch: boolean;

  beforeEach(() => {
    allergen = Allergen.from({ name: 'Sunflower' });
  });

  it('should flag word as match', () => {
    whenWordIsChecked('Sunflower');
    thenMatchIsFound();
  });

  it('should flag word as match insensitive', () => {
    whenWordIsChecked('SUNFLOWER');
    thenMatchIsFound();
  });

  it('should flag word substring as match', () => {
    whenWordIsChecked('Sunflowerseed');
    thenMatchIsFound();
  });

  function whenWordIsChecked(word: string) {
    isMatch = allergen.matches(word);
  }

  function thenMatchIsFound() {
    expect(isMatch).toBeTruthy();
  }
});
