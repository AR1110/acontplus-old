import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { isValidField } from '@core/utils/utils';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';
import { ProductAutocompleteAdvancedComponent } from '@inventory/ui/product/components/product-autocomplete-advanced/product-autocomplete-advanced.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { ExcelImportService } from '@modules/config/application/services/excel-import.service';
import Swal from 'sweetalert2';
import { ValidateImportedDataUseCase } from '@modules/config/application/use-cases/excel-import/validate-imported-data.use-case';
import { InventoryAdjustmentListProductsMapper } from '@inventory/data/mappers/inventory-adjustment.mapper';
import { InventoryAdjustmentListProductsDto } from '@inventory/data/dtos/inventory-adjustment.dto';

@Component({
  selector: 'app-inventory-adjustment-search-advanced',
  imports: [
    MatCustomDialogComponent,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatDynamicTableComponent,
    ProductAutocompleteAdvancedComponent,
    SupplierSearchComponent,
  ],
  templateUrl: './inventory-adjustment-search-advanced.html',
  styles: ``,
})
export class InventoryAdjustmentSearchAdvanced implements OnInit {
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentSearchAdvanced>);
  private params = inject<{ warehouseId: number }>(MAT_DIALOG_DATA);
  private inventoryAdjustmentSvc = inject(InventoryAdjustmentService);
  private validateExcelUseCase = inject(ValidateImportedDataUseCase);
  private _excelImportSvc = inject(ExcelImportService);

  mainFormData = signal(this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData);

  infoImportExcel = signal(
    `Para consolidar los productos con un archivo de tipo Excel, debe tener las siguientes columnas en minúsculas: <em>codigo</em>, <em>cantidad</em>`,
  );

  catalogs = signal([
    { code: 1, name: 'Articulo' },
    { code: 3, name: 'Subfamilias' },
    { code: 4, name: 'Proveedor' },
    { code: 5, name: 'N° Documento' },
    { code: 6, name: 'Artículos Importados' },
  ]);

  searchAdvancedForm = {
    opcion: 0,
    rucProveedor: null,
    productId: 0,
    subFamiliaId: 0,
    nroDocumento: null,
    bodegaId: 0,
    isExcelImport: false,
  };

  dataSource = signal<any[]>([]);
  selectedRows = signal<any[]>([]);
  productsNotFounded = signal<any[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'codigo', label: 'Usuario', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'cantidad', label: 'Cantidad', type: 'string' },
    { key: 'medidaNombre', label: 'Medida', type: 'string' },
    { key: 'impuestoNombre', label: 'Impuesto', type: 'string' },
    { key: 'stock', label: 'Estado', type: 'string' },
    { key: 'precioCosto', label: 'Precio Costo', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  optionChange() {
    this.searchAdvancedForm.rucProveedor = null;
    this.searchAdvancedForm.productId = 0;
    this.searchAdvancedForm.subFamiliaId = 0;
    if (this.searchAdvancedForm.opcion === 6) {
      this.refresh();
    }
  }

  refresh() {
    this.productsNotFounded.set([]);
    this.listProducts();
  }

  productSelected(event: any) {
    this.searchAdvancedForm.productId = event.id;
    this.refresh();
  }

  supplierSelected(event: any) {
    this.searchAdvancedForm.rucProveedor = event.identificacionComprador;
    this.refresh();
  }

  refreshNroDoc() {
    if (isValidField(this.searchAdvancedForm.nroDocumento)) {
      this.refresh();
    }
  }

  private listProducts() {
    const dataSearch = {
      idArticulo: isValidField(this.searchAdvancedForm.productId),
      rucProveedor: isValidField(this.searchAdvancedForm.rucProveedor),
      opcion: this.searchAdvancedForm.opcion,
      idSubFamilia: isValidField(this.searchAdvancedForm.subFamiliaId),
      nroDocumento: isValidField(this.searchAdvancedForm.nroDocumento),
      idBodega: this.searchAdvancedForm.opcion === 6 ? this.params.warehouseId : null,
    };
    this.inventoryAdjustmentSvc.getProductListImported(dataSearch).subscribe((res) => {
      console.log(res);
      this.dataSource.set(res.data);
    });
  }

  rowSelected(row: any) {
    console.log(row);
    const current = this.selectedRows();
    const exists = current.some((r) => r.idArticulo === row.idArticulo);
    if (exists) {
      this.selectedRows.set([...current.filter((r) => r.idArticulo !== row.idArticulo)]);
    } else {
      this.selectedRows.set([...current, row]);
    }
  }

  rowAllSelected(event: any) {
    console.log(event);
    this.selectedRows.set([...event]);
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const rawData = await this._excelImportSvc.parseExcelFile(file);
      const displayedColumns = Object.keys(rawData[0]).map((c) => c.trim());
      if (!(displayedColumns.includes('codigo') && displayedColumns.includes('cantidad'))) {
        Swal.fire({
          icon: 'error',
          html: this.infoImportExcel(),
        });
        return;
      }
      const params = {
        code: 'EX',
        data: {
          product: rawData,
        },
      };

      this.validateExcelUseCase.execute(params).subscribe((res) => {
        if (res.code === '0') return;
        const parseData = JSON.parse(res.payload as string)[0];

        const ds = InventoryAdjustmentListProductsMapper.fromJson(parseData);
        this.dataSource.set(ds.data);

        this.productsNotFounded.set(parseData.noVinculados);
      });
      input.value = '';
    }
  }

  showProductsNoVinculado() {
    let html = `<div class="table-responsive" style="max-height: 400px;">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>
                                <th><small>Código</small></th>
                                <th><small>Cantidad</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

    let index = 1;
    for (const item of this.productsNotFounded()) {
      html += ` <tr>
                        <td>${index++}</td>
                        <td>${item.codigo}</td>
                        <td>${item.cantidad}</td>
                    </tr>
                `;
    }
    html += '</tbody></table></div>';
    Swal.fire({
      title: '<small>Artículo No Vinculados</small>',
      icon: 'info',
      html,
      width: 700,
    });
  }

  ngOnInit(): void {}

  applySelected() {
    console.log(this.selectedRows());
    this.dialogRef.close({
      selectedRows: this.selectedRows(),
      opcion: this.searchAdvancedForm.opcion,
      isExcelImport: this.searchAdvancedForm.isExcelImport,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
