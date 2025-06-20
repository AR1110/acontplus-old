import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-inventory-adjustment-search-advanced',
  imports: [
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './inventory-adjustment-search-advanced.component.html',
  styles: ``
})
export class InventoryAdjustmentSearchAdvancedComponent {
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentSearchAdvancedComponent>);
  private params = inject(MAT_DIALOG_DATA);

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];


  }


  close(){
    this.dialogRef.close();
  }
}
