import { Component, inject, input, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { Pagination, Button, DynamicCard } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FRACTIONAL_PRODUCT_SERVICE } from '@inventory/data/inventory-token';

import { isValidField } from '@core/utils/utils';
import { finalize } from 'rxjs/operators';
import { DialogService } from '@core/services/dialog.service';
import { AddEditFractionalProductComponent } from '@inventory/ui/fractional-product/components/add-edit-fractional-product/add-edit-fractional-product.component';

@Component({
  selector: 'app-fracc-product-list',
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDynamicTableComponent,
    DynamicCard,
    Button,
  ],
  templateUrl: './fracc-product-list.component.html',
  styles: ``,
})
export class FraccProductListComponent implements OnInit {
  private $fractionalProductService = inject(FRACTIONAL_PRODUCT_SERVICE);
  private dialogSvc = inject(DialogService);

  productId = input(0);
  isCalledFromProductModal = input(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'nomProducto', label: 'Producto', type: 'string' },
    { key: 'conversion', label: 'Conversión', type: 'string' },
    {
      key: 'precioCostoFraccionado',
      label: 'Precio Costo Fraccionado',
      type: 'number',
    },
    { key: 'nomMedida', label: 'Médida', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());
  isLoadingResults = signal(false);
  dataSource = signal<any[]>([]);

  dataSearch = {
    textSearch: null as string | null,
  };

  loadData() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      textSearch: isValidField(this.dataSearch.textSearch),
      idArticulo: this.productId(),
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);
    this.$fractionalProductService
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource.set(response.payload?.data ?? []);
        this.pagination.update(
          (item) =>
            new Pagination(item.pageIndex, item.pageSize, response.payload?.totalRecords ?? 0),
        );
      });
  }

  ngOnInit() {
    this.loadData();
  }

  onSearch(e: any) {}

  refresh() {
    this.loadData();
  }

  openAddEdit(item?: any) {
    const data = {} as any;
    if (item) {
      data.id = item.idArticuloFraccionado;
    } else {
      data.productId = this.productId();
      data.isCalledFromProductModal = this.isCalledFromProductModal();
    }
    const ref = this.dialogSvc.open(AddEditFractionalProductComponent, {
      data,
      size: 'xl',
    });

    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
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
