import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllergensPage } from './allergens';

@NgModule({
  declarations: [
    AllergensPage,
  ],
  imports: [
    IonicPageModule.forChild(AllergensPage),
  ],
})
export class AllergensPageModule {}
