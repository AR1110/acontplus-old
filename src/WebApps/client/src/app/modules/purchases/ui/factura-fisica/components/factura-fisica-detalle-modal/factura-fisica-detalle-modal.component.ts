import { Component, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { TablaResumenTotalesComponent } from '@shared/components/tabla-resumen-totales/tabla-resumen-totales.component';
import { FacturaFisicaService } from '@purchases/services/factura-fisica.service';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-factura-fisica-detalle-modal',
  imports: [MatButtonModule, MatIconModule, MatCustomDialogComponent, TablaResumenTotalesComponent],
  templateUrl: './factura-fisica-detalle-modal.component.html',
  styles: ``,
})
export class FacturaFisicaDetalleModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<FacturaFisicaDetalleModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private facturaFisicaSvc = inject(FacturaFisicaService);

  isLoading = signal(false);

  infoTributaria = {} as any;
  infoFactura = {} as any;
  detalles = signal<any[]>([]);
  datosAdicionalesDoc = [] as any;
  tiposIva = signal<any[]>([]);

  ngOnInit() {
    this.isLoading.set(true);
    this.facturaFisicaSvc
      .getDetalleCompleto(this.data.id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe((response) => {
        console.log(response);
        const { infoTributaria, infoFactura, detalles, datosAdicionalesDoc, tiposIva } = response;

        this.infoTributaria = infoTributaria;
        this.infoFactura = infoFactura;
        this.detalles.set(detalles);
        this.datosAdicionalesDoc = datosAdicionalesDoc;
        this.tiposIva.set(tiposIva);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
