import {Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {
  InventoryAdjustmentDetailUseCase
} from "@inventory/inventory-adjustment/application/inventory-adjustment-detail.use-case";

@Component({
  selector: 'app-inventory-adjustment-detail',
  imports: [
    MatCustomDialogComponent,
    MatDynamicCardComponent,
  ],
  templateUrl: './inventory-adjustment-detail.component.html',
  styles: ``
})
export class InventoryAdjustmentDetailComponent {
  #detailUseCase = inject(InventoryAdjustmentDetailUseCase)
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentDetailComponent>);
  private params = inject(MAT_DIALOG_DATA);
  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');


  ngOnInit() {
    this.#detailUseCase.execute(this.params.id).subscribe(response => {

    })
  }

  close(){
    this.dialogRef.close();
  }
}
