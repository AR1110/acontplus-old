import {Component, inject, signal} from '@angular/core';
import { Subcategory } from '@accounting/core/domain/subcategory';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ModalService } from '@core/services/modal.service';
import { SubcategoryModalComponent } from '@accounting/ui/subcategory-page/subcategory-modal/subcategory-modal.component';

import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatPagination} from "@shared/models/pagination.model";
import {PageEvent} from "@angular/material/paginator";
import {SubCategoryUsecase} from "@accounting/core/usecases/sub-category.usecase";

@Component({
  selector: 'app-subcategory-page',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    MatDynamicTableComponent
  ],
  templateUrl: './subcategory-page.component.html',
  styles: ``,
})
export class SubcategoryPageComponent {
  data: Subcategory = {} as Subcategory;
  subcategories: Subcategory[] = [];
  private readonly modalService = inject(ModalService);

  private _subCategoryUseCase = inject(SubCategoryUsecase)


  columnsDefs: ColumnDefinition[] = [

    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'categoryName', label: 'Categoría', type: 'string' },
    { key: 'code', label: 'Código', type: 'string' },
    { key: 'name', label: 'Nombre', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  refresh(){
 this.getAll()
  }
  edit(item: Subcategory) {
    this.data = item;
    this.onModalOpen();
  }

  private  getAll(){
    this._subCategoryUseCase.getAll({}).subscribe((response) => {
      this.subcategories = response
    })
  }

  ngOnInit(): void {
    this.getAll();
  }

  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(
      SubcategoryModalComponent,
      { size: 'sm', centered: true },
    );
    if (this.data.id > 0) {
      modalRef.componentInstance.data = this.data;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.refresh();
      }
      this.data = {} as Subcategory;
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
