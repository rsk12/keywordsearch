import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product-page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    PipesModule,
  ],
})
export class ProductPageModule {}
