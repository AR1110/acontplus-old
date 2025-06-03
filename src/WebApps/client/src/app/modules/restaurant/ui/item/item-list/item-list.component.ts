import { Component, inject, signal } from '@angular/core';
import { Item } from '@restaurant/domain/models/item.model';
import { ItemService } from '@restaurant/data/services/item.service';
import { MatPagination } from '@shared/models/pagination.model';
import { FormsModule } from '@angular/forms';
import { ItemAddEditModalComponent } from '@restaurant/ui/item/item-add-edit-modal/item-add-edit-modal.component';
import { imgDefault, isValidField } from '@core/utils/utils';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PageEvent } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {DialogService} from "@core/services/dialog.service";

@Component({
  selector: 'app-item-list',
    imports: [
        FormsModule,
        MatDynamicTableComponent,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
        ThemeButtonComponent,
    ],
  templateUrl: './item-list.component.html',
  styles: ``,
})
export class ItemListComponent {
  pagination = signal(new MatPagination());
  #itemService = inject(ItemService);
  #modalService = inject(DialogService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'categoria', label: 'Categoría', type: 'string' },
    { key: 'img', label: 'Imagen', type: 'image' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'summary', label: 'Resumen', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = signal<any>([])

  isLoadingResults = signal(false);

  loadData() {
    const obj = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      tipo: 1,
      textSearch: isValidField(this.dataSearch.textSearch),
    };
    this.#itemService.get(obj).subscribe((response) => {
      const items = response.items.map((item: any, index: number) => {
        return {
          index: index + 1,
          ...item,
          img: isValidField(item.s3ObjectUrl) || imgDefault(),
        };
      });
      this.dataSource.set(items);
      this.pagination().totalRecords =  this.dataSource()[0]?.totalRecords ?? 0;
    });
  }

  dataSearch = {
    textSearch: null as string | null,
  };

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
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
    const modalRef = this.#modalService.open(
      ItemAddEditModalComponent,
      {
        size: 'xl',
        data: structuredClone(item),
      },
    );
    modalRef.subscribe((response) => {
      if (typeof response === 'object' && response.code === '1') {
        this.loadData();
      }
    });
  }
}
