import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {ProductCardComponent} from "./product-card.component";
import {CartService} from "../../services/cart.service";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FavoriteService} from "../../services/favorite.service";
import {Router} from "@angular/router";
import {of} from "rxjs";
import {ProductType} from "../../../../types/product.type";

describe('count-selector', () => {

  let productCardComponent: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  let product: ProductType;

  beforeEach(() => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['updateCount']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);
    const _snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', ['removeFavorite', 'addFavorite']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      providers: [
        {provide: CartService, useValue: cartServiceSpy},
        {provide: AuthService, useValue: authServiceSpy},
        {provide: MatSnackBar, useValue: _snackBarSpy},
        {provide: FavoriteService, useValue: favoriteServiceSpy},
        {provide: Router, useValue: routerSpy},
      ]
    });
    fixture = TestBed.createComponent(ProductCardComponent);
    productCardComponent = fixture.componentInstance;

    product = {
      id: 'test',
      name: 'test',
      price: 1,
      image: 'test',
      lightning: 'test',
      humidity: 'test',
      temperature: 'test',
      height: 1,
      diameter: 1,
      url: 'test',
      type: {
        id: 'test',
        name: 'test',
        url: 'test'
      },
    };
  });

  it('should have count init value', () => {
    expect(productCardComponent.count).toBeDefined();
  });

  it('should set value from input countInCart to count', () => {
    productCardComponent.count = 5;

    fixture.detectChanges();

    expect(productCardComponent.count).toBe(5);
  });

  // it('should call removeFromCart with count 0', () => {
  //   let cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  //   cartServiceSpy.updateCart.and.returnValue(of({
  //     items: [{
  //       product: {
  //         id: '1',
  //         name: '1',
  //         price: 1,
  //         image: '1',
  //         url: '1',
  //       },
  //       quantity: 1
  //     }]
  //   }));
  //
  //   productCardComponent.product = product;
  //   productCardComponent.removeFromCart();
  //
  //   expect(cartServiceSpy.updateCart).toHaveBeenCalledWith(product.id, 0);
  // });

  it('should hide product-cart-info and product-cart-extra if it light cart', () => {
    productCardComponent.isLight = true;
    productCardComponent.product = product;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const productCardInfo: HTMLElement | null = componentElement.querySelector('.product-card-info');
    const productCardExtra: HTMLElement | null = componentElement.querySelector('.product-card-extra');

    expect(productCardInfo).toBe(null);
    expect(productCardExtra).toBe(null);
  });

});
