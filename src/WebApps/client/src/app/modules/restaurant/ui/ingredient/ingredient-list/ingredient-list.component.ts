import { Component, inject, signal, OnInit } from '@angular/core';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { MatPagination } from '@shared/models/pagination.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngredientAddEditModalComponent } from '@restaurant/ui/ingredient/ingredient-add-edit-modal/ingredient-add-edit-modal.component';

import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PageEvent } from '@angular/material/paginator';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-ingredient-list',
  imports: [ReactiveFormsModule, FormsModule, ThemeButtonComponent, MatDynamicTableComponent],
  templateUrl: './ingredient-list.component.html',
  styles: ``,
})
export class IngredientListComponent implements OnInit {
  #ingredientService = inject(IngredientService);
  #modalService = inject(DialogService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 's3ObjectUrl', label: 'Ingrediente', type: 'image' },
    { key: 'summary', label: 'Resumen', type: 'string' },
    { key: 'quantity', label: 'cantidad', type: 'string' },
    { key: 'unit', label: 'Unidad', type: 'string' },
    { key: 'content', label: 'Contenido', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  pagination = signal(new MatPagination());

  dataSource = signal<Ingredient[]>([]);

  loadData() {
    const obj = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      tipo: 1,
    };
    this.#ingredientService.get(obj).subscribe((response) => {
      this.dataSource.set(
        (response.ingredients || []).map((item: any, index: number) => ({
          ...item,
          index: index + 1,
        })),
      );

      this.pagination.update((e) => {
        return {
          ...e,
          totalRecords: this.dataSource().length > 0 ? this.dataSource()[0].totalRecords : 0,
        };
      });
    });
  }

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  onEdit(item: Ingredient) {
    const modalRef = this.#modalService.open(IngredientAddEditModalComponent, {
      size: 'lg',
      data: structuredClone(item),
    });
    modalRef.subscribe((result) => {
      if (typeof result === 'object' && result.code === '1') {
        this.loadData();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }
}
