import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
        this.categoriesWithTypes = data;

        // подписываемся на изменение query парамтеров
        this.activatedRoute.queryParams.subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          this.appliedFilters = [];
          this.activeParams.types.forEach(url => {
            for (let i = 0; i < this.categoriesWithTypes.length; i++) {
              const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url
                })
              }
            }
          });

          if (this.activeParams.heightFrom) {
            this.appliedFilters.push({
              name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
              urlParam: 'heightFrom'
            });
          }
          if (this.activeParams.heightTo) {
            this.appliedFilters.push({
              name: 'Высота: до ' + this.activeParams.heightTo + ' см',
              urlParam: 'heightTo'
            });
          }
          if (this.activeParams.diameterFrom) {
            this.appliedFilters.push({
              name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
              urlParam: 'diameterFrom'
            });
          }
          if (this.activeParams.diameterTo) {
            this.appliedFilters.push({
              name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
              urlParam: 'diameterTo'
            });
          }
        });

      });


    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.items;
      });


  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {

  }

}
