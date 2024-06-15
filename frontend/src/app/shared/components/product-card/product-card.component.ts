import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FavoriteService} from "../../services/favorite.service";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0; // всегда будет число!

  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;
  isLoggedIn: boolean = this.authService.getIsLoggedIn();

  constructor(private cartService: CartService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,
              private router: Router
              ) { }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }

  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            // ...
            throw new Error((data as DefaultResponseType).message);
          }
          this.countInCart = this.count;
        });
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = this.count;
      });
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = 0;
        this.count = 1;
      });
  }


  updateFavorite() {
    // запрос только для авторизированных пользователей
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавление в избраное необходимо авторизоваться.');
      return;
    }

    if (this.product.isInFavorite) {
      // удаляем из избраного
      this.favoriteService.removeFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            // ...
            throw new Error(data.message);
          }
          this.product.isInFavorite = false;
        });
    } else {
      // добавляем в избраное
      this.favoriteService.addFavorite(this.product.id)
        .subscribe((data: FavoriteType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            // ...
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.isInFavorite = true;
        });
    }
  }

  // карточка товара в облегченной версии переводит на страницу товара
  navigate() {
    if (this.isLight) {
      this.router.navigate(['/products/' +  this.product.url]);
    }
  }

}
