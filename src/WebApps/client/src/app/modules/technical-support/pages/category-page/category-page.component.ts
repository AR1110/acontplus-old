import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Category } from '@modules/technical-support/models/category';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-category',
  imports: [BreadcrumbComponent, MatButton, MatIcon, Button, DynamicCard],
  templateUrl: './category-page.component.html',
  styles: ``,
})
export class CategoryPageComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private modalService = inject(DialogService);
  categories = signal<Category[]>([]);
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
    this.categoryService.get({ tipo: 1 }).subscribe((response) => {
      if (response.code == '1') {
        this.categories.set(JSON.parse(response.payload as string));
      }
    });
  }
  onModalOpen() {
    const modalRef = this.modalService.open(CategoryModalComponent, {
      size: 'sm',
      data: this.categorySelected.id > 0 ? structuredClone(this.categorySelected) : {},
    });

    modalRef.subscribe((response) => {
      if (this.categorySelected.id > 0) {
        this.categorySelected = {} as Category;
      }
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }

  onDelete(item: Category) {}
}
