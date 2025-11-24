import { Component, inject, signal, OnInit } from '@angular/core';
import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SubcategoryModalComponent } from '@accounting/sub-category/presentation/subcategory-modal/subcategory-modal.component';

import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DynamicCard, Pagination } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { SubCategoryUseCase } from '@accounting/sub-category/application/sub-category.use-case';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-subcategory',
  imports: [
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    MatDynamicTableComponent,
    DynamicCard,
  ],
  templateUrl: './subcategory.component.html',
  styles: ``,
})
export class SubcategoryComponent implements OnInit {
  data: Subcategory = {} as Subcategory;
  subcategories = signal<Subcategory[]>([]);
  private readonly modalService = inject(DialogService);

  private _subCategoryUseCase = inject(SubCategoryUseCase);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'categoryName', label: 'Categoría', type: 'string' },
    { key: 'code', label: 'Código', type: 'string' },
    { key: 'name', label: 'Nombre', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  refresh() {
    this.getAll();
  }
  edit(item: Subcategory) {
    this.data = item;
    this.onModalOpen();
  }

  private getAll() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this._subCategoryUseCase.getAll(params).subscribe((response) => {
      this.subcategories.set(response);
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  onModalOpen() {
    const modalRef = this.modalService.open(SubcategoryModalComponent, {
      size: 'sm',
      data: this.data.id > 0 ? structuredClone(this.data) : {},
    });
    modalRef.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.refresh();
      }
      this.data = {} as Subcategory;
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
