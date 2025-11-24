import { Component, OnInit, inject, signal } from '@angular/core';
import { OrderService } from '@modules/technical-support/services/order.service';
import { TabulatorTable } from '@acontplus/ng-components';
import { FormsModule } from '@angular/forms';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-document',
  templateUrl: './order-document.component.html',
  styles: ``,
  imports: [TabulatorTable, FormsModule, MatCustomDialogComponent],
})
export class OrderDocumentComponent implements OnInit {
  private modalRef = inject(MatDialogRef<OrderDocumentComponent>);
  private orderService = inject(OrderService);
  documento: any = {};
  documentDetails = signal<any[]>([]);
  data = inject(MAT_DIALOG_DATA);

  columns = [
    { title: 'Descripción', field: 'descripcion', width: 300 },
    { title: 'Bodega', field: 'bodega', width: 130 },
    { title: 'Tarifa', field: 'tarifaDescripcion', with: 200 },
    { title: 'Medida', field: 'medida', with: 200 },
    { title: 'Tipo IVA', field: 'tipoIva', with: 200 },
    { title: 'Cantidad', field: 'cantidad', align: 'center', with: 200 },
    { title: 'P. Costo', field: 'precioCosto', align: 'center', with: 200 },
    {
      title: 'P. Unitario',
      field: 'precioUnitario',
      align: 'center',
      with: 200,
    },
    { title: 'V. Tarifa', field: 'tarifa', align: 'center', with: 200 },
    {
      title: 'V. Impuesto',
      field: 'valorImpuesto',
      align: 'center',
      with: 200,
    },
    {
      title: '% Descuento',
      field: 'porcentajeDescuento',
      align: 'center',
      with: 200,
    },
    {
      title: 'V. Descuento',
      field: 'valorDescuento',
      align: 'center',
      with: 200,
    },
    {
      title: 'Total',
      field: 'precioTotalSinImpuesto',
      align: 'center',
      with: 200,
    },
    { title: 'Nota', field: 'nota', align: 'center', with: 300 },
  ];

  ngOnInit(): void {
    this.get();
  }

  get() {
    const params = { tipo: 5, id: this.data.id };

    this.orderService.get(params).subscribe((response: any) => {
      if (response.code === '1') {
        const { documento, documentoDetalle } = JSON.parse(response.payload);
        this.documento = documento;
        this.documentDetails.set(documentoDetalle);
      }
    });
  }

  onModalClose() {
    this.modalRef.close();
  }
}
