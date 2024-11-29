import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/custom-container-dialog/mat-custom-dialog.component';
import { NotaEntregaService } from '@modules/sale/services/nota-entrega.service';
import { TablaResumenTotalesComponent } from '@shared/components/tabla-resumen-totales/tabla-resumen-totales.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-nota-entrega-detalle-dialog',
  imports: [
    MatButtonModule,
    MatCustomDialogComponent,
    TablaResumenTotalesComponent,
  ],
  templateUrl: './nota-entrega-detalle-dialog.component.html',
  styles: ``,
})
export class NotaEntregaDetalleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NotaEntregaDetalleDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private notaEntregaSvc = inject(NotaEntregaService);

  isLoading = signal(false);

  headerData = {} as any;
  clienteData = {} as any;
  detalles = signal<any[]>([]);
  datosAdicionalesDoc = [] as any;
  tiposIva = signal<any[]>([]);

  ngOnInit() {
    this.isLoading.set(true);
    this.notaEntregaSvc
      .getDetalleCompleto(this.data.id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe((response) => {
        const {
          headerData,
          clienteData,
          detalles,
          datosAdicionalesDoc,
          tiposIva,
        } = response;

        this.headerData = headerData;
        this.clienteData = clienteData;
        this.detalles.set(detalles);
        this.datosAdicionalesDoc = datosAdicionalesDoc;
        this.tiposIva.set(tiposIva);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
