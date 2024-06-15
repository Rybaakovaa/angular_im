import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  count: number = 1; // переменная связи с дочерним компонентом

  recommendedProducts: ProductType[] = [];
  product!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;

  isLoggedIn: boolean = this.authService.getIsLoggedIn();


  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    // подписываемся на !params! т к 'products/:url'
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product = data;

          // получение кол-ва добавленных продуктов в корзину
          this.cartService.getCart()
            .subscribe((cartData: CartType | DefaultResponseType) => {
              if ((cartData as DefaultResponseType).error) {
                // ...
                throw new Error((cartData as DefaultResponseType).message);
              }
              if (cartData as CartType) {
                const productInCart = (cartData as CartType).items.find(item => item.product.id === this.product.id);
                if (productInCart) {
                  this.product.countInCart = productInCart.quantity;
                  this.count = this.product.countInCart;
                }
              }
            });

          // получение избранных товаров

          if (this.authService.getIsLoggedIn()) {
            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                const products = data as FavoriteType[];
                const curProductExists = products.find(item => item.id == this.product.id);
                if (curProductExists) {
                  this.product.isInFavorite = true;
                }
              });
          }
        });
    });

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      });
  }


  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            // ...
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.countInCart = this.count;
        });
    }
  }


  addToCart() {
    console.log("add to cart: ", this.count)
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = this.count;
      });
  }


  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = 0;
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
}
