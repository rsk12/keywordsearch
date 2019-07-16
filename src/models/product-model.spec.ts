import { Product } from './product-model';
import { Allergen } from './allergen-model';
import { Picture, Status } from './picture-model';
import { Stats } from 'fs';

describe('Product', () => {
  let product: Product;
  let picture: Picture;

  beforeEach(() => {
    product = null;
    picture = null;
  });

  describe('Pictures', () => {
    it('should allow pictures to be added', () => {
      givenAProductWithoutPictures();
      whenAPictureIsAdded();
      theProductShouldHaveAPicture();
      andProductThumbnailShouldBeLastPicture();
    });

    function whenAPictureIsAdded() {
      picture = makePicture(Status.SomethingFound);
      product.addPicture(picture);
    }

    function theProductShouldHaveAPicture() {
      expect(product.hasPictures()).toBeTruthy();
    }

    function andProductThumbnailShouldBeLastPicture() {
      expect(product.thumbnail()).toBe(picture.toData());
    }
  });

  describe('Status (Transient)', () => {
    let status: Status;

    beforeEach(() => {
      status = null;
    });

    it('should be unscanned if no pictures', () => {
      givenAProductWithoutPictures();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should have the highest status of its pictures 1', () => {
      givenAProductWithUnscannedPicture();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should have the highest status of its pictures 2', () => {
      givenAProductWithPicturesOfStatus(Status.NotScanned, Status.NothingFound);
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NothingFound);
    });

    it('should have the highest status of its pictures 3', () => {
      givenAProductWithPicturesOfStatus(Status.NotScanned, Status.NothingFound, Status.SomethingFound);
      whenStatusIsChecked();
      thenStatusShouldBe(Status.SomethingFound);
    });

    function givenAProductWithPicturesOfStatus(...args) {
      const pictures = args.map(stat => makePicture(stat));

      makeProduct(pictures);
    }

    function whenStatusIsChecked() {
      status = product.status;
    }

    function thenStatusShouldBe(status: Status) {
      expect(status).toBe(status);
    }
  });

  describe('Date Scanned (Transient)', () => {
    let dateScanned: Date;

    beforeEach(() => {
      dateScanned = null;
    });

    it('should have no dateScanned if it has no pics', () => {
      givenAProductWithoutPictures();
      whenDateScannedIsChecked();
      thenDateScannedIs(null);
    });

    it('should have no dateScanned if its only pic is unscanned', () => {
      givenAProductWithUnscannedPicture();
      whenDateScannedIsChecked();
      thenDateScannedIs(null);
    });

    it('should have dateScanned of its only scanned pic', () => {
      const date1 = new Date();

      givenAProductWithPicturesScannedOn(date1);
      whenDateScannedIsChecked();
      thenDateScannedIs(date1);
    });

    it('should have highest dateScanned of pics', () => {
      const date1 = new Date();
      const date2 = new Date();

      givenAProductWithPicturesScannedOn(date1, date2);
      whenDateScannedIsChecked();
      thenDateScannedIs(date2);
    });

    function givenAProductWithPicturesScannedOn(...args) {
      const pictures = args.map(date => makePicture(Status.NothingFound, date));

      makeProduct(pictures);
    }

    function whenDateScannedIsChecked() {
      dateScanned = product.dateScanned;
    }

    function thenDateScannedIs(expectedDate: Date) {
      expect(expectedDate).toBe(dateScanned);
    }
  });

  describe('Allergens', () => {
    let containsAllergens: boolean;

    beforeEach(() => {
      containsAllergens = null;
    });

    it('should say it contains allergens if it has a picture with allergens', () => {
      givenScannedProductWithAllergens();
      whenContainsAllergensIsChecked();
      thenAnswerIs(true);
    });

    it('should not say it contains allergens if it has a picture without allergens', () => {
      givenAProductWithUnscannedPicture();
      whenContainsAllergensIsChecked();
      thenAnswerIs(false);
    });

    function whenContainsAllergensIsChecked() {
      containsAllergens = product.containsAllergens();
    }

    function thenAnswerIs(result: boolean) {
      expect(containsAllergens).toBe(result);
    }
  });

  describe('Matching', () => {
    let isAllergenMatch: boolean;

    it('should flag word as match', () => {
      givenScannedProductWithAllergens();
      whenWordIsChecked('bar');
      thenMatchIsFound();
    });

    it('should flag word as match insenitive', () => {
      givenScannedProductWithAllergens();
      whenWordIsChecked('Bar');
      thenMatchIsFound();
    });

    function whenWordIsChecked(word: string) {
      isAllergenMatch = product.isAllergenMatch(word);
    }

    function thenMatchIsFound() {
      expect(isAllergenMatch).toBeTruthy();
    }
  });

  function givenAProductWithoutPictures() {
    makeProduct([]);
  }

  function givenScannedProductWithAllergens(): void {
    const picture  = Picture.from({
      name: 'nikon',
      allergens: [Allergen.from({ name: 'bar' })]
    });

    makeProduct([picture]);
  }

  function givenAProductWithUnscannedPicture() {
    makeProduct([makePicture(Status.NotScanned)]);
  }

  function makeProduct(pictures) {
    product = Product.from({
      name: 'foo',
      pictures
    });
  }

  function makePicture(_status: Status, date?: Date) {
    return Picture.from({
      name: _status,
      status: _status,
      dateScanned: date ? date : null
    });
  }
});
