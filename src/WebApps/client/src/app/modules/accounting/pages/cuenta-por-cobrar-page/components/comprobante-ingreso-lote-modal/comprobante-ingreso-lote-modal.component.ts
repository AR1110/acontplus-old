import { Component, inject, Input } from '@angular/core';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { ModalService } from '@core/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tabulator } from 'tabulator-tables';
import { FormaCobroModalComponent } from '../forma-cobro-modal/forma-cobro-modal.component';
import { hideLoader, showLoader } from '@core/utils/loader';
import { CuentaPorCobrarService } from '@modules/accounting/services/cuenta-por-cobrar.service';

@Component({
  selector: 'app-comprobante-ingreso-lote-modal',
  standalone: true,
  imports: [
    TabulatorSemanticUiComponent,
    TabulatorComponent
  ],
  templateUrl: './comprobante-ingreso-lote-modal.component.html',
  styleUrl: './comprobante-ingreso-lote-modal.component.scss'
})
export class ComprobanteIngresoLoteModalComponent {
  @Input() params = {
    data: {} as any,
    selectedDocumentos: [] as any[]
  }

  modal = inject(NgbActiveModal);
  modalSvc = inject(ModalService);
  cuentaPorCobrarSvc = inject(CuentaPorCobrarService)

  tabOptions = {
    height: "100%",
    layout: "fitDataStretch",
    rowFormatter: function (row: any, e: any) {
      //create and style holder elements
      let holderEl: any = document.createElement("div");
      let tableEl: any = document.createElement("div");

      const id = row.getData().idCuentaPorCobrar;

      holderEl.style.boxSizing = "border-box";
      holderEl.style.padding = "5px 5px 5px 5px";
      holderEl.style.borderTop = "1px solid #aaa";
      holderEl.style.borderBotom = "1px solid #aaa";
      holderEl.style.background = "#fff";

      holderEl.setAttribute('class', "subTable" + id + "");


      tableEl.style.border = "1px solid #aaa";
      tableEl.style.display = 'none';
      tableEl.setAttribute('class', "subTable" + id + "");

      holderEl.appendChild(tableEl);

      row.getElement().appendChild(holderEl);

      const subTableRef = new Tabulator(tableEl, {
        data: row.getData().cuotas,
        headerSort: false,
        layout: "fitDataStretch",
        autoResize: true, // prevent auto resizing of table
        columns: [
          {
            title: "Nro. Cuota",
            field: "nroCuota",
            width: 90,
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
          },
          {
            title: "Cuota",
            field: "cuota",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
          {
            title: "Mora",
            field: "mora",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
          {
            title: "Diás Mora",
            field: "diasMora",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
          {
            title: "Abono",
            field: "abono",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
          {
            title: "Saldo",
            field: "saldo",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
          {
            title: "Estado",
            field: "estado",
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: 90,
          },
        ]
      })
      row.subTableRef = subTableRef;
    },
  }
  columns = [
    {
      title: 'Nro.', formatter: "rownum", headerSort: false, hozAlign: "center",
      cellClick: (e: any, row: any) => {
        console.log('cell')
        console.log(row.getRow().subTableRef)
        const subTabulator = row.getRow().subTableRef;
        if (subTabulator) {
          // Mostrar u ocultar la tabla hija
          subTabulator.element.style.display = subTabulator.element.style.display === 'none' ? 'block' : 'none';
        }
      }
    },
    {
      title: 'Tipo Doc.',
      field: 'codDoc',
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Serie Comprobante",
      field: "serieComprobante",
      width: 150,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Fecha Emisión", field: "fechaEmision", width: 100,
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Razon Social Comprador", field: "razonSocialComprador",
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: 300,
    },
    {
      title: "Total", field: "importeTotal",
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      width: 120,
    },



  ]

  dataFormaCobro = {};
  tipoDocumentos: any[] = [];
  selectedDocumentos: any[] = [];
  comprobante = {} as any
  datosCobro = []
  data = {}

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
            this.selectedDocumentos =  [...selectedDocumentos, ...selectedDocumentos] ;

            let dataSelectedDoc = selectedDocumentos[0];
            this.comprobante = {
              idCliente: dataSelectedDoc.idCliente,
              razonSocialComprador: dataSelectedDoc.razonSocialComprador,
              codEstab: dataSelectedDoc.codEstab,
              identificacionComprador: dataSelectedDoc.identificacionComprador
            }
          }
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
      saldo: 0,
      datosCobro: this.datosCobro
    }
  }

}
