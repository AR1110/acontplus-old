import { Component, inject, signal, OnInit } from '@angular/core';
import { Subcategory } from '@accounting/data/models/subcategory';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SubcategoryModalComponent } from '@accounting/ui/subcategory-page/subcategory-modal/subcategory-modal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataGrid, DataGridColumn, Pagination, Button } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { SUB_CATEGORY_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-subcategory-page',
  imports: [MatButtonModule, MatIconModule, BreadcrumbComponent, DataGrid, Button],
  templateUrl: './subcategory-page.html',
  styles: ``,
})
export class SubcategoryPage implements OnInit {
  data: Subcategory = {} as Subcategory;
  subcategories = signal<Subcategory[]>([]);
  private readonly modalService = inject(DialogService);

  private _subCategoryHttp = inject(SUB_CATEGORY_HTTP_TOKEN);

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'index', header: 'Nro.' },
    { field: 'categoryName', header: 'Categoría' },
    { field: 'code', header: 'Código' },
    { field: 'name', header: 'Nombre' },
    { field: 'nomEstado', header: 'Estado' },
  ];

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
    this._subCategoryHttp.getAll(params).subscribe((response) => {
      this.subcategories.set(response as Subcategory[]);
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
