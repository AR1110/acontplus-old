import {Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

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
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentAddEditComponent>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');


  close(){
    this.dialogRef.close();
  }
}
