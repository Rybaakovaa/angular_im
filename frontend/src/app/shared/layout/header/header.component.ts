import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {visitAll} from "@angular/compiler";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  @Input() categories: CategoryType[] = [];

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
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

}
