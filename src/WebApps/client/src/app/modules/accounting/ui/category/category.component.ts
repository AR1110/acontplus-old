import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ModalService } from '@core/services/modal.service';
import { CategoryModalComponent } from '@accounting/ui/category/category-modal/category-modal.component';
import { Category } from '@accounting/core/domain/category';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { CategoryUseCase } from '@accounting/core/use-cases/category.use-case';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-category',
  imports: [
    BreadcrumbComponent,
    SecondaryStatusPipe,
    MatCardContent,
    MatCard,
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
  templateUrl: './category.component.html',
  styles: ``,
})
export class CategoryComponent {
  categories: Category[] = [];
  data: Category = {} as Category;
  private _categoryUseCase = inject(CategoryUseCase);
  private readonly modalService = inject(ModalService);

  edit(item: Category) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this._categoryUseCase.get({ tipo: 1 }).subscribe((response) => {
      if (response.code == '1') {
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
