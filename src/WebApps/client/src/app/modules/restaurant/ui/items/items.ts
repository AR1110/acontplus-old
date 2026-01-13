import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ItemListUseCase } from '@restaurant/application/use-cases/item.use-case';
import { FormsModule } from '@angular/forms';
import {DataGrid, DataGridColumn, Pagination} from '@acontplus/ng-components';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Button } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { ItemAddEdit } from '@restaurant/ui/items/item-add-edit/item-add-edit';
import { finalize } from 'rxjs/operators';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/restaurant-const';
import { PaginationParams } from '@acontplus/core';
import { MatInput } from '@angular/material/input';
import { ValidatorUtils } from '@core/utils/utils';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {MatTooltip} from "@angular/material/tooltip";

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
    MatFormField,
    MatLabel,
    MatInput,
    MatTooltip,
  ],
  templateUrl: './items.html',
  styleUrl: './items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Items implements OnInit {
  private _listUseCase = inject(ItemListUseCase);
  private _dgSvc = inject(DialogService);

  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op'},
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
  pagination = signal(new Pagination());

  searchTerm = '';

  ngOnInit() {
    this.getList();
  }

  getList() {
    const params = new PaginationParams({
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      searchTerm: ValidatorUtils.isValidField(this.searchTerm) ?? undefined,
      filters: {
        categoryAbbreviations:
          this.categoryAbbreviationsSelected.length > 0
            ? this.categoryAbbreviationsSelected.toString()
            : null,
      },
    });

    this.isLoading.set(true);
    this._listUseCase
      .execute(params)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.list.set(response.items);
          this.pagination.update(
            (res) => new Pagination(res.pageIndex, res.pageSize, response.totalCount),
          );
        },
        error: (err) => {
          this.list.set([]);
          console.error('Error al cargar la lista:', err);
        },
      });
  }

  onEdit(rowData: any) {
    this._dgSvc.open(ItemAddEdit, {
      size: 'xl',
      data: {
        id: rowData.id,
        acronymCategory: rowData.acronymCategory,
      },
    }).subscribe(result=>{
      if(result && typeof result === 'object') this.getList()
    })
  }


  getNextPage(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.getList();
  }

  refresh() {
    this.getList();
  }
}
