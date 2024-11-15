import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';

@Component({
  selector: 'app-comprobante-ingreso-lote',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule, MatDividerModule,
    CustomContainerDialogComponent
  ],
  templateUrl: './comprobante-egreso-lote.component.html',
  styles: `


  `
})
export class ComprobanteEgresoLoteComponent {

  readonly dialogRef = inject(MatDialogRef<ComprobanteEgresoLoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  loading = signal(false);

  formasDePago = signal([
    {
      descripcion: 'EFECTIVO'
    },
    {
      descripcion: 'TRANSFERENCIAS'
    },
    {
      descripcion: 'TARJETA CREDITO'
    },
    {
      descripcion: 'DOCUMENTOS'
    }
  ])


  closeDialog(){
    this.dialogRef.close()
  }

}
