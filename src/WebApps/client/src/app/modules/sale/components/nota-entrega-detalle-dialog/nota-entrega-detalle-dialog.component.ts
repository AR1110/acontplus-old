import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';

@Component({
  selector: 'app-nota-entrega-detalle-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    CustomContainerDialogComponent
  ],
  templateUrl: './nota-entrega-detalle-dialog.component.html',
  styles: ``
})
export class NotaEntregaDetalleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NotaEntregaDetalleDialogComponent>);


  closeDialog(){
    this.dialogRef.close()
  }

}
