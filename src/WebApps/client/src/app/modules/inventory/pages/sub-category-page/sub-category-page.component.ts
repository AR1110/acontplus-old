import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { InventoryModule } from '@modules/inventory/inventory.module';

import { hideLoader, showLoader } from '@core/utils/loader';
import { SubCategoryRead } from '@modules/inventory/models/sub-category.model';
import { SubCategoryService } from '@modules/inventory/services/sub-category.service';

@Component({
  selector: 'app-subcategory-page',
  standalone: true,
  imports: [AppModule, InventoryModule],
  templateUrl: './sub-category-page.component.html',
  styles: ``
})
export class SubCategoryPageComponent {

  private subcategorySvc = inject(SubCategoryService)
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    totalRecords: 0
  }
  recordsQuantity = [25, 50, 100]

  subcategories: Array<SubCategoryRead> = [];

  getSubcategories() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    showLoader();
    this.subcategorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.subcategories = categories;
        this.dataSearch.totalRecords = this.subcategories.length > 0 ? this.subcategories[0].totalRecords : 0
      },
      error(err) {
        console.log(err)
      },
      complete() {
        hideLoader();
      },
    })
  }

  ngOnInit(){
    this.getSubcategories()
  }

  pageChanged(): void {
    this.getSubcategories();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getSubcategories();
  }

}
