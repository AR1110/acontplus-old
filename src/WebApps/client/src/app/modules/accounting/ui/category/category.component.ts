import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { CategoryModalComponent } from '@accounting/ui/category/category-modal/category-modal.component';
import { Category } from '@accounting/core/domain/category';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import {CategoryUsecase} from "@accounting/core/usecases/category.usecase";

@Component({
    selector: 'app-category',
    imports: [
        BreadcrumbComponent,
        FontAwesomeModule,
        NgbDropdownModule,
        SecondaryStatusPipe,
    ],
    templateUrl: './category.component.html',
    styles: ``
})
export class CategoryComponent {
  categories: Category[] = [];
  data: Category = {} as Category;
  private _categoryUseCase = inject(CategoryUsecase)
  private readonly modalService = inject(ModalService);

  edit(item: Category) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this._categoryUseCase.get({ tipo: 1 }).subscribe((response) => {
      if ( response.code == '1') {
        const { categories } = JSON.parse(response.payload as string);
        this.categories = categories;
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  onModalOpen() {
    const modalRef = this.modalService.open(CategoryModalComponent, {
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
