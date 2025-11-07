import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { PageEvent } from '@angular/material/paginator';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ItemListUseCase } from '@restaurant/application/use-cases/item.use-case';
import { FormsModule } from '@angular/forms';
import { MatPagination } from '@shared/models/pagination.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Button } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { ItemAddEdit } from '@restaurant/ui/items/item-add-edit/item-add-edit';
import { finalize } from 'rxjs/operators';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/domain/enums/restaurant.enum';
import {PaginationParams} from "@acontplus/core";

@Component({
  selector: 'app-items',
  imports: [
    MatButtonToggleModule,
    DataGrid,
    BreadcrumbComponent,
    FormsModule,
    MatIconButton,
    MatIcon,
    Button,
  ],
  templateUrl: './items.html',
  styleUrl: './items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Items {
  private _listUseCase = inject(ItemListUseCase);
  private _dgSvc = inject(DialogService);

  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op' },
    { header: 'Nro.', field: 'index' },
    { header: 'Categoría', field: 'category' },
    { header: 'Imagen', field: 'imageUrl', type: 'image' },
    { header: 'Producto', field: 'productData', width: '300px' },
    { header: 'Título', field: 'title' },
    { header: 'Resumen', field: 'summary' },
    {
      header: 'Precio Costo',
      field: 'costPrice',
      type: 'number',
      typeParameter: {
        currencyCode: 'USD',
      },
    },
  ];

  categoryAbbreviationsSelected = [];
  categoryAbbreviations = signal([
    { code: CATEGORY_ABBREVIATIONS.RESTAURANT, name: 'Productos' },
    { code: CATEGORY_ABBREVIATIONS.COMBO, name: 'Menus' },
    { code: CATEGORY_ABBREVIATIONS.INGREDIENT, name: 'Ingredientes' },
  ]);

  list = signal<any[]>([]);
  isLoading = signal(false);
  pagination = signal(new MatPagination());

  params = new PaginationParams()

  ngOnInit() {
    this.getList();
  }

  getList() {
    console.log(this.params)

    const params = new PaginationParams({
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      filters: {
        categoryAbbreviations:
          this.categoryAbbreviationsSelected.length > 0
            ? this.categoryAbbreviationsSelected.toString()
            : null,
      }

    })

    this.isLoading.set(true);
    this._listUseCase
      .execute(params)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((response) => {
        console.log(response);
        this.list.set(response.items);
        this.pagination.update((res) => ({
          ...res,
          totalRecords: response.totalCount,
        }));
      });
  }

  onEdit(rowData: any) {
    this._dgSvc.open(ItemAddEdit, {
      size: 'xl',
      data: {
        id: rowData.id,
      },
    });
  }

  getNextPage(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.getList();
  }

  refresh() {
    this.getList();
  }
}
