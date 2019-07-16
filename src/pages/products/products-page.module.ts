import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products-page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsPage),
    PipesModule,
  ],
})
export class ProductsPageModule {}
