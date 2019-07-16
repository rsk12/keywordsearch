import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'AllergensPage';
  tab2Root = 'ProductsPage';
  tab3Root = ContactPage;

  constructor() {

  }
}
