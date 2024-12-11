import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { CategoryModalComponent } from '@accounting/ui/category-page/category-modal/category-modal.component';
import { Category } from '@accounting/core/domain/category';
import { CategoryService } from '@accounting/services/category.service';
import { isApiResponse } from '@core/models/api-response';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { CompanyCustomerAddEditDirective } from '@company-customer/company-customer-add-edit.directive';

@Component({
    selector: 'app-category-page',
    imports: [
        BreadcrumbComponent,
        FontAwesomeModule,
        NgbDropdownModule,
        SecondaryStatusPipe,
        CompanyCustomerAddEditDirective,
    ],
    templateUrl: './category-page.component.html',
    styles: ``
})
export class CategoryPageComponent {
  categories: Category[] = [];
  data: Category = {} as Category;
  private readonly categoryService = inject(CategoryService);
  private readonly modalService = inject(ModalService);

  edit(item: Category) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this.categoryService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { categories } = JSON.parse(response.payload as string);
        this.categories = categories;
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(CategoryModalComponent, {
      size: 'sm',
      centered: true,
    });
    if (this.data.id > 0) {
      modalRef.componentInstance.data = this.data;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
      this.data = {} as Category;
    });
  }

  onResultModal() {}
}
