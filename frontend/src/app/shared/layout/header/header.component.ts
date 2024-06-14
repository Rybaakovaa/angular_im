import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {debounceTime} from "rxjs";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // переменные для поиска
  products: ProductType[] = [];
  serverStaticPath: string = environment.serverStaticPath;
  showedSearch: boolean = false;
  searchField = new FormControl();

  count: number = 0;
  isLogged: boolean = false;
  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private loaderService: LoaderService,
              private productService: ProductService,
              private cartService: CartService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    // подписываемся на изменения в поиске
    this.searchField.valueChanges
      .pipe(
        // задержка для частых (быстрее 500мс) запросов
        debounceTime(500)
      )
      .subscribe(value => {
          // делаем запрос начиная с 2х символов
          if (value && value.length > 2) {
            this.productService.searchProducts(value)
              .subscribe((data: ProductType[]) => {
                this.products = data;
                this.showedSearch = true;
              });
          } else {
            this.products = [];
          }
      });


    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          // ...
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;
      });

    // подписываемся на измененеия кол-ва товаров в корзине после запросов
    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (data: DefaultResponseType) => {
        // if (data.error) {
        //   this._snackBar.open('Ошибка выхода из системы.');
        //   throw new  Error(data.message)
        // }
        this.doLogout();
      },
      error: (errorResponse: HttpErrorResponse) => {
        // if (errorResponse.error && errorResponse.error.message) {
        //   this._snackBar.open(errorResponse.error.message);
        // } else {
        //   this._snackBar.open('Ошибка выхода из системы.');
        // }
        this.doLogout();
      }
    })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы.');
    this.router.navigate(['/']);
  }


  // функционал для блока поиска
  // changedSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //
  //   // делаем запрос начиная с 2х символов
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //         this.showedSearch = true;
  //       });
  //   } else {
  //     this.products = [];
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/products/' + url]);
    // this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  }

  @HostListener('document: click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }
}
