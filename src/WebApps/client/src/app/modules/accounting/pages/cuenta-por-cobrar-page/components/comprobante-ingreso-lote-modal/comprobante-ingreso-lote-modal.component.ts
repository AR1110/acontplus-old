import { MatIconModule } from '@angular/material/icon';
import { Component, inject, Input } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { CuentaPorCobrarService } from '@modules/accounting/services/cuenta-por-cobrar.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tabulator } from 'tabulator-tables';

import { FormaCobroModalComponent } from '../forma-cobro-modal/forma-cobro-modal.component';
import { MatTableModule } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { roundNumber } from '@core/utils/round-number.utils';

@Component({
  selector: 'app-comprobante-ingreso-lote-modal',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    FontAwesomeModule,
    NgbAccordionModule,
  ],
  templateUrl: './comprobante-ingreso-lote-modal.component.html',
  styleUrl: './comprobante-ingreso-lote-modal.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0', marginBottom: '1px solid #ddd' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComprobanteIngresoLoteModalComponent {
  @Input() params = {
    data: {} as any,
    selectedDocumentos: [] as any[]
  }

  modal = inject(NgbActiveModal);
  modalSvc = inject(ModalService);
  cuentaPorCobrarSvc = inject(CuentaPorCobrarService)

  dataFormaCobro = {};
  tipoDocumentos: any[] = [];
  selectedDocumentos: any[] = [];
  comprobante = {} as any
  datosCobro = []
  data = {
    importeTotal: 0,
    totalSaldo: 0,
    totalAbonoAnterior: 0,
    totalMora: 0,
    totalSaldoDoc: 0,
    totalValorAbono: 0,
    valorCambio: 0
  }

  expandedElement: any | null;

  // En tu-componente.component.ts
  cuotasColumns: string[] = ['nroCuota', 'cuota', 'mora']; // Agrega más columnas según sea necesario


  getTotalesCuota() {
    let importeTotal = 0, abono = 0, saldo = 0, totalMora = 0, totalSaldoDoc = 0;
    for (let item of this.selectedDocumentos) {
      importeTotal += item.importeTotal;
      saldo += item.saldo;
      abono += item.abono;
      totalMora += item.mora || 0;
      totalSaldoDoc += item.saldoDoc || 0;
    }
    this.data.importeTotal = roundNumber(importeTotal, 5);
    this.data.totalSaldo = roundNumber(saldo, 5);
    this.data.totalAbonoAnterior = roundNumber(abono, 5)
    this.data.totalMora = roundNumber(totalMora, 5)
    this.data.totalSaldoDoc = roundNumber(totalSaldoDoc, 5)
    this.data.totalValorAbono = 0;
    this.data.valorCambio = 0;

    this.comprobante.importeTotal = this.data.importeTotal
    this.comprobante.abono = this.data.totalAbonoAnterior
    this.comprobante.saldo = this.data.totalSaldo
    this.comprobante.totalMora = this.data.totalMora;

  }

  loadInitialData() {
    try {
      const { data, selectedDocumentos } = this.params;
      showLoader();
      let idCuentaPorCobrar = null, idCliente = 0;
      if (Object.prototype.toString.call(data) === '[object Object]') {
        idCuentaPorCobrar = data.idCuentaPorCobrar;
        idCliente = data.idCliente;
      }
      if (selectedDocumentos !== null && Array.isArray(selectedDocumentos)) {
        idCliente = selectedDocumentos[0].idCliente;
      }
      this.cuentaPorCobrarSvc.getDataForm(idCuentaPorCobrar, idCliente).subscribe({
        next: (response) => {
          hideLoader()
          this.dataFormaCobro = response;

          if (selectedDocumentos && Array.isArray(selectedDocumentos)) {
            this.tipoDocumentos = structuredClone(selectedDocumentos);
            this.selectedDocumentos = selectedDocumentos;
            console.log(selectedDocumentos)

            let dataSelectedDoc = selectedDocumentos[0];
            this.comprobante = {
              idCliente: dataSelectedDoc.idCliente,
              razonSocialComprador: dataSelectedDoc.razonSocialComprador,
              codEstab: dataSelectedDoc.codEstab,
              identificacionComprador: dataSelectedDoc.identificacionComprador
            }
          }
          this.getTotalesCuota()
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })


    } catch (error) {
      console.log(error)
      hideLoader()
    }
  }
  ngOnInit() {
    this.loadInitialData()
  }


  openModalFormaCobro() {
    let modalRef = this.modalSvc.openModalCustom(FormaCobroModalComponent, {
      size: 'lg'
    })
    modalRef.componentInstance.params = {
      dataFormaCobro: this.dataFormaCobro,
      comprobante: this.comprobante,
      saldo: this.data.totalSaldo,
      datosCobro: this.datosCobro
    }
  }


  toggleDisplay(group: any) {
    group.display = !group.display;
  }

  // Función para mostrar detalles de cobro de una cuota
  showCobroDetalle(cuota: any) {
    // Lógica para mostrar detalles de cobro de la cuota
  }

  isRowExpanded = (index: number, item: any) => item.display;


  columnsToDisplay = ['expand', 'tipoDoc', 'serieComprobante', 'identificacionComprador', 'razonSocialComprador', 'total'];

}
