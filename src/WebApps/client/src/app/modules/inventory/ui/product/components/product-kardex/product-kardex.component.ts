import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { TabulatorTable } from '@acontplus/ng-components';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';

import { TransactionService } from '@inventory/data/services/transaction.service';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import Swal from 'sweetalert2';
import { SharedService } from '@core/services/shared.service';
import { INVENTORY_CODE_REPORT } from '@inventory/domain/enums/inventory.enum';
import { formatDateToString } from '@core/utils/date.util';
import { monthEnd, monthStart } from '@formkit/tempo';
import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-product-kardex',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    ProductSearchComponent,
    DateRangeSelectionComponent,
    TabulatorTable,
    Button,
    MatCustomDialogComponent,
  ],
  templateUrl: './product-kardex.component.html',
  styles: ``,
})
export class ProductKardexComponent implements OnInit {
  params = inject<{
    id: 0;
  }>(MAT_DIALOG_DATA);
  modal = inject(MatDialogRef<ProductKardexComponent>);

  transactionSvc = inject(TransactionService);
  tS = inject(ToastrNotificationService);
  sharedSvc = inject(SharedService);

  @ViewChild(TabulatorTable) tabulatorComponent!: TabulatorTable;

  tabulatorOptions = {
    columnHeaderVertAlign: 'bottom',
  };

  establecimientos = signal<GroupedEstab[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);

  tiposTransaccion = signal<any[]>([]);

  startOfMonth: any = monthStart(new Date());
  endOfMonth: any = monthEnd(new Date());

  dataSearch = {
    codEstab: '',
    idBodega: 0,
    option: 1,
    estado: false,
    tipoTransaccion: 'all',
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

  transacciones = signal<any[]>([]);

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
    this.transactionSvc.getDataFilter().subscribe((response) => {
      this.establecimientos.set(response.estabs);
      this.tiposTransaccion.set(response.tiposTransaccion);
      const dataEstab = this.establecimientos().find((e) => e.defaultEstab);

      if (dataEstab) {
        this.bodegas.set(dataEstab.bodegas);
        this.dataSearch.codEstab = dataEstab.codEstab;
        const dataBodega = this.bodegas().find((b) => b.defaultBodega);
        if (dataBodega) {
          this.dataSearch.idBodega = dataBodega.idBodega;
        }
      }

      //set params
      this.dataSearch.idArticulo = this.params.id;
      this.getDataKardex();
    });
  }

  getBodegas() {
    const dataEstab = this.establecimientos().find(
      (item) => item.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      this.bodegas.set(dataEstab.bodegas);
      const dataBodega = this.bodegas().find((estab) => estab.defaultBodega);

      this.dataSearch.idBodega = dataBodega?.idBodega ?? 0;
      this.getDataKardex();
    }
  }

  onProductSelected($event: any) {
    const { data } = $event;
    this.dataArticulo = data;
    this.dataSearch.idArticulo = data.idArticulo;
    this.getDataKardex();
  }

  calculoTotales(prop: string) {
    const total = this.transacciones()
      .map((item) => item[prop] || 0)
      .reduce((obj, cur) => Number(obj) + Number(cur), 0);
    return roundNumber(total, 3);
  }

  getDataKardex() {
    try {
      const tipoTransaccion =
        this.dataSearch.tipoTransaccion === 'all'
          ? null
          : isValidField(this.dataSearch.tipoTransaccion);
      const params = {
        checkBoxFecha: this.dataSearch.option === 1,
        checkBoxUltimaConsolidacion: this.dataSearch.option === 3,
        checkBoxConsolidacion: this.dataSearch.option === 2,
        movement: tipoTransaccion,
        byBodega: isValidField(this.dataSearch.idBodega),
        byArticulo: this.dataSearch.idArticulo,
        fechaInicio: this.dataSearch.fechaInicio,
        fechaFin: this.dataSearch.fechaFin,
        estado: this.dataSearch.estado,
      };
      this.transactionSvc.getDataKardex(params).subscribe((response) => {
        this.dataArticulo = response.dataArticulo || {};
        this.transacciones.set(response.kardex || []);
        if (this.transacciones().length === 0) {
          this.tS.show({
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

        for (const value of this.transacciones()) {
          value.totalGeneral = (value.precioCosto * value.saldo).toFixed(2);
        }
        this.tabulatorComponent.getInstance().setData(this.transacciones());
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Search Kardex
  searchKardex() {
    if (!(this.dataSearch.idArticulo > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Articulo',
      });
      return;
    }

    if (this.dataSearch.checkBoxFecha) {
      if (!isValidField(this.dataSearch.fechaInicio)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la Fecha de Inicio',
        });
        return;
      }
      if (!isValidField(this.dataSearch.fechaFin)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la Fecha Fin',
        });
        return;
      }
    }
    this.getDataKardex();
  }

  async getReport() {
    if (this.transacciones().length === 0) {
      this.tS.show({
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

    const dataParams = {
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
    const parameters = {
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

  close() {
    this.modal.close();
  }
}
