import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Button, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { isValidField } from '@core/utils/utils';
import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';
import { ProductAutocompleteAdvancedComponent } from '@inventory/ui/product/components/product-autocomplete-advanced/product-autocomplete-advanced.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { ExcelImportService } from '@modules/config/application/services/excel-import.service';
import Swal from 'sweetalert2';
import { ValidateImportedDataUseCase } from '@modules/config/application/use-cases/excel-import/validate-imported-data.use-case';
import { InventoryAdjustmentListProductsMapper } from '@inventory/data/mappers/inventory-adjustment.mapper';

@Component({
  selector: 'app-inventory-adjustment-search-advanced',
  imports: [
    MatDialogContent,
    MatDialogActions,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    DataGrid,
    ProductAutocompleteAdvancedComponent,
    SupplierSearchComponent,
  ],
  templateUrl: './inventory-adjustment-search-advanced.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    rucProveedor: null as string | null,
    productId: 0,
    subFamiliaId: 0,
    nroDocumento: null as string | null,
    bodegaId: 0,
    isExcelImport: false,
  };

  dataSource = signal<
    { idArticulo: number; codigo: string; descripcion: string; cantidad: number }[]
  >([]);
  selectedRows = signal<
    { idArticulo: number; codigo: string; descripcion: string; cantidad: number }[]
  >([]);
  productsNotFounded = signal<{ codigo: string; cantidad: number }[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'codigo', header: 'Código' },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'medidaNombre', header: 'Medida' },
    { field: 'impuestoNombre', header: 'Impuesto' },
    { field: 'stock', header: 'Stock' },
    { field: 'precioCosto', header: 'Precio Costo' },
  ];

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

  productSelected(event: { id: number }) {
    this.searchAdvancedForm.productId = event.id;
    this.refresh();
  }

  supplierSelected(event: { identificacionComprador: string }) {
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
      this.dataSource.set(
        res.data as { idArticulo: number; codigo: string; descripcion: string; cantidad: number }[],
      );
    });
  }

  rowAllSelected(selectedRows: unknown) {
    const typedRows = selectedRows as {
      idArticulo: number;
      codigo: string;
      descripcion: string;
      cantidad: number;
    }[];
    this.selectedRows.set([...typedRows]);
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const rawData = await this._excelImportSvc.parseExcelFile(file);
      const firstRow = rawData[0] as Record<string, unknown> | undefined;
      const displayedColumns = Object.keys(firstRow ?? {}).map((c) => c.trim());
      if (!(displayedColumns.includes('codigo') && displayedColumns.includes('cantidad'))) {
        void Swal.fire({
          icon: 'error',
          html: this.infoImportExcel(),
        });
        return;
      }
      const params = {
        code: 'EX',
        data: {
          product: rawData as Record<string, unknown>[],
        },
      };

      this.validateExcelUseCase.execute(params).subscribe((res) => {
        if (res.code === '0') return;
        const parsedResponse = JSON.parse(res.payload as string) as unknown[];
        const parseData = parsedResponse[0] as {
          data: { idArticulo: number; codigo: string; descripcion: string; cantidad: number }[];
          noVinculados: { codigo: string; cantidad: number }[];
        };

        const ds = InventoryAdjustmentListProductsMapper.fromJson(parseData);
        this.dataSource.set(
          ds.data as {
            idArticulo: number;
            codigo: string;
            descripcion: string;
            cantidad: number;
          }[],
        );

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
    void Swal.fire({
      title: '<small>Artículo No Vinculados</small>',
      icon: 'info',
      html,
      width: 700,
    });
  }

  ngOnInit(): void {
    // Initialize component
    this.refresh();
  }

  applySelected() {
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
