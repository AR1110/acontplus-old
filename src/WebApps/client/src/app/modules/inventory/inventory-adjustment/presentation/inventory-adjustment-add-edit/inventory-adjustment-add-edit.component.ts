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

@Component({
  selector: 'app-inventory-adjustment-add-edit',
  imports: [
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './inventory-adjustment-add-edit.component.html',
  styles: ``
})
export class InventoryAdjustmentAddEditComponent {
  #dialogSvc = inject(DialogService)
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentAddEditComponent>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');


  openSearchAdvanced(){
    const ref = this.#dialogSvc.open(InventoryAdjustmentSearchAdvancedComponent, {
      size: 'xl',
      data: {

      }
    })
    ref.subscribe(res => {
      if(res && typeof res  == 'object'){

      }
    })
  }


  close(){
    this.dialogRef.close();
  }
}
