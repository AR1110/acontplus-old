import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransactionService } from '@inventory/services/transaction.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import Swal from 'sweetalert2';
import { SharedService } from '@core/services/shared.service';
import { INVENTORY_CODE_REPORT } from '@inventory/core/enums/inventory.enum';
import { formatDateToString } from '@core/utils/date.util';
import { monthEnd, monthStart } from '@formkit/tempo';

@Component({
    selector: 'app-product-kardex-modal',
    imports: [
        FontAwesomeModule,
        FormsModule,
        MatSlideToggleModule,
        MatChipsModule,
        ProductSearchComponent,
        DateRangeSelectionComponent,
        TabulatorComponent,
    ],
    templateUrl: './product-kardex-modal.component.html',
    styles: ``
})
export class ProductKardexModalComponent {
  @Input() params = {
    id: 0,
  };
  modal = inject(NgbActiveModal);

  transactionSvc = inject(TransactionService);
  tS = inject(ToasterService);
  sharedSvc = inject(SharedService);

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  tabulatorOptions = {
    columnHeaderVertAlign: 'bottom',
  };

  establecimientos: GroupedEstab[] = [];
  bodegas: GroupedEstabBodega[] = [];

  tiposTransaccion: any[] = [];

  startOfMonth: any = monthStart(new Date());
  endOfMonth: any = monthEnd(new Date());

  dataSearch = {
    codEstab: '',
    idBodega: 0,
    option: 1,
    estado: false,
    tipoTransaccion: '',
    idArticulo: 0,
    checkBoxFecha: true,
    fechaInicio: formatDateToString(this.startOfMonth),
    fechaFin: formatDateToString(this.endOfMonth),
  };

  dataArticulo = {
    codigo: '',
    stock: 0,
    medida: 0,
    descripcion: '',
  };

  data = {
    cantTotalEntrada: 0,
    cantTotalSalida: 0,
    totalSalida: 0,
    totalEntrada: 0,
    stock: 0,
    totalGenetal: 0,
  };

  transacciones: any[] = [];

  sumCantidadEntrada = () => {
    return this.data.cantTotalEntrada || 0;
  };

  sumCantidadSalida = () => {
    return this.data.cantTotalSalida || 0;
  };

  sumTotalSalida = () => {
    return this.data.totalSalida || 0;
  };

  columns = [
    {
      //create column group ---frozen:true,
      title: 'Descripcion',
      headerHozAlign: 'center',
      widthGrow: 2,
      frozen: true,
      columns: [
        {
          title: 'F. Emision',
          field: 'fechaEmision',
          headerHozAlign: 'center',
          headerSort: false,
          sorter: 'date',
          width: 120,
        },
        {
          title: 'T. Doc',
          field: 'tipoDoc',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          width: 60,
        },
        {
          title: 'Nro. Doc',
          field: 'nroDocumento',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          width: 130,
        },
        {
          title: 'Cliente/Proveedor',
          field: 'clienteProveedor',
          headerSort: false,
          headerHozAlign: 'center',
          hozAlign: 'center',
          width: 150,
          tooltip: true,
        },
        {
          title: 'Usuario',
          field: 'usuario',
          hozAlign: 'center',
          headerSort: false,
          headerHozAlign: 'center',
          width: 150,
        },
        {
          title: 'Estado',
          field: 'estado',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          width: 100,
        },
        {
          title: 'Medida',
          field: 'medida',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          width: 100,
        },
      ],
    },
    {
      //create column group
      title: 'Entradas',
      headerHozAlign: 'center',
      columns: [
        {
          title: 'Cant.',
          field: 'cantidadEntrada',
          width: 60,
          headerSort: false,
          hozAlign: 'center',
          headerHozAlign: 'center',
          cssClass: 'table-entradas',
          bottomCalc: this.sumCantidadEntrada,
        },
        {
          title: 'Costo U.',
          field: 'costo',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          sorter: 'date',
          width: 75,
          cssClass: 'table-entradas',
        },
        {
          title: 'Total',
          field: 'totalEntrada',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          sorter: 'date',
          width: 75,
          cssClass: 'table-entradas',
        },
      ],
    },
    {
      //create column group
      title: 'Salidas',
      headerHozAlign: 'center',
      columns: [
        {
          title: 'Cant.',
          field: 'cantidadSalida',
          width: 60,
          headerSort: false,
          hozAlign: 'center',
          headerHozAlign: 'center',
          cssClass: 'table-salidas',
          bottomCalc: this.sumCantidadSalida,
        },
        {
          title: 'Costo U.',
          field: 'venta',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          sorter: 'date',
          width: 75,
          cssClass: 'table-salidas',
        },
        {
          title: 'Total',
          field: 'totalSalida',
          hozAlign: 'center',
          headerHozAlign: 'center',
          headerSort: false,
          width: 75,
          cssClass: 'table-salidas',
          bottomCalc: this.sumTotalSalida,
        },
      ],
    },
    {
      //create column group
      title: 'Saldos',
      headerHozAlign: 'center',
      columns: [
        {
          title: 'Cant. ',
          field: 'cantidadTransaccion',
          hozAlign: 'center',
          headerHozAlign: 'center',
          width: 60,
          headerSort: false,
          cssClass: 'table-saldos',
        },
        {
          title: 'Stock. ',
          hozAlign: 'center',
          headerHozAlign: 'center',
          field: 'saldo',
          width: 60,
          headerSort: false,
          cssClass: 'table-saldos',
        },
        {
          title: 'Costo U.',
          hozAlign: 'center',
          headerHozAlign: 'center',
          field: 'precioCosto',
          width: 70,
          headerSort: false,
          sorter: 'number',
          cssClass: 'table-saldos',
        },
        {
          title: 'Total',
          field: 'totalGeneral',
          hozAlign: 'center',
          headerHozAlign: 'center',
          width: 60,
          headerSort: false,
          sorter: 'number',
          cssClass: 'table-saldos',
        },
      ],
    },
  ];

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fechaInicio = range.from;
    this.dataSearch.fechaFin = range.to;
  }

  ngOnInit() {
    showLoader();
    this.transactionSvc.getDataFilter().subscribe({
      next: (response) => {
        hideLoader();
        this.establecimientos = response.estabs;
        this.tiposTransaccion = response.tiposTransaccion;
        let dataEstab = this.establecimientos.find((e) => e.defaultEstab);

        if (dataEstab) {
          this.bodegas = dataEstab.bodegas;
          this.dataSearch.codEstab = dataEstab.codEstab;
          let dataBodega = this.bodegas.find((b) => b.defaultBodega);
          if (dataBodega) {
            this.dataSearch.idBodega = dataBodega.idBodega;
          }
        }

        //set params
        this.dataSearch.idArticulo = this.params.id;
        this.getDataKardex();
      },
      error(err) {
        console.log(err);
        hideLoader();
      },
    });
  }

  getBodegas() {
    let dataEstab = this.establecimientos.find(
      (item) => item.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      this.bodegas = dataEstab.bodegas;
      let dataBodega = this.bodegas.find((estab) => estab.defaultBodega);

      this.dataSearch.idBodega = dataBodega?.idBodega ?? 0;
      this.getDataKardex();
    }
  }

  onProductSelected($event: any) {
    let { data } = $event;
    this.dataArticulo = data;
    this.dataSearch.idArticulo = data.idArticulo;
    this.getDataKardex();
  }

  calculoTotales(prop: string) {
    let total = this.transacciones
      .map((item) => item[prop] || 0)
      .reduce((obj, cur) => Number(obj) + Number(cur), 0);
    return roundNumber(total, 3);
  }

  getDataKardex() {
    try {
      showLoader();
      let params = {
        checkBoxFecha: this.dataSearch.option === 1,
        checkBoxUltimaConsolidacion: this.dataSearch.option === 3,
        checkBoxConsolidacion: this.dataSearch.option === 2,
        movement: isValidField(this.dataSearch.tipoTransaccion),
        byBodega: isValidField(this.dataSearch.idBodega),
        byArticulo: this.dataSearch.idArticulo,
        fechaInicio: this.dataSearch.fechaInicio,
        fechaFin: this.dataSearch.fechaFin,
        estado: this.dataSearch.estado,
      };
      this.transactionSvc.getDataKardex(params).subscribe({
        next: (response) => {
          hideLoader();
          this.dataArticulo = response.dataArticulo || {};
          this.transacciones = response.kardex || [];
          if (this.transacciones.length === 0) {
            this.tS.toastr({
              type: 'warning',
              message: 'No se encontraron los resultados',
            });
          }

          this.data.cantTotalEntrada = this.calculoTotales('cantidadEntrada');
          this.data.totalEntrada = this.calculoTotales('totalEntrada');

          this.data.cantTotalSalida = this.calculoTotales('cantidadSalida');

          this.data.totalSalida = this.calculoTotales('totalSalida');

          this.data.stock = this.calculoTotales('saldo');
          this.data.totalGenetal = this.calculoTotales('totalGeneral');

          for (let value of this.transacciones) {
            value.totalGeneral = (value.precioCosto * value.saldo).toFixed(2);
          }
          this.tabulatorComponent.refTabulator.setData(this.transacciones);
        },
      });
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  }

  //Search Kardex
  searchKardex() {
    if (!(this.dataSearch.idArticulo > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Articulo',
      });
      return;
    }

    if (this.dataSearch.checkBoxFecha) {
      if (!isValidField(this.dataSearch.fechaInicio)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la Fecha de Inicio',
        });
        return;
      }
      if (!isValidField(this.dataSearch.fechaFin)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la Fecha Fin',
        });
        return;
      }
    }
    this.getDataKardex();
  }

  async getReport() {
    if (this.transacciones.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'No hay registros para el reporte',
      });
      return;
    }

    const { value: formatType } = await Swal.fire({
      icon: 'warning',
      title: 'Tipo Formato',
      input: 'radio',
      inputOptions: {
        pdf: 'PDF',
        excel: 'EXCEL',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Seleccione el Tipo de Formato!';
        }
        return null;
      },
      confirmButtonText: '<i class="mdi mdi-download"></i> Descargar',
      showDenyButton: true,
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false,
      showLoaderOnDeny: true,
      allowEscapeKey: false,
    });

    if (!formatType) return;

    let dataParams = {
      tipo: 1,
      checkBoxFecha: this.dataSearch.option === 1,
      checkBoxUltimaConsolidacion: this.dataSearch.option === 3,
      checkBoxConsolidacion: this.dataSearch.option === 2,
      movement: isValidField(this.dataSearch.tipoTransaccion),
      byBodega: isValidField(this.dataSearch.idBodega),
      byArticulo: this.dataSearch.idArticulo,
      fechaInicio: this.dataSearch.fechaInicio,
      fechaFin: this.dataSearch.fechaFin,
      estado: this.dataSearch.estado,
    };
    let parameters = {
      hasIdUsuarioRol: true,
      reportParams: JSON.stringify({
        codigo: INVENTORY_CODE_REPORT.RK,
        format: formatType,
        codEstab: this.dataSearch.codEstab,
        hasParams: true,
        aditionalParams: [],
      }),

      dataParams: JSON.stringify(dataParams),
    };

    this.sharedSvc.getReport({ data: parameters, format: formatType });
  }
}
