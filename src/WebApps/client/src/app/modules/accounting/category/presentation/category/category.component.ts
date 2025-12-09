import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CategoryModalComponent } from '@accounting/category/presentation/category-modal/category-modal.component';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { CategoryUseCase } from '@accounting/category/application/category.use-case';
import { Category } from '@accounting/category/domain/category';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-category',
  imports: [
    BreadcrumbComponent,
    SecondaryStatusPipe,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DynamicCard,
  ],
  templateUrl: './category.component.html',
  styles: ``,
})
export class CategoryComponent implements OnInit {
  categories = signal<Category[]>([]);
  data: Category = {} as Category;
  private _categoryUseCase = inject(CategoryUseCase);
  private readonly modalService = inject(DialogService);

  edit(item: Category) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this._categoryUseCase.get({ tipo: 1 }).subscribe((response) => {
      if (response.code == '1') {
        const { categories } = JSON.parse(response.payload as string);
        this.categories.set(categories);
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  onModalOpen() {
    const modalRef = this.modalService.open(CategoryModalComponent, {
      size: 'sm',
      data: this.data.id > 0 ? structuredClone(this.data) : {},
    });

    modalRef.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
      this.data = {} as Category;
    });
  }
}
