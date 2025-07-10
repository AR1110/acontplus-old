import {Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

import {isValidField} from "@core/utils/utils";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {
  InventoryAdjustmentService
} from "@inventory/inventory-adjustment/domain/services/inventory-adjustment.service";

@Component({
  selector: 'app-inventory-adjustment-search-advanced',
  imports: [
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatDynamicTableComponent
  ],
  templateUrl: './inventory-adjustment-search-advanced.component.html',
  styles: ``
})
export class InventoryAdjustmentSearchAdvancedComponent {
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentSearchAdvancedComponent>);
  private params = inject(MAT_DIALOG_DATA);
  private inventoryAdjustmentSvc = inject(InventoryAdjustmentService)

  mainFormData = signal(this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData)



  catalogs = signal([
     { code: 1, name: 'Articulo' },
     { code: 3, name: 'Subfamilias' },
     { code: 4, name: 'Proveedor' },
     { code: 5, name: 'N° Documento' },
     { code: 6, name: 'Artículos Importados' },

   ])

  searchAdvancedForm = {
     opcion: 0,
    rucProveedor: null,
    productId: 0,
    subFamiliaId: 0,
    nroDocumento: null,
    bodegaId: 0,
    isExcelImport : false,
  }

  dataSource = signal<any[]>([]);
  selectedRows = signal<any[]>([]);

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
   this.searchAdvancedForm.productId = 0
    if (this.searchAdvancedForm.opcion === 6) {
    // this.getArticles();
    }
  }


  refresh(){
    this.listProducts()
  }

  private listProducts(){
    const dataSearch = {
      idArticulo: isValidField(this.searchAdvancedForm.productId),
      rucProveedor: isValidField(this.searchAdvancedForm.rucProveedor),
      opcion: this.searchAdvancedForm.opcion,
      idSubFamilia: isValidField(this.searchAdvancedForm.subFamiliaId),
      nroDocumento: isValidField(this.searchAdvancedForm.nroDocumento),
      idBodega: this.searchAdvancedForm.opcion === 6 ?this.searchAdvancedForm.bodegaId : null
    }
    this.inventoryAdjustmentSvc.getProductListImported(dataSearch).subscribe(res => {
      console.log(res)
      this.dataSource.set(res.data);
    })
  }

  rowSelected(row:any){
    console.log(row)
    const current = this.selectedRows();
    const exists = current.some(r => r.idArticulo === row.idArticulo);
    if (exists) {
      this.selectedRows.set([...current.filter(r => r.idArticulo !== row.idArticulo)]);
    } else {
      this.selectedRows.set([...current, row]);
    }
  }

  rowAllSelected(event:any){
    console.log(event);
    this.selectedRows.set([...event]);
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];


  }

  ngOnInit(): void {

  }

  applySelected(){
    console.log(this.selectedRows())
    this.dialogRef.close({
      selectedRows: this.selectedRows(),
      opcion: this.searchAdvancedForm.opcion,
      isExcelImport: this.searchAdvancedForm.isExcelImport,
    });
  }

  close(){
    this.dialogRef.close();
  }
}
