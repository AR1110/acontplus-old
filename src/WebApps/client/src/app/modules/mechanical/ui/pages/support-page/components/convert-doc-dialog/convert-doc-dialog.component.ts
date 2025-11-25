import { Component, inject, signal, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormaPagoSri } from '@shared/models/forma-pago-sri';
import { TiempoCredito } from '@accounting/shared/models/tiempo-credito.interface';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { InvoiceService } from '@billing/services/invoice.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import { TabulatorTable } from '@acontplus/ng-components';
import { SupportDetail } from '@mechanical/domain/models/support.model';
import Swal from 'sweetalert2';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  addDayToDate,
  ajustarFechaEmisionModificada,
  dateIsAfterCurrentDate,
  isDateValid,
} from '@core/utils/date.util';
import { FORMA_PAGO_SRI_CODE } from '@core/constants/global.constants';
import { isValidField } from '@core/utils/utils';
import { isValidGeneratorQuota } from '@accounting/shared/utils/calculate-quota.util';
import { InvoiceAdapter } from '@billing/data/invoice/mappers/invoice.adapter';
import { NotaEntregaUseCase } from '@sale/application/use-cases/nota-entrega.use-case';
import { NotaEntregaMapper } from '@sale/data/nota-entrega/nota-entrega.mapper';

@Component({
  selector: 'app-convert-doc-dialog',
  imports: [MatButtonModule, MatIconModule, MatCustomDialogComponent, TabulatorTable],
  templateUrl: './convert-doc-dialog.component.html',
  styles: ``,
})
export class ConvertDocDialogComponent implements AfterViewInit, OnInit {
  readonly dialogRef = inject(MatDialogRef<ConvertDocDialogComponent>);
  readonly params: {
    comprobante: any;
    details: [];
    companyCustomer: any;
    formasPagoSri: FormaPagoSri[];
    tiemposCredito: TiempoCredito[];
    vehicle: any;
    inspection: any[];
    config: {
      idFormaPagoSri: number;
    };
    taxPercents: TarifaImpuesto[];
  } = inject<any>(MAT_DIALOG_DATA);

  private _notaEntregaUseCase = inject(NotaEntregaUseCase);
  private invoiceSvc = inject(InvoiceService);
  private tS = inject(ToastrNotificationService);
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);
  @ViewChild(TabulatorTable, { static: false })
  tabulatorComponent!: TabulatorTable;

  companyCustomer = {
    idCliente: 0,
    idTipoIdentificacion: 0,
    identificacionComprador: null,
    razonSocialComprador: null,
    direccionComprador: null,
  };
  data = {
    supportId: 0,
    codEstab: null as string | null,
    idPuntoEmision: 0,
    idTiempoCredito: 0,
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    idUsuario: 0,
    total: 0,
    subTotalSinImpuesto: 0,
    discount: 0,
    percentageDiscount: 0,
    tip: 0,
    irbpnr: 0,
    licensePlate: null as string | null,
  };
  dataFormaPago = {
    idFormaPagoSri: 0,
    idTiempoCredito: 0,
    total: 0,
  };

  details = signal<SupportDetail[]>([]);

  infoAdicionalDoc = signal<any[]>([]);

  columns = [
    {
      headerSort: false,
      resizable: false,
      frozen: true,
      headerHozAlign: 'center',
      hozAlign: 'center',
      formatter: 'rowSelection',
      titleFormatter: 'rowSelection',
      cellClick: function (e: any, cell: any) {
        cell.getRow().toggleSelect();
      },
    },
    {
      title: 'Nombre',
      field: 'name',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '40px',
    },
    {
      title: 'Valor',
      field: 'value',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '40px',
      editor: 'input',
    },
  ];

  askToDelete(data: any) {
    try {
      Swal.fire({
        html: `Esta seguro de eliminar esta información`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.infoAdicionalDoc().indexOf(data);
          this.infoAdicionalDoc().splice(index, 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  tabulatorOptions = {
    // movableRows: true,
    height: '100%',
    layout: 'fitDataStretch',
    dataTreeSelectPropagate: false,
  };

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.show({
        type: 'success',
        message: response.message,
      });
      this.dialogRef.close(response);
    }
  };

  protected convertToKeyName(data: any) {
    const adicionales = [];
    for (const item of data) {
      for (const arr of Object.entries(item)) {
        const [name, value] = arr;

        adicionales.push({
          name,
          value,
        });
      }
    }
    return adicionales;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const allRows = this.tabulatorComponent.getInstance().getRows();
      this.tabulatorComponent.getInstance().selectRow(allRows);
    });
  }

  ngOnInit(): void {
    this.data = {
      ...this.data,
      ...this.params.comprobante,
    };
    this.details.set(this.params.details);
    this.companyCustomer = this.params.companyCustomer;

    const dataTiempoCredito = this.params.tiemposCredito[0];
    if (dataTiempoCredito) {
      this.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
      this.data.fechaVencimiento = addDayToDate(
        this.data.fechaEmision,
        dataTiempoCredito.diasCredito,
      );
    }

    //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
    if (this.params.formasPagoSri.length > 0) {
      const dataFormaPago = this.params.formasPagoSri.find((item) => {
        if (this.params.config.idFormaPagoSri > 0) {
          return item.idFormaPagoSri === this.params.config.idFormaPagoSri;
        } else {
          return item.codigo === FORMA_PAGO_SRI_CODE.OCUSF;
        }
      });
      if (dataFormaPago) {
        this.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
      }
    }

    this.generateSubTotals();

    this.dataFormaPago.idTiempoCredito = this.data.idTiempoCredito;
    this.dataFormaPago.total = this.data.total;

    // InfoAdicional
    const vehicle = this.params.vehicle;
    const inspection = this.params.inspection;

    const adicionalVehicle = this.convertToKeyName(vehicle);
    const adicionalInspection = this.convertToKeyName(inspection);
    this.infoAdicionalDoc.set([...adicionalVehicle, ...adicionalInspection]);
  }

  protected generateSubTotals() {
    try {
      const { subTotalSinImpuesto, importeTotal, discount, percentageDiscount, propina } =
        this.salesDetailCalculationSvc.getTaxTotals({
          items: this.details(),
          tarifasImpuesto: this.params.taxPercents,
        });

      this.data.subTotalSinImpuesto = subTotalSinImpuesto;
      this.data.total = importeTotal;
      this.data.discount = discount;
      this.data.percentageDiscount = percentageDiscount;
      this.data.tip = propina;
    } catch (error) {
      console.log(error);
    }
  }

  isValidForm() {
    if (!(this.data.supportId > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'supportId no proporcionado',
      });
    }
    if (!isValidField(this.data.codEstab)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }
    if (!(this.data.idPuntoEmision > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Punto de Emisión',
      });
      return;
    }
    if (!(this.data.idTiempoCredito > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Tiempo Credito',
      });
      return;
    }
    if (!isDateValid(this.data.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(this.data.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
      });
      return;
    }

    const ajusteFechaEmision = ajustarFechaEmisionModificada({
      fechaEmision: this.data.fechaEmision,
      setHoursZero: true,
    });

    if (ajusteFechaEmision) {
      this.data.fechaEmision = ajusteFechaEmision;
    } else {
      console.log('Error al justar la fecha de Emisión');
      return;
    }

    if (!isDateValid(this.data.fechaVencimiento)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la Fecha de vencimiento',
      });
      return;
    }

    if (!(this.companyCustomer.idCliente > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'El cliente es requerido',
      });
    }

    if (!(this.companyCustomer.idTipoIdentificacion > 0)) {
      this.tS.show({
        type: 'warning',
        message: `idTipoIdentificacion no proporcionada: ${this.companyCustomer.idTipoIdentificacion} `,
      });
    }

    if (!isValidField(this.companyCustomer.identificacionComprador)) {
      this.tS.show({
        type: 'warning',
        message: 'identificacionComprador es requerido',
      });
      return;
    }
    if (!isValidField(this.companyCustomer.razonSocialComprador)) {
      this.tS.show({
        type: 'warning',
        message: 'razonSocialComprador es requerido',
      });
      return;
    }

    if (!(this.data.idUsuario > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Vendedor',
      });
      return;
    }

    if (this.details().some((row) => row.llevaInventario && row.quantity === 0)) {
      this.tS.show({
        type: 'warning',
        message: 'No es posible vender artículos con inventario cuando la cantidad es igual a 0.',
      });
      return;
    }

    if (this.details().some((row) => !(row.bodegaId > 0))) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la bodega en el detalle de los artículos',
      });
      return;
    }

    if (this.data.total <= 0) {
      this.tS.show({
        type: 'warning',
        message: 'No se puede generar el documento con valor total 0!',
      });
      return;
    }
    return true;
  }

  // validateCuota() {
  //   let objParamsCuota = {
  //     fechaEmision: $scope.infrastructure.fechaEmision,
  //     tiemposCredito: $scope.tiemposCredito,
  //     idTiempoCredito: $scope.infrastructure.idTiempoCredito,
  //     montoTotal: $scope.infrastructure.total,
  //     cuotas: $scope.cuotas
  //   }
  //   let cuotas = [];
  //   let montoTotalCuota = 0;

  //   if (isRegister()) {
  //     let dataCuota = fS.calcularCuotas(objParamsCuota);
  //     cuotas = dataCuota.cuotas;
  //     montoTotalCuota = dataCuota.montoTotalCuota;

  //   }
  //   if (isUpdate()) {
  //     let dataCuota = fS.updateCuotas(objParamsCuota)
  //     cuotas = dataCuota.cuotas;
  //     montoTotalCuota = dataCuota.montoTotalCuota;
  //   }

  //   if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.infrastructure.total, 2)) {
  //     tS.toastr('warning', 'No coincide el total de la cuota con el importe total del documento.');
  //     return [];
  //   }

  //   return cuotas;
  // }

  async saveInvoice() {
    try {
      if (!this.isValidForm()) return;
      const data = {
        fechaEmision: this.data.fechaEmision,
        total: this.data.total,
        tiemposCredito: this.params.tiemposCredito,
        idTiempoCredito: this.data.idTiempoCredito,
        cuotas: [],
      };
      const cuotas = isValidGeneratorQuota(data);

      if (cuotas.length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'No se generó las cuotas correctamente',
        });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: 'Convertir a Factura',
        text: '¿Estás seguro de convertir a factura?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No',
      });

      if (!isConfirmed) return;

      const details = this.details().map((item) => {
        return {
          ...item,
          taxId: item.idImpuesto,
          taxPercentId: item.idTipoIva,
        };
      });

      const comprobante = {
        ...this.data,
        idCliente: this.companyCustomer.idCliente,
        idTipoIdentificacion: this.companyCustomer.idTipoIdentificacion,
        identificacionComprador: this.companyCustomer.identificacionComprador,
        razonSocialComprador: this.companyCustomer.razonSocialComprador,
        supportId: this.data.supportId,
      };

      const selectedData = this.tabulatorComponent.getInstance().getSelectedData();

      const params = {
        comprobante,
        details,
        cuotas: cuotas,
        formaPago: [this.dataFormaPago],
        infoAdicionalDoc: selectedData,
      };

      const senData = InvoiceAdapter.mainAdapt(params);

      this.invoiceSvc.post(senData).subscribe(this.successResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async saveNotaEntrega() {
    try {
      if (!this.isValidForm()) return;
      const dataGenerateQuota = {
        fechaEmision: this.data.fechaEmision,
        total: this.data.total,
        tiemposCredito: this.params.tiemposCredito,
        idTiempoCredito: this.data.idTiempoCredito,
        cuotas: [],
      };
      const cuotas = isValidGeneratorQuota(dataGenerateQuota);

      if (cuotas.length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'No se generó las cuotas correctamente',
        });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: 'Convertir a Nota Entrega',
        text: '¿Estás seguro de convertir a Nota Entrega?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No',
      });

      if (!isConfirmed) return;

      const details = this.details().map((item) => {
        return {
          ...item,
          taxId: item.idImpuesto,
          taxPercentId: item.idTipoIva,
        };
      });

      const comprobante = {
        ...this.data,
        idCliente: this.companyCustomer.idCliente,
        idTipoIdentificacion: this.companyCustomer.idTipoIdentificacion,
        identificacionComprador: this.companyCustomer.identificacionComprador,
        razonSocialComprador: this.companyCustomer.razonSocialComprador,
        supportId: this.data.supportId,
      };

      const selectedData = this.tabulatorComponent.getInstance().getSelectedData();

      const params = {
        comprobante,
        details,
        cuotas: cuotas,
        infoAdicionalDoc: selectedData,
      };

      const senData = NotaEntregaMapper.toApiSave(params);

      this._notaEntregaUseCase.post(senData).subscribe(this.successResponse);
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
