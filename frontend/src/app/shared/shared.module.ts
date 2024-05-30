import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import { ProductCardComponent } from './components/product-card/product-card.component';



@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PasswordRepeatDirective
  ]
})
export class SharedModule { }
