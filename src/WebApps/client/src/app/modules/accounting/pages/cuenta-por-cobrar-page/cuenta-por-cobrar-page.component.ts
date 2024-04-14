import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';

@Component({
  selector: 'app-cuenta-por-cobrar',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    TabulatorSemanticUiComponent
  ],
  templateUrl: './cuenta-por-cobrar-page.component.html',
  styles: ``
})
export class CuentaPorCobrarPageComponent {

  columns = [
    { title: "Op", field: "name", headerHozAlign: "center", hozAlign: "center", headerSort: false, },
    { title: "Cod. Doc", field: "codDoc", headerHozAlign: "center", hozAlign: "center", headerSort: false, },
    { title: "Serie Comprobante", field: "serieComprobante", headerHozAlign: "center", headerSort: false, },
    { title: "Razon Social Comprador", field: "razonSocialComprador", headerHozAlign: "center", tooltip: true, formatter: "textarea"  },
    { title: "Fecha Emisión", field: "fechaEmision", hozAlign: "center", headerHozAlign: "center", sorter: "date" },
    { title: "Fecha Vcto", field: "fechaVencimiento", hozAlign: "center", headerHozAlign: "center",  width: 150 },
    { title: "Total", field: "importeTotal", hozAlign: "center", headerHozAlign: "center",  width: 90 },
    { title: "Abono", field: "abono", hozAlign: "center", headerHozAlign: "center", width: 90 },
    { title: "Saldo", field: "saldo", hozAlign: "center", headerHozAlign: "center",  width: 90 },
    { title: "Tiempo Credito", field: "tiempoCredito", hozAlign: "center", headerHozAlign: "center", width: 150 },
    { title: "Estado", field: "estado", hozAlign: "center", headerHozAlign: "center", width: 150 },
  ]

  cuentasPorCobrar = [
    {
      "idCuentaPorCobrar": 485212,
      "idCliente": 149070,
      "codEstab": "ESTAB-000000269",
      "codDoc": "NE",
      "razonSocialComprador": "SENGUANA WISUMA EMILIO YANKUAM",
      "identificacionComprador": "1450152325",
      "serieComprobante": "001-002-000000004",
      "fechaEmision": "07/04/2024",
      "fechaVencimiento": "07/04/2024",
      "importeTotal": 600.00,
      "abono": 0.00,
      "saldo": 600.00,
      "diasMora": 0,
      "mora": 0.00000,
      "tiempoCredito": "VENTAS - CONTADO",
      "estado": "Pendiente",
      "totalRecords": 1,
      "totalVenta": 600.00000,
      "totalAbono": 0.00000,
      "totalSaldo": 600.00000,
      "codEstado": "PE"
    }
  ]

}
