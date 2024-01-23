import { Component, inject } from '@angular/core';
import { hideLoader, showLoader } from '@core/utils/loader';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { CategoryRead } from '@modules/inventory/models/category.model';
import { CategoryService } from '@modules/inventory/services/category.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [AppModule, InventoryModule],
  templateUrl: './category-page.component.html',
  styles: ``
})
export class CategoryPageComponent {
  private categorySvc = inject(CategoryService)

  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    totalRecords: 0
  }
  recordsQuantity = [25, 50, 100]

  categories: Array<CategoryRead> = [];

  getCatgories() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    showLoader();
    this.categorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.dataSearch.totalRecords = this.categories.length > 0 ? this.categories[0].totalRecords : 0
      },
      error(err) {
        console.log(err)
      },
      complete() {
        hideLoader();
      },
    })
  }

  ngOnInit() {
    this.getCatgories()
  }

  pageChanged(): void {
    this.getCatgories();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getCatgories();
  }

}
