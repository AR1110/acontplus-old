import { MatIconModule } from '@angular/material/icon';
import { Component, inject, Input, OnInit } from '@angular/core';

import { FormaCobroModalComponent } from '@accounting/ui/comprobante-ingreso/components/forma-cobro-modal/forma-cobro-modal.component';
import { MatTableModule } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { roundNumber } from '@core/utils/round-number.utils';
import ComprobanteIngresoUtil, {
  getPaymentSubTotales,
} from '@accounting/shared/utils/comprobante-ingreso.util';
import {
  MultiplesPaymentType,
  PaymentData,
  PaymentDetail,
  PaymentHistory,
} from '@accounting/data/models/comprobante-ingreso';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { ComprobanteIngresoUseCase } from '@accounting/data/comprobante-ingreso.use-case';
import { CuentaPorCobrarUseCase } from '@accounting/data/cuenta-por-cobrar.use-case';
import { DynamicCard } from '@acontplus/ng-components';
import { MatButton } from '@angular/material/button';
import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-comprobante-ingreso-lote-modal',
  imports: [MatTableModule, MatIconModule, DynamicCard, MatButton, Button],
  templateUrl: './comprobante-ingreso-lote-modal.component.html',
  styleUrl: './comprobante-ingreso-lote-modal.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComprobanteIngresoLoteModalComponent implements OnInit {
  params = inject<{
    data: any;
    selectedDocumentos: any[];
  }>(MAT_DIALOG_DATA);

  modal = inject(MatDialogRef<ComprobanteIngresoLoteModalComponent>);
  modalSvc = inject(DialogService);
  tS = inject(ToastrNotificationService);
  private _comprobanteIngresoUseCase = inject(ComprobanteIngresoUseCase);
  private _cuentaPorCobrarUseCase = inject(CuentaPorCobrarUseCase);

  columnsToDisplay = [
    'expand',
    'tipoDoc',
    'serieComprobante',
    'identificacionComprador',
    'razonSocialComprador',
    'total',
  ];

  columnsMultiplesPaymentType = [
    'index',
    'op',
    'fechaEmision',
    'subEntidadFinanciera',
    'valorAbono',
    'valorAbonoCuota',
  ];

  dataFormaCobro = {};
  tipoDocumentos: any[] = [];
  selectedDocumentos: any[] = [];
  comprobante = {} as any;

  multiplesPaymentType: MultiplesPaymentType[] = [];
  paymentDetails: PaymentDetail[] = [];
  historialCuentas: PaymentHistory[] = [];

  data = {
    importeTotal: 0,
    totalSaldo: 0,
    totalAbonoAnterior: 0,
    totalMora: 0,
    totalSaldoDoc: 0,
    totalValorAbono: 0,
    valorCambio: 0,
  };

  expandedElement: any | null;

  getTotalesCuota() {
    let importeTotal = 0,
      abono = 0,
      saldo = 0,
      totalMora = 0,
      totalSaldoDoc = 0;
    for (const item of this.selectedDocumentos) {
      importeTotal += item.importeTotal;
      saldo += item.saldo;
      abono += item.abono;
      totalMora += item.mora || 0;
      totalSaldoDoc += item.saldoDoc || 0;
    }
    this.data.importeTotal = roundNumber(importeTotal, 5);
    this.data.totalSaldo = roundNumber(saldo, 5);
    this.data.totalAbonoAnterior = roundNumber(abono, 5);
    this.data.totalMora = roundNumber(totalMora, 5);
    this.data.totalSaldoDoc = roundNumber(totalSaldoDoc, 5);
    this.data.totalValorAbono = 0;
    this.data.valorCambio = 0;

    this.comprobante.importeTotal = this.data.importeTotal;
    this.comprobante.abono = this.data.totalAbonoAnterior;
    this.comprobante.saldo = this.data.totalSaldo;
    this.comprobante.totalMora = this.data.totalMora;
  }

  loadInitialData() {
    try {
      const { data, selectedDocumentos } = this.params;
      let idCuentaPorCobrar = null,
        idCliente = 0;
      if (Object.prototype.toString.call(data) === '[object Object]') {
        idCuentaPorCobrar = data.idCuentaPorCobrar;
        idCliente = data.idCliente;
      }
      if (selectedDocumentos !== null && Array.isArray(selectedDocumentos)) {
        idCliente = selectedDocumentos[0].idCliente;
      }
      this._cuentaPorCobrarUseCase
        .getDataForm(idCuentaPorCobrar, idCliente)
        .subscribe((response) => {
          this.dataFormaCobro = response;

          if (selectedDocumentos && Array.isArray(selectedDocumentos)) {
            this.tipoDocumentos = structuredClone(selectedDocumentos);
            this.selectedDocumentos = selectedDocumentos;

            const dataSelectedDoc = selectedDocumentos[0];
            this.comprobante = {
              idCliente: dataSelectedDoc.idCliente,
              razonSocialComprador: dataSelectedDoc.razonSocialComprador,
              codEstab: dataSelectedDoc.codEstab,
              identificacionComprador: dataSelectedDoc.identificacionComprador,
            };
          }
          this.getTotalesCuota();
        });
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {
    this.loadInitialData();
  }

  openModalFormaCobro() {
    if (this.data.totalSaldo <= 0) {
      this.tS.show({
        type: 'warning',
        message: 'No hay cuotas pendientes.',
      });
      return;
    }

    const modalRef = this.modalSvc.open(FormaCobroModalComponent, {
      size: 'lg',
      data: {
        dataFormaCobro: this.dataFormaCobro,
        comprobante: this.comprobante,
        saldo: this.data.totalSaldo,
        multiplesPaymentType: this.multiplesPaymentType,
      },
    });

    modalRef.subscribe((dataPaymentTypeForm: PaymentData) => {
      if (dataPaymentTypeForm !== null && typeof dataPaymentTypeForm === 'object') {
        try {
          const { posFechado, valorAbono } = dataPaymentTypeForm;

          const tempPaymentDetails = structuredClone(this.paymentDetails);

          const sequential = this.multiplesPaymentType.length + 1;
          const comprobanteIngresoUtil = new ComprobanteIngresoUtil(sequential);
          comprobanteIngresoUtil.setReceivedAmount(Number(valorAbono), posFechado);
          comprobanteIngresoUtil.setPaymentDetail(tempPaymentDetails);

          const modifiedQuotas = comprobanteIngresoUtil.applyReceivedAmountToQuota(
            this.selectedDocumentos,
          );
          const resultPaymentDetails = comprobanteIngresoUtil.paymentDetails;

          const payingAmount = resultPaymentDetails
            .filter((item) => item.secuencial === sequential)
            .reduce((prev, curr) => prev + curr.abono, 0);

          ((dataPaymentTypeForm.abonoCuota = roundNumber(payingAmount, 2)),
            (dataPaymentTypeForm.secuencial = sequential));

          const tempMultiplesPaymentType = [
            ...this.multiplesPaymentType,
            dataPaymentTypeForm,
          ] as MultiplesPaymentType[];
          const dataSubTotal = getPaymentSubTotales(
            modifiedQuotas,
            tempMultiplesPaymentType,
            this.comprobante,
          );

          this.multiplesPaymentType = tempMultiplesPaymentType;

          this.selectedDocumentos = modifiedQuotas;

          this.paymentDetails = resultPaymentDetails;
          this.historialCuentas = comprobanteIngresoUtil.historialCuentas;

          this.data.totalValorAbono = roundNumber(dataSubTotal.totalValorAbono, 5);
          this.data.totalSaldo = roundNumber(dataSubTotal.totalSaldo, 5);

          this.data.valorCambio = roundNumber(dataSubTotal.valorCambio, 5);

          this.tS.show({
            type: 'success',
            message: 'Agregado Correctamente',
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            html: `<small>Algo salio mal: ${error}</small>`,
          });
          console.log(error);
        }
      }
    });
  }

  showCobroDetalle(data: any) {
    const tempDetails = this.paymentDetails.filter(
      (item) =>
        item.idCuotaPorCobrar === data.idCuotaPorCobrar &&
        item.idCuentaPorCobrar === data.idCuentaPorCobrar,
    );
    const infoCobrosDetalle = [];

    for (const pd of tempDetails) {
      if (pd.abono > 0) {
        const datoCobro = this.multiplesPaymentType.find(
          (item) => item.secuencial === pd.secuencial,
        );
        infoCobrosDetalle.push({
          ...pd,
          subEntidadFinanciera: datoCobro?.paymentSubTypeName,
          posFechado: datoCobro?.posFechado ? 'SI' : 'NO',
        });
      }
    }

    let index = 1;
    let message = '';

    message = `<table class="table table-bordered table-sm">
                                <thead>
                                    <tr class="small">
                                        <th>N°</th>
                                        <th>Entidad Financiera</th>
                                        <th>Abono</th>
                                        <th>Saldo</th>
                                        <th>PosFechado</th>
                                    </tr>
                                </thead>
                                <tbody>`;
    for (const item of infoCobrosDetalle) {
      message += `<tr class="small">
                                    <td>${index++}</td>
                                    <td>${item.subEntidadFinanciera}</td>
                                    <td>${item.abono}</td>
                                    <td>${item.saldo}</td>
                                    <td>${item.posFechado}</td>
                                </tr>`;
    }
    message += `</tbody></table>`;

    Swal.fire({
      icon: 'info',
      title: `<span>Cuota ${data.nroCuota}:</span> $${data.cuota} <br> <span>Mora:</span> $${data.mora}`,
      width: 600,
      html: message,
    });
  }

  showInfo = function (item: MultiplesPaymentType) {
    Swal.fire({
      icon: 'info',
      html: `<div class="table-responsive">
            <table class="table table-hover table-borderless table-sm">
                <tbody>
                    <tr>
                        <td><b>Número:</b></td>
                        <td>${item.nro || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Referencia:</b></td>
                        <td>${item.referencia || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Lote:</b></td>
                        <td>${item.lote || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Aprobación:</b></td>
                        <td>${item.aprobacion || '...'}</td>
                    </tr>
                </tbody>
            </table>
        </div>`,
    });
  };

  removePaymentType(secuencial: number) {
    try {
      Swal.fire({
        html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          let paymentDetails: PaymentDetail[] = [];
          let historialCuentas: PaymentHistory[] = [];

          const tempMultiplesPaymentType = this.multiplesPaymentType.filter(
            (mp) => mp.secuencial !== secuencial,
          );

          //Todas las cuotas en su estado original
          let tempCuentasPorCobrar = this.selectedDocumentos.map((vc) => ({
            ...vc,
            cuotas: structuredClone(vc.cuotasOriginal),
          }));

          let sequential = 0;
          for (const item of tempMultiplesPaymentType) {
            sequential++;

            const comprobanteIngresoUtil = new ComprobanteIngresoUtil(sequential);
            comprobanteIngresoUtil.setReceivedAmount(Number(item.valorAbono), item.posFechado);
            comprobanteIngresoUtil.setPaymentDetail(paymentDetails);

            tempCuentasPorCobrar =
              comprobanteIngresoUtil.applyReceivedAmountToQuota(tempCuentasPorCobrar);
            paymentDetails = comprobanteIngresoUtil.paymentDetails;
            historialCuentas = comprobanteIngresoUtil.historialCuentas;
          }
          const dataSubTotal = getPaymentSubTotales(
            tempCuentasPorCobrar,
            tempMultiplesPaymentType,
            this.comprobante,
          );

          this.selectedDocumentos = tempCuentasPorCobrar;

          this.multiplesPaymentType = tempMultiplesPaymentType;

          this.paymentDetails = paymentDetails;
          this.historialCuentas = historialCuentas;

          this.data.totalValorAbono = roundNumber(dataSubTotal.totalValorAbono, 5);
          this.data.totalSaldo = roundNumber(dataSubTotal.totalSaldo, 5);

          this.data.valorCambio = roundNumber(dataSubTotal.valorCambio, 5);

          this.tS.show({
            type: 'success',
            message: 'Eliminado correctamente',
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  save() {
    try {
      if (!(this.comprobante.idCliente > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el cliente',
        });

        return;
      }
      if (this.multiplesPaymentType.length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese al menos un abono',
        });
        return;
      }

      if (this.paymentDetails.length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'Cobro detalle vacio!',
        });
        return;
      }

      Swal.fire({
        title: '<small>Guardar Cobro</small>',
        html: "<small class='text-muted'>Esta seguro de guardar este cobro ahora?</small>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, guardar!',
        cancelButtonText: 'No, cancelar!',
      }).then((result) => {
        if (result.isConfirmed) {
          const comprobante = {
            idCliente: this.comprobante.idCliente,
            total: this.multiplesPaymentType.reduce((acc, curr) => acc + curr.valorAbono, 0),
            abono: this.multiplesPaymentType.reduce((acc, curr) => acc + curr.abonoCuota, 0),
            codEstab: this.comprobante.codEstab,
            numeroIdentificacion: this.comprobante.identificacionComprador,
            nombreFiscal: this.comprobante.razonSocialComprador,
          };

          const cobros = this.multiplesPaymentType.map((item) => {
            const obj = {
              idSubEntidadFinanciera: item.idSubEntidadFinanciera,
              idEntidadFinanciera: item.idEntidadFinanciera,
              idBanco: item.idBanco,
              idCuentaBancaria: 0,
              fechaEmision: item.fechaEmision,
              valor: item.valorAbono,
              posfechado: item.posFechado,
              secuencial: item.secuencial,
              infoCobro: item.infoCobro,
              abono: item.abonoCuota,
              controlCaja: item.controlCaja,
              idComprobante: item.idComprobante,
              idTipoDocumento: item.idTipoDocumento,
            };
            return obj;
          });

          const data = {
            comprobante,
            cobros,
            cobroDetalle: this.paymentDetails.filter((item) => item.abono > 0),
            historialCobros: this.historialCuentas,
          };

          // let params = comprobanteIngresoAdapter.to(infrastructure);

          this._comprobanteIngresoUseCase.create(data).subscribe((response) => {
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
              this.modal.close(response);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  protected readonly close = close;
}
