import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() isLight: boolean = false;

  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;
  isInCart: boolean = false; // флаг, чьл продукт уже добавлен в корзину

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {

  }

  updateCount(value: number) {
    this.count = value;
    if (this.isInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.isInCart = true;
        });
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.isInCart = true;
      });
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.isInCart = false;
        this.count = 1;
      });
  }



}
