import { Component, inject } from '@angular/core';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { ModalService } from '@core/services/modal.service';
import { Pagination } from '@shared/models/pagination.model';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { IngredientAddEditModalComponent } from '@restaurant/products/ingredient/ingredient-add-edit-modal/ingredient-add-edit-modal.component';

@Component({
    selector: 'app-ingredient-list',
    imports: [
        NgbPagination,
        ReactiveFormsModule,
        FormsModule,
        FaIconComponent,
        NgOptimizedImage,
    ],
    templateUrl: './ingredient-list.component.html',
    styles: ``
})
export class IngredientListComponent {
  ingredients: Ingredient[] = [];
  pagination = new Pagination();

  #ingredientService = inject(IngredientService);
  #modalService = inject(ModalService);

  loadData() {
    const obj = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      tipo: 1,
    };
    this.#ingredientService.get(obj).subscribe((response) => {
      this.ingredients = response.ingredients;
      this.pagination.totalRecords = this.ingredients[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onEdit(item: Ingredient) {
    const modalRef = this.#modalService.openModalCustom(
      IngredientAddEditModalComponent,
      {
        size: 'lg',
      },
    );
    modalRef.componentInstance.data = item;
    modalRef.result.then((result) => {
      if (typeof result === 'object' && result.code === '1') {
        this.loadData();
      }
    });
  }
}
