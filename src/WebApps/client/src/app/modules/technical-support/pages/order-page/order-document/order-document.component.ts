import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TabulatorComponent } from "../../../../../core/components/tabulator/tabulator.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-document',
  standalone: true,
  templateUrl: './order-document.component.html',
  styles: ``,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TabulatorComponent,
    FormsModule,
  ]
})
export class OrderDocumentComponent implements OnInit {

  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);
  documento: any = {};
  documentDetails: any = [];
  @Input() data: any = {};


  columns = [
    { title: "Descripción", field: "descripcion", width: 300 },
    { title: "Bodega", field: "bodega", width: 130 },
    { title: "Tarifa", field: "tarifaDescripcion", with: 200 },
    { title: "Medida", field: "medida", with: 200 },
    { title: "Tipo IVA", field: "tipoIva", with: 200 },
    { title: "Cantidad", field: "cantidad", align: "center", with: 200 },
    { title: "P. Costo", field: "precioCosto", align: "center", with: 200 },
    { title: "P. Unitario", field: "precioUnitario", align: "center", with: 200 },
    { title: "V. Tarifa", field: "tarifa", align: "center", with: 200 },
    { title: "V. Impuesto", field: "valorImpuesto", align: "center", with: 200 },
    { title: "% Descuento", field: "porcentajeDescuento", align: "center", with: 200 },
    { title: "V. Descuento", field: "valorDescuento", align: "center", with: 200 },
    { title: "Total", field: "precioTotalSinImpuesto", align: "center", with: 200 },
    { title: "Nota", field: "nota", align: "center", with: 300 },
  ];

  ngOnInit(): void {
    this.get();
  }

  get() {
    showLoader();
    let params = { tipo: 5, id: this.data.id };

    this.orderService.get(params).subscribe({
      next: (response: any) => {
        if (response.code === "1") {
          let { documento, documentoDetalle } = JSON.parse(response.payload);
          this.documento = documento;
          this.documentDetails = documentoDetalle;


          console.log(this.documento);
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }


  closeModal() {
    this.modalRef.close();
  }

}
