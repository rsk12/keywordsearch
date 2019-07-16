import { Picture, Status } from './picture-model';
import { Allergen } from './allergen-model';

describe('Picture', () => {
  let picture: Picture;
  let status: Status;

  beforeEach(() => {
    picture = null;
  });

  describe('Status', () => {
    beforeEach(() => {
      status = null;
    });

    it('should be NotScanned if it has no scan date', () => {
      givenAnUnscannedPicture()
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should be NothingFound if scanned w/ no allergens', () => {
      givenScannedPicture();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NothingFound);
    });

    it('should be SomethingFound if scanned w/ allergens', () => {
      givenScannedPictureWithAllergens();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.SomethingFound);
    });

    function whenStatusIsChecked() {
      status = picture.status;
    }

    function thenStatusShouldBe(status: Status) {
      expect(status).toBe(status);
    }
  });

  function givenAnUnscannedPicture() {
    picture = Picture.from({ name: 'foo' });
  }

  function givenScannedPicture(): void {
    picture = Picture.from({
      name: 'foo',
      dateScanned: new Date(),
    });
  }

  function givenScannedPictureWithAllergens(): void {
    givenScannedPicture();
    picture.allergens = [Allergen.from({ name: 'bar' })];
  }
});
