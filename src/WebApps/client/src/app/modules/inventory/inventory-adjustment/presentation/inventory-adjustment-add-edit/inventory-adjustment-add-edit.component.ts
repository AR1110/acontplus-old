import {Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {DialogService} from "@core/services/dialog.service";
import {
  InventoryAdjustmentSearchAdvancedComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-add-edit/inventory-adjustment-search-advanced/inventory-adjustment-search-advanced.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InventoryAdjustmentStore} from "@inventory/inventory-adjustment/application/store/inventory-adjustment.store";
import {roundNumber} from "@core/utils/round-number.utils";
import {
  ProductAutocompleteAdvancedComponent
} from "@inventory/product/presentation/components/product-autocomplete-advanced/product-autocomplete-advanced.component";
import {
  ProductSearchOverlayComponent
} from "@inventory/product/presentation/components/product-search-overlay/product-search-overlay.component";

@Component({
  selector: 'app-inventory-adjustment-add-edit',
  imports: [
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ProductAutocompleteAdvancedComponent,
    ProductSearchOverlayComponent,
  ],
  templateUrl: './inventory-adjustment-add-edit.component.html',
})
export class InventoryAdjustmentAddEditComponent {
  $inventoryAdjustmentStore  = inject(InventoryAdjustmentStore);

  #dialogSvc = inject(DialogService)
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentAddEditComponent>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');

  dataSourceItems = signal<any[]>([])

  dataForm = new FormGroup({
    bodegaId: new FormControl(null, [Validators.required]),
  })

  decimal = signal(this.$inventoryAdjustmentStore.mainFormData().decimal)


  openSearchAdvanced(){
    console.log(this.params);
    const ref = this.#dialogSvc.open(InventoryAdjustmentSearchAdvancedComponent, {
      size: 'xl',
      data: {

      }
    })
    ref.subscribe(result => {
      if (result && Array.isArray(result.selectedRows)) {
        const {
          selectedRows,
          opcion,
          isExcelImport
        } = result;
        for (const a of selectedRows) {
          if (!this.dataSourceItems().some(x => x.idArticulo == a.idArticulo)) {
            const obj = structuredClone(a);
            if (!isExcelImport) {
              obj.cantidad = opcion && opcion === 6 ? obj.cantidad : 1;
            }
            obj.idBodega = this.dataForm.value.bodegaId;
            const total = obj.cantidad * obj.precioUnitario;
            obj.total = roundNumber(total,this.decimal().nroPrecio);
            this.dataSourceItems.set([...this.dataSourceItems(), obj]);
          }
        }
      }
    })
  }


  itemSelected($event:any){

    console.log($event)
  }

  close(){
    this.dialogRef.close();
  }
}
