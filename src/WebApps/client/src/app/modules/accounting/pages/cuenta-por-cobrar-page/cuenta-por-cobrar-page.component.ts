import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CuentaPorCobrarService } from '@modules/accounting/services/cuenta-por-cobrar.service';
import { ComprobanteIngresoOpenModalService } from '@modules/accounting/shared/services/comprobante-ingreso-open-modal.service';
import { Pagination } from '@shared/class/pagination';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cuenta-por-cobrar',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    BreadcrumbComponent,
    TabulatorSemanticUiComponent
  ],
  templateUrl: './cuenta-por-cobrar-page.component.html',
  styles: ``
})
export class CuentaPorCobrarPageComponent {

  @ViewChild(TabulatorSemanticUiComponent) _tabulatorComponent!: TabulatorSemanticUiComponent;

  tS = inject(ToasterService);
  cuentaPorCobrarSvc = inject(CuentaPorCobrarService);
  comprobanteIngresoOpenModalSvc = inject(ComprobanteIngresoOpenModalService)

  pagination = new Pagination()
  tabOptions = {
    selectable: true
  }
  columns = [
    {
      headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e: any, cell: any) {
        cell.getRow().toggleSelect();
      }
    },
    {
      title: 'Nro.', formatter: "rownum", headerSort: false, hozAlign: "center",
    },
    { title: "Op", field: "name", headerHozAlign: "center", hozAlign: "center", headerSort: false, },
    { title: "Cod. Doc", field: "codDoc", headerHozAlign: "center", hozAlign: "center", headerSort: false, },
    { title: "Serie Comprobante", field: "serieComprobante", headerHozAlign: "center", headerSort: false, },
    { title: "Razon Social Comprador", field: "razonSocialComprador", headerHozAlign: "center", tooltip: true, formatter: "textarea" },
    { title: "Fecha Emisión", field: "fechaEmision", hozAlign: "center", headerHozAlign: "center", sorter: "date" },
    { title: "Fecha Vcto", field: "fechaVencimiento", hozAlign: "center", headerHozAlign: "center", width: 150 },
    { title: "Total", field: "importeTotal", hozAlign: "center", headerHozAlign: "center", width: 90 },
    { title: "Abono", field: "abono", hozAlign: "center", headerHozAlign: "center", width: 90 },
    { title: "Saldo", field: "saldo", hozAlign: "center", headerHozAlign: "center", width: 90 },
    { title: "Tiempo Credito", field: "tiempoCredito", hozAlign: "center", headerHozAlign: "center", width: 150 },
    { title: "Estado", field: "estado", hozAlign: "center", headerHozAlign: "center", width: 150 },
  ]

  cuentasPorCobrar = [
    {
      "idCuentaPorCobrar": 469087,
      "idCliente": 149070,
      "codEstab": "ESTAB-000000269",
      "codDoc": "FE",
      "razonSocialComprador": "SENGUANA WISUMA EMILIO YANKUAM",
      "identificacionComprador": "1450152325",
      "serieComprobante": "001-002-000000003",
      "fechaEmision": "12/04/2024",
      "fechaVencimiento": "12/04/2024",
      "importeTotal": 6.72,
      "abono": 0.00,
      "saldo": 6.72,
      "diasMora": 0,
      "mora": 0.00000,
      "tiempoCredito": "VENTAS - CONTADO",
      "estado": "Pendiente",
      "totalRecords": 1,
      "totalVenta": 6.72000,
      "totalAbono": 0.00000,
      "totalSaldo": 6.72000,
      "codEstado": "PE"
    }
  ]

  // Función para verificar si los valores de razonSocialComprador son los mismos
  verificarClienteIgual(selectedDocumentos: any[]) {
    const firstCustomerId = selectedDocumentos[0].idCliente;

    // Verificar si todas las demás entradas tienen la misma idCliente
    const sonIguales = selectedDocumentos.every(cuenta => cuenta.idCliente === firstCustomerId);

    return sonIguales;
  }

  openDocPaymentModal() {
    let selectedDocumentos = this._tabulatorComponent.refTabulator.getSelectedData();

    if (selectedDocumentos.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un documento!'
      });
      return
    }

    if (!this.verificarClienteIgual(selectedDocumentos)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione documentos que pertenezca al mismo cliente'
      });
      return
    }

    // Crear un array de promesas para cada solicitud
    const promises = selectedDocumentos.map(cxc => this.cuentaPorCobrarSvc.getCuotasById(cxc.idCuentaPorCobrar));

    // Utilizar Promise.all para ejecutar las promesas concurrentemente
    showLoader();
    forkJoin(promises).subscribe({
      next: (results) => {
        hideLoader()
        let mergeWithCuotas = this.mergeCuotas(selectedDocumentos, results);
        this.openModalCobroLote(mergeWithCuotas);
      },
      error(err) {
        console.log(err)
        hideLoader();
      },
    })

  }


  mergeCuotas(selectedDocumentos: any[], results: any[]) {
    return selectedDocumentos.map(cxc => {
      const [cuotasFiltradas] = results.filter(item =>
        item.some((cuota: any) => cuota.idCuentaPorCobrar === cxc.idCuentaPorCobrar)
      )
      return {
        ...cxc,
        saldoTemporal: cxc.saldo,
        cuotas: structuredClone(cuotasFiltradas),
        cuotasOriginal: structuredClone(cuotasFiltradas)
      };
    });
  }

  openModalCobroLote(selectedDocumentos: any[]) {
    try {
      let params = {
        selectedDocumentos
      }
      this.comprobanteIngresoOpenModalSvc.open(params)
    } catch (error) {
      console.log(error)
    }
  }




}
