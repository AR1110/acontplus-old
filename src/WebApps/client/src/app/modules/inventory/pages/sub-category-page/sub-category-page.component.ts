import { Component, inject } from '@angular/core';

import { hideLoader, showLoader } from '@core/utils/loader';
import { SubCategoryRead } from '@modules/inventory/models/sub-category.model';
import { SubCategoryService } from '@modules/inventory/services/sub-category.service';
import { ModalService } from '@core/services/modal.service';
import {SubCategoryModalDirective} from '@inventory/directives/sub-category.directive'
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subcategory-page',
  standalone: true,
  imports: [
    NgbPagination,
    FontAwesomeModule,
    FormsModule,
    BreadcrumbComponent,
    SubCategoryModalDirective,
    PrimaryStatusPipe
  ],
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
}
