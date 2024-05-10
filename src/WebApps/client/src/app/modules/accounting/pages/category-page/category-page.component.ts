import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { CategoryModalComponent } from '@modules/accounting/pages/category-page/category-modal/category-modal.component';
import { Category } from '@modules/accounting/models/category';
import { CategoryService } from '@modules/accounting/services/category.service';
import { isApiResponse } from '@core/models/api-response';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SecondaryStatusPipe } from '@shared/pipe/secondary-status.pipe';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FontAwesomeModule,
    NgbDropdownModule,
    SecondaryStatusPipe,
  ],
  templateUrl: './category-page.component.html',
  styles: ``,
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
}
