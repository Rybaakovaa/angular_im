import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import { ProductCardComponent } from './components/product-card/product-card.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PasswordRepeatDirective,
    ProductCardComponent
  ]
})
export class SharedModule { }
