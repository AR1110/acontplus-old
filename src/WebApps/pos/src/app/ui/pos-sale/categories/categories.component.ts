import { NgClass } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [NgClass],
})
export class CategoriesComponent implements OnInit {
  @Input() categories: CategoryItem[] = [];
  @Input() darkMode = false;
  @Output() categorySelected = new EventEmitter<CategoryItem>();

  constructor() {}

  ngOnInit(): void {
    if (
      this.categories.length &&
      !this.categories.some((cat) => cat.isActive)
    ) {
      this.categories[0].isActive = true;
    }
  }

  selectCategory(category: CategoryItem): void {
    if (category.isDisabled) {
      return;
    }

    // Deactivate all categories
    this.categories.forEach((cat) => (cat.isActive = false));

    // Activate the selected category
    category.isActive = true;

    // Emit the selected category
    this.categorySelected.emit(category);
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    // You could emit an event here if other components need to know about the theme change
  }
}
