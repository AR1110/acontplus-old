import {imgDefault, truncateText} from './../../../domain/utils/utils';
import { NgClass } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// interface any {
//   id: string;
//   name: string;
//   imageUrl: string;
//   isActive?: boolean;
//   isDisabled?: boolean;
// }

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [NgClass],
})
export class CategoriesComponent implements OnInit {
  @Input() categories: any[] = [];
  @Output() categorySelected = new EventEmitter<any>();
  imgDefault = imgDefault;

  truncateText = truncateText;
  constructor() {}

  ngOnInit(): void {
    if (
      this.categories.length &&
      !this.categories.some((cat) => cat.isActive)
    ) {
      this.categories[0].isActive = true;
    }
  }

  selectCategory(category: any, $index: number): void {
    if (category.isDisabled) {
      return;
    }

    // Deactivate all categories
    this.categories.forEach((cat) => (cat.isActive = false));

    // Activate the selected category
    category.isActive = true;

    // Emit the selected category
    this.categorySelected.emit({ index: $index, item: category });
  }
}
