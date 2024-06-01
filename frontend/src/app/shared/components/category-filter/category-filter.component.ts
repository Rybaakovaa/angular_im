import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent {

  @Input() categoryWithTypes: CategoryWithTypeType | null = null;
  @Input() type: string | null = null;

  open = false;
  activeParams: ActiveParamsType = {types: []};

  get title(): string {
    if (this.categoryWithTypes) {
      return this.categoryWithTypes.name;
    }
    if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      }
      if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }
    return '';
  }

  constructor(private router: Router) { }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);
      if (existingTypeInParams && !checked) {
        // удаляем элемент из параметров
        this.activeParams.types = this.activeParams.types.filter(item => item === url);
      } else if (!existingTypeInParams && checked) {
        // добавляем в параметры
        this.activeParams.types.push(url);
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }



    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

}
