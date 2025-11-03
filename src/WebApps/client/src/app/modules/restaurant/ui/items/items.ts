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

@Component({
  selector: 'app-items',
  imports: [
    MatButtonToggleModule,
    DataGrid,
    BreadcrumbComponent,
    FormsModule,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './items.html',
  styleUrl: './items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Items {
  private _listUseCase = inject(ItemListUseCase);

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

  subCategories = [];

  list = signal<any[]>([]);
  isLoading = true;
  pagination = signal(new MatPagination());

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.isLoading = true;
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      categoriesSigla: this.subCategories.length > 0 ? this.subCategories.toString() : null,
    };
    this._listUseCase.execute(params).subscribe((response) => {
      console.log(response);
      this.list.set(response.data);
      this.pagination.update((res) => ({
        ...res,
        totalRecords: response.totalRecords,
      }));
      this.isLoading = false;
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
