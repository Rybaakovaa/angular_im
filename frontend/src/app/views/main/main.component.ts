import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {ProductType} from "../../../types/product.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  products: ProductType[] = [];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.products = data;
      })
  }

}
