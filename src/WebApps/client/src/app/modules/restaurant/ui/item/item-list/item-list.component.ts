import { Component, inject, signal } from '@angular/core';
import { Item } from '@restaurant/domain/models/item.model';
import { ItemService } from '@restaurant/data/services/item.service';
import { MatPagination,  } from '@shared/models/pagination.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@core/services/modal.service';
import { ItemAddEditModalComponent } from '@restaurant/ui/item/item-add-edit-modal/item-add-edit-modal.component';
import { imgDefault, isValidField } from '@core/utils/utils';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
    selector: 'app-item-list',
  imports: [
    FaIconComponent,
    FormsModule,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    MatCard,
    MatCardContent
  ],
    templateUrl: './item-list.component.html',
    styles: ``
})
export class ItemListComponent {
  items: Item[] = [];
  pagination = signal(new MatPagination());
  #itemService = inject(ItemService);
  #modalService = inject(ModalService);


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'categoria', label: 'Categoría', type: 'string' },
    { key: 'img', label: 'Imagen', type: 'image' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'summary', label: 'Resumen', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>();

  isLoadingResults = signal(false)

  loadData() {
    const obj = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      tipo: 1,
      textSearch: isValidField(this.dataSearch.textSearch)
    };
    this.#itemService.get(obj).subscribe((response) => {
      let items = response.items.map((item:any, index:number)=>{

        return {
          index: index + 1,
          ...item,
          img: isValidField(item.s3ObjectUrl) || imgDefault()
        }
      })
      this.dataSource = new MatTableDataSource(items);
      this.pagination().totalRecords = this.dataSource.data[0]?.totalRecords ?? 0;
    });
  }

  dataSearch = {
    textSearch: null as string | null
  }

  ngOnInit() {
    this.loadData();
  }

  refresh(){
    this.loadData()
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
  onEdit(item: Item) {
    const modalRef = this.#modalService.openModalCustom(
      ItemAddEditModalComponent,
      {
        size: 'xl',
        centered: true,
      },
    );
    modalRef.componentInstance.data = item;
    modalRef.result.then((response) => {
      if (typeof response === 'object' && response.code === '1') {
        this.loadData();
      }
    });
  }
}
