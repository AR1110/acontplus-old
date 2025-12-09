import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CategoryRead } from '@inventory/domain/models/category.model';
import { CategoryService } from '@inventory/data/services/category.service';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-category',
  imports: [FormsModule, BreadcrumbComponent, PrimaryStatusPipe, DynamicCard],
  templateUrl: './category-page.component.html',
  styles: ``,
})
export class CategoryPageComponent implements OnInit {
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    totalRecords: 0,
  };
  recordsQuantity = [25, 50, 100];
  categories: CategoryRead[] = [];
  private categorySvc = inject(CategoryService);

  getCatgories() {
    const params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
    };

    this.categorySvc.getAll(params).subscribe((categories) => {
      this.categories = categories;
      this.dataSearch.totalRecords =
        this.categories.length > 0 ? this.categories[0].totalRecords : 0;
    });
  }

  ngOnInit() {
    this.getCatgories();
  }

  pageChanged(): void {
    this.getCatgories();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getCatgories();
  }
}
