import { Page } from './app.page';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a title saying Allergens', () => {
      page.getTitle().then(title => {
        expect(title).toEqual('Allergenify');
      });
    });
  })
});
