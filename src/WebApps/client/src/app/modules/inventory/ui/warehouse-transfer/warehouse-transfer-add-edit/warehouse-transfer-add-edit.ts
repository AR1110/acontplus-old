import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {DialogRef} from "@angular/cdk/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatSelectModule} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {provideNativeDateAdapter} from "@angular/material/core";
import {DialogService} from "@core/services/dialog.service";
import {
  WarehouseTransferFilterAdvanced
} from "@inventory/ui/warehouse-transfer/warehouse-transfer-add-edit/warehouse-transfer-filter-advanced/warehouse-transfer-filter-advanced";

@Component({
  selector: 'app-warehouse-transfer-add-edit',
  imports: [
    MatSelectModule,
    MatInput,
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveFormsModule
  ],
  templateUrl: './warehouse-transfer-add-edit.html',
  styleUrl: './warehouse-transfer-add-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class WarehouseTransferAddEdit {
  private dgSvc = inject(DialogService);
  private dialogRef  = inject(DialogRef<WarehouseTransferAddEdit>);
  private params = inject(MAT_DIALOG_DATA);

  title = signal('Nueva Transferencia')
  btnText = signal('Guardar');
  btnIcon = signal('save');

  openFilterAdvanced (){
    this.dgSvc.open(WarehouseTransferFilterAdvanced, {
      size: 'xl'
      }
    ).subscribe(result => {
      console.log(result);
    })
  }
  close(){

    this.dialogRef.close();
  }
}
