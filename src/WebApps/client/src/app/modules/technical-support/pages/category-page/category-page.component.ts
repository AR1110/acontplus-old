import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { Category } from '@modules/technical-support/models/category';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-category',
  imports: [BreadcrumbComponent, MatCard, MatCardContent, MatButton, MatIcon],
  templateUrl: './category-page.component.html',
  styles: ``,
})
export class CategoryPageComponent {
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);
  categories: Category[] = [];
  categorySelected: Category = {
    id: 0,
    code: '',
    name: '',
  };
  ngOnInit(): void {
    this.onGet();
  }
  onEdit(item: Category) {
    this.categorySelected = item;
    this.onModalOpen();
  }
  onGet() {
    this.categoryService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (isApiResponse(response) && response.code == '1') {
          this.categories = JSON.parse(response.payload as string);
        }
      },
      error(err) {
        console.error(err);
      },
      complete() {},
    });
  }
  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(CategoryModalComponent, {
      size: 'sm',
      centered: true,
    });
    if (this.categorySelected.id > 0) {
      modalRef.componentInstance.data = this.categorySelected;
    }
    modalRef.result.then((response) => {
      if (this.categorySelected.id > 0) {
        this.categorySelected = {} as Category;
      }
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }
}
