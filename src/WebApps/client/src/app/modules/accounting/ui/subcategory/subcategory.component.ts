import {Component, inject, signal} from '@angular/core';
import { Subcategory } from '@accounting/domain/models/subcategory';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SubcategoryModalComponent } from '@accounting/ui/subcategory/subcategory-modal/subcategory-modal.component';

import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatPagination} from "@shared/models/pagination.model";
import {PageEvent} from "@angular/material/paginator";
import {SubCategoryUseCase} from "@accounting/domain/use-cases/sub-category.use-case";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {DialogService} from "@core/services/dialog.service";

@Component({
  selector: 'app-subcategory',
  imports: [
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    MatDynamicTableComponent,
    MatDynamicCardComponent
  ],
  templateUrl: './subcategory.component.html',
  styles: ``,
})
export class SubcategoryComponent {
  data: Subcategory = {} as Subcategory;
  subcategories: Subcategory[] = [];
  private readonly modalService = inject(DialogService);

  private _subCategoryUseCase = inject(SubCategoryUseCase)


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
    const modalRef = this.modalService.open(
      SubcategoryModalComponent,
      { size: 'sm',
        data: this.data.id > 0 ? structuredClone(this.data) : {},
      },
    );
    modalRef.subscribe((response) => {
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
