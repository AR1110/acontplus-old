
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FORMA_PAGO_SRI_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { addDayToDate, ajustarFechaEmisionModificada, dateIsAfterCurrentDate } from '@core/utils/date.util';
import { isDateValid } from '@core/utils/format-date-moment';
import { isValidField } from '@core/utils/utils';
import { CreditTime } from '@modules/accounting/models/credit-time.model';
import { isValidGeneratorQuota } from '@modules/accounting/utils/calculate-quota.util';
import { invoiceAdapter } from '@modules/billing/adapters/invoice/invoice.adapter';
import { InvoiceService } from '@modules/billing/services/invoice.service';
import { SupportDetail } from '@modules/mechanical/models/support.model';
import { notaEntregaAdapter } from '@modules/sale/adapters/nota-entrega/nota-entrega.adapter';
import { NotaEntregaService } from '@modules/sale/services/nota-entrega.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormaPagoSri } from '@shared/models/forma-pago-sri';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { SalesDetailCalculationService } from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-convert-doc-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './convert-doc-modal.component.html',
})
export class ConvertDocModalComponent {
  @Input() params = {
    comprobante: {} as any,
    details: [],
    companyCustomer: {} as any,
    formasPagoSri: [] as FormaPagoSri[],
    tiemposCredito: [] as CreditTime[],
    config: {
      idFormaPagoSri: 0
    },
    taxPercents: [] as TarifaImpuesto[]
  }

  modal = inject(NgbActiveModal)

  private notaEntregaSvc = inject(NotaEntregaService);
  private invoiceSvc = inject(InvoiceService);
  private tS = inject(ToasterService);
  private salesDetailCalculationSvc = inject(SalesDetailCalculationService);

  companyCustomer = {
    idCliente: 0,
    idTipoIdentificacion: 0,
    identificacionComprador: null,
    razonSocialComprador: null,
    direccionComprador: null,
  }
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
  }
  dataFormaPago = {
    idFormaPagoSri: 0,
    idTiempoCredito: 0,
    total: 0
  }

  details: SupportDetail[] = []

  successResponse = (response: any) => {
    if (isApiResponse(response)) {
      if (response.code === "0") {
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
      }
      if (response.code === "1") {
        this.tS.toastr({
          type: 'success',
          message: response.message
        })
        this.modal.close(response)
      }
    }
  }

  ngOnInit(): void {

    console.log(this.params)
    this.data = {
      ...this.data,
      ...this.params.comprobante
    }
    this.details = this.params.details;
    this.companyCustomer = this.params.companyCustomer;

    let dataTiempoCredito = this.params.tiemposCredito[0];
    if (dataTiempoCredito) {
      this.data.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
      this.data.fechaVencimiento = addDayToDate(this.data.fechaEmision, dataTiempoCredito.diasCredito)
    }

    //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
    if (this.params.formasPagoSri.length > 0) {
      let dataFormaPago = this.params.formasPagoSri.find(item => {
        if (this.params.config.idFormaPagoSri > 0) {
          return (item.idFormaPagoSri === this.params.config.idFormaPagoSri);
        } else {
          return (item.codigo === FORMA_PAGO_SRI_CODE.OCUSF);
        }
      });
      if (dataFormaPago) {
        this.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
      }
    }

    this.generateSubTotals();

    this.dataFormaPago.idTiempoCredito = this.data.idTiempoCredito;
    this.dataFormaPago.total = this.data.total;

  }

  protected generateSubTotals() {
    try {
      let {
        subTotalSinImpuesto,
        htmlImpuestoTotal,
        htmlIvaTotal,
        irbpnr,
        totalIce,
        importeTotal,
        discount,
        percentageDiscount,
        propina,
      } = this.salesDetailCalculationSvc.getTaxTotals({
        items: this.details,
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
    console.log(this.companyCustomer)
    if (!(this.data.supportId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'supportId no proporcionado'
      });
    }
    if (!isValidField(this.data.codEstab)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Establecimiento'
      });
      return
    }
    if (!(this.data.idPuntoEmision > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Punto de Emisión'
      });
      return
    }
    if (!(this.data.idTiempoCredito > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Tiempo Credito'
      });
      return
    }
    if (!isDateValid(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message:
          'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
      });
      return;
    }

    let ajusteFechaEmision = ajustarFechaEmisionModificada({
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
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione la Fecha de vencimiento'
      });
      return
    }

    if (!(this.companyCustomer.idCliente > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'El cliente es requerido'
      })
    }

    if (!(this.companyCustomer.idTipoIdentificacion > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: `idTipoIdentificacion no proporcionada: ${this.companyCustomer.idTipoIdentificacion} `
      })
    }

    if (!isValidField(this.companyCustomer.identificacionComprador)) {
      this.tS.toastr({
        type: 'warning',
        message: 'identificacionComprador es requerido'
      })
      return
    }
    if (!isValidField(this.companyCustomer.razonSocialComprador)) {
      this.tS.toastr({
        type: 'warning',
        message: 'razonSocialComprador es requerido'
      })
      return
    }


    if (!(this.data.idUsuario > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Vendedor'
      })
      return
    }

    if (this.details.some((row) => row.llevaInventario && row.quantity === 0)) {
      this.tS.toastr({
        type: 'warning',
        message:
          'No es posible vender artículos con inventario cuando la cantidad es igual a 0.',
      });
      return;
    }

    if (this.details.some((row) => !(row.bodegaId > 0))) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione la bodega en el detalle de los artículos',
      });
      return;
    }

    if (this.data.total <= 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'No se puede generar el documento con valor total 0!',
      });
      return;
    }
    return true;
  }


  // validateCuota() {
  //   let objParamsCuota = {
  //     fechaEmision: $scope.data.fechaEmision,
  //     tiemposCredito: $scope.tiemposCredito,
  //     idTiempoCredito: $scope.data.idTiempoCredito,
  //     montoTotal: $scope.data.total,
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

  //   if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.data.total, 2)) {
  //     tS.toastr('warning', 'No coincide el total de la cuota con el importe total del documento.');
  //     return [];
  //   }

  //   return cuotas;
  // }

  async saveInvoice() {
    try {
      if (!this.isValidForm()) return
      let data = {
        fechaEmision: this.data.fechaEmision,
        total: this.data.total,
        tiemposCredito: this.params.tiemposCredito,
        idTiempoCredito: this.data.idTiempoCredito,
        cuotas: []
      }
      let cuotas = isValidGeneratorQuota(data);
      console.log(cuotas)
      if (cuotas.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se generó las cuotas correctamente'
        })
        return
      }


      let { isConfirmed } = await Swal.fire({
        title: "Convertir a Factura",
        text: "¿Estás seguro de convertir a factura?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!",
        cancelButtonText: 'No'
      })

      if (!isConfirmed) return



      let comprobante = {
        ...this.data,
        idCliente: this.companyCustomer.idCliente,
        idTipoIdentificacion: this.companyCustomer.idTipoIdentificacion,
        identificacionComprador: this.companyCustomer.identificacionComprador,
        razonSocialComprador: this.companyCustomer.razonSocialComprador,
        supportId: this.data.supportId
      }
      let params = {
        comprobante,
        details: this.details,
        cuotas: cuotas,
        formaPago: [this.dataFormaPago]
      }

      let senData = invoiceAdapter.mainAdapt(params)


      this.invoiceSvc.post(senData).subscribe(this.successResponse)


    } catch (error) {
      console.log(error)
    }
  }

  async saveNotaEntrega() {
    try {
      if (!this.isValidForm()) return
      let dataGenerateQuota = {
        fechaEmision: this.data.fechaEmision,
        total: this.data.total,
        tiemposCredito: this.params.tiemposCredito,
        idTiempoCredito: this.data.idTiempoCredito,
        cuotas: []
      }
      let cuotas = isValidGeneratorQuota(dataGenerateQuota);
      console.log(cuotas)
      if (cuotas.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se generó las cuotas correctamente'
        })
        return
      }


      let { isConfirmed } = await Swal.fire({
        title: "Convertir a Nota Entrega",
        text: "¿Estás seguro de convertir a Nota Entrega?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!",
        cancelButtonText: 'No'
      })

      if (!isConfirmed) return

      let comprobante = {
        ...this.data,
        idCliente: this.companyCustomer.idCliente,
        idTipoIdentificacion: this.companyCustomer.idTipoIdentificacion,
        identificacionComprador: this.companyCustomer.identificacionComprador,
        razonSocialComprador: this.companyCustomer.razonSocialComprador,
        supportId: this.data.supportId
      }
      let params = {
        comprobante,
        details: this.details,
        cuotas: cuotas
      }

      let senData = notaEntregaAdapter.mainAdapt(params)


      this.notaEntregaSvc.post(senData).subscribe(this.successResponse)

    } catch (error) {
      console.log(error)
    }
  }

}
