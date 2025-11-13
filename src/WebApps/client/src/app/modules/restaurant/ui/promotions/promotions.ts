import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {DataGrid} from "@shared/components/data-grid/data-grid";
import {MatIconButton} from "@angular/material/button";
import {MatInput, MatLabel} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {ItemListUseCase} from "@restaurant/application/use-cases/item.use-case";
import {DialogService} from "@core/services/dialog.service";
import {DataGridColumn} from "@shared/components/data-grid/types";
import {CATEGORY_ABBREVIATIONS} from "@restaurant/domain/enums/restaurant.enum";
import {ValidatorUtils} from "@core/utils/utils";
import {finalize} from "rxjs/operators";
import {ItemAddEdit} from "@restaurant/ui/items/item-add-edit/item-add-edit";
import {PageEvent} from "@angular/material/paginator";
import {MatIcon} from "@angular/material/icon";
import {Button, Pagination} from "@acontplus/ng-components";
import {PaginationParams} from "@acontplus/core";
import {MatTabsModule} from "@angular/material/tabs";
import {PromotionAddEdit} from "@restaurant/ui/promotions/promotion-add-edit/promotion-add-edit";
@Component({
  selector: 'app-promotions',
  imports: [
    BreadcrumbComponent,
    DataGrid,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    Button,
    ReactiveFormsModule,
    MatTabsModule,
    PromotionAddEdit
  ],
  templateUrl: './promotions.html',
  styleUrl: './promotions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Promotions {
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
  pagination = signal(new Pagination());


  searchTerm = ''

  ngOnInit() {
  //  this.getList();
  }

  getList() {

    const params = new PaginationParams({
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      searchTerm: ValidatorUtils.isValidField(this.searchTerm) ?? undefined ,
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
            (res) => new Pagination(res.pageIndex, res.pageSize, response.totalCount)
          );
        },
        error: (err) => {
          this.list.set([]);
          console.error('Error al cargar la lista:', err);
        }
      });

  }

  onEdit(rowData: any) {
    console.log('Editando:', rowData);
    this._dgSvc.open(ItemAddEdit, {
      size: 'xl',
      data: {
        id: rowData.id,
        acronymCategory: rowData.acronymCategory,
      },
    });
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
