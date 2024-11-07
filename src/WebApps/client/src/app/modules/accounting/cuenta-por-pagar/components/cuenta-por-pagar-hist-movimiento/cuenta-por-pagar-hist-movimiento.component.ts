import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';

@Component({
  selector: 'app-cuenta-por-pagar-hist-movimiento',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    CustomContainerDialogComponent,
  ],
  templateUrl: './cuenta-por-pagar-hist-movimiento.component.html',
  styles: ``
})
export class CuentaPorPagarHistMovimientoComponent {
  readonly dialogRef = inject(MatDialogRef<CuentaPorPagarHistMovimientoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  loading = signal(false)


  closeDialog() {
    this.dialogRef.close();
  }
}
