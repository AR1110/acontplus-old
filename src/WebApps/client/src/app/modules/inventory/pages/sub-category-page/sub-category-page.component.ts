import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { InventoryModule } from '@modules/inventory/inventory.module';

import { hideLoader, showLoader } from '@core/utils/loader';
import { SubCategoryRead } from '@modules/inventory/models/sub-category.model';
import { SubCategoryService } from '@modules/inventory/services/sub-category.service';
import { ModalService } from '@core/services/modal.service';
import { SubCategoryModalComponent } from './sub-category-modal/sub-category-modal.component';

@Component({
  selector: 'app-subcategory-page',
  standalone: true,
  imports: [AppModule, InventoryModule],
  templateUrl: './sub-category-page.component.html',
  
})
export class SubCategoryPageComponent {

  private subCategorySvc = inject(SubCategoryService);
  private modalSvc = inject(ModalService)
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
    this.subCategorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.subcategories = categories;
        this.dataSearch.totalRecords = this.subcategories.length > 0 ? this.subcategories[0].totalRecords : 0
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
      complete() {
        hideLoader();
      },
    })
  }

  ngOnInit() {
    this.getSubcategories()
  }

  pageChanged(): void {
    this.getSubcategories();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getSubcategories();
  }

  openModalAddEdit<T>(data?: T) {
    const modalRef = this.modalSvc.openModalCustom(SubCategoryModalComponent)
    modalRef.result.then(result => {
      if (typeof result === 'object') {
        console.log('this')
      }
    })
  }
}
