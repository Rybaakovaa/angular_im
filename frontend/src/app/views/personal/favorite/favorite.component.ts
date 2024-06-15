import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    // получаем избраные товары
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.favoriteProducts = (data as FavoriteType[]);

        // запрос актуальной корзины пользователя
        this.cartService.getCart()
          .subscribe((data: CartType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              // ...
              throw new Error((data as DefaultResponseType).message);
            }
            const cart = data as CartType;

            // обновляем кол-во товара в FavoriteType
            this.favoriteProducts = this.favoriteProducts.map(favoriteProduct => {
              const cartItem = cart.items.find(item => item.product.id === favoriteProduct.id);
              if (cartItem) {
                favoriteProduct.count = cartItem.quantity;
              }
              return favoriteProduct;
            });
          });
      });
  }

  removeFromFavorite(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          // ...
          throw new Error(data.message);
        }
        this.favoriteProducts = this.favoriteProducts.filter(item => item.id !== id);
      });
  }

  addToCart(product: FavoriteType) {
    let countAdd = (product.count && product.count > 0) ? product.count : 1;

    // console.log("add to cart: ", this.count)
    this.cartService.updateCart(product.id, countAdd)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        // обновляем актуальное кол-во товаров в корзине
        this.favoriteProducts.map(favoriteProduct => {
          if (favoriteProduct.id === product.id) {
            favoriteProduct.count = countAdd;
          }
          return favoriteProduct;
        });
      });
  }

  updateCount(product: FavoriteType, value: number) {
    this.cartService.updateCart(product.id, value)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        product.count = value;
      });
  }
}
