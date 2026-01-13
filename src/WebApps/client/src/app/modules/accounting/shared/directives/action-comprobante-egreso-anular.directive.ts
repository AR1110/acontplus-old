import { Directive, HostListener, inject, input, output } from '@angular/core';
import { COMPROBANTE_EGRESO_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { getValidId } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { roundNumber } from '@core/utils/round-number.utils';
import DecimalUtils from '@core/utils/decimal.util';

@Directive({
  selector: '[appActionComprobanteEgresoAnular]',
})
export class ActionComprobanteEgresoAnularDirective {
  private comprobanteEgresoHttp = inject(COMPROBANTE_EGRESO_HTTP_TOKEN);

  id = input(0);
  cantDocs = input(0);
  handleResult = output();

  @HostListener('click') async onClick() {
    if (!getValidId(this.id())) {
      Swal.fire({
        icon: 'warning',
        text: 'unique es required',
      });
      return;
    }

    let isContinue = true;

    if (getValidId(this.cantDocs())) {
      isContinue = await this.messageQtyDoc();
    }

    if (!isContinue) return;

    this.comprobanteEgresoHttp.getDataForDeletion(this.id()).subscribe(async (response) => {
      const { cuentas, cuotas, estadosPago } = response;
      if (cuentas.length === 0 || cuotas.length === 0) {
        console.log('cuentasPorPagar', cuentas);
        console.log('cuotas', cuotas);
        return;
      }

      const { isConfirmed, value } = await Swal.fire({
        icon: 'warning',
        html: '<small>Esta seguro/a de Anular este registro de pago ahora?</small>',
        input: 'text',
        inputPlaceholder: 'Ingrese la observación',
        showConfirmButton: true,
        confirmButtonText: 'Sí, anular',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar!',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'Ingrese la Observación!';
          }
          if (value.length <= 8) {
            return 'La observación tiene que tener al menos 10 caracteres!';
          }
          return value;
        },
      });

      if (!isConfirmed) return;

      const dataParams = this.getDataParams(cuentas, cuotas, estadosPago);
      const data = {
        observacion: value,
        ...dataParams,
      };

      this.comprobanteEgresoHttp
        .anular({
          data,
          id: this.id(),
        })
        .subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              text: response.message,
            });
            return;
          }

          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              text: response.message,
              timer: 1000,
            });
            this.handleResult.emit();
          }
        });
    });
  }

  async messageQtyDoc() {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      text: 'Este anulación de comprobante afectará mas de un doc. porque se ha realizado cobro por lote ¿Desea continuar? ',
    });
    return isConfirmed;
  }

  /**
   *
   * @param {*} codigoEstadoPago
   * @param {*} estadosPago
   * @returns
   */
  getDataIdEstadoPago(codigoEstadoPago: string, estadosPago: any[]) {
    const dataEstadoPago = estadosPago.find((ep) => ep.codigo === codigoEstadoPago);
    return dataEstadoPago ? dataEstadoPago.idEstadoPago : 0;
  }

  /**
   *
   * @param {*} cuentas
   * @param {*} cuotas
   * @param {*} estadosPago
   * @returns
   */
  private getDataParams(cuentas: any[], cuotas: any[], estadosPago: any[]) {
    // Agrupa cuentas por pagar
    const cuentasAgrupado = cuentas.reduce((acc, curr) => {
      const existeDato = acc.find(
        (dataCxc: any) => dataCxc.idCuentaPorPagar === curr.idCuentaPorPagar,
      );

      const abono = curr.abono;

      if (!existeDato) {
        acc.push({
          idCuentaPorPagar: curr.idCuentaPorPagar,
          abonoDoc: curr.abonoDoc,
          abono,
        });
      } else {
        existeDato.abono = DecimalUtils.addAsNumber(existeDato.abono, curr.abono);
      }
      return acc;
    }, []);

    // Agrupa cuotas por pagar
    const cuotasAgrupado = cuotas.reduce((acc, curr) => {
      const existeDato = acc.find(
        (dataCxc: any) => dataCxc.idCuotaPorPagar === curr.idCuotaPorPagar,
      );

      const abono = curr.abono;

      if (!existeDato) {
        acc.push({
          idCuotaPorPagar: curr.idCuotaPorPagar,
          abonoCuota: curr.abonoCuota,
          abono,
        });
      } else {
        existeDato.abono = DecimalUtils.addAsNumber(existeDato.abono, curr.abono);
      }
      return acc;
    }, []);

    // Calcula los valores residuales y el estado de pago para cuentas por cobrar
    const tempCuentasPorPagar = cuentasAgrupado.map((item: any) => {
      //let valorResiduo = fS.minus(item.abonoDoc,item.abono).toNumber()
      const valorResiduo = DecimalUtils.subtractAsNumber(item.abonoDoc, item.abono);

      //quitar cuando se haya validado bien tema de decimales en compras
      const abonoDocRounded = roundNumber(item.abonoDoc, 2);
      const abonoRounded = roundNumber(item.abono, 2);
      const valorResiduoValidar = DecimalUtils.subtractAsNumber(abonoDocRounded, abonoRounded, 2);

      return {
        idCuentaPorPagar: item.idCuentaPorPagar,
        abono: valorResiduo,
        idEstadoPago: this.getDataIdEstadoPago(
          valorResiduoValidar === 0 ? 'PE' : 'PP',
          estadosPago,
        ),
      };
    });

    // Calcula los valores residuales y el estado de pago para cuotas por cobrar
    const tempCuotasPorCobrar = cuotasAgrupado.map((item: any) => {
      const valorResiduo = DecimalUtils.subtractAsNumber(item.abonoCuota, item.abono);

      return {
        idCuotaPorPagar: item.idCuotaPorPagar,
        abono: valorResiduo,
        idEstadoPago: this.getDataIdEstadoPago(valorResiduo === 0 ? 'PE' : 'PP', estadosPago),
      };
    });

    // Retorna los datos agrupados y calculados
    return {
      cuenta: tempCuentasPorPagar,
      cuota: tempCuotasPorCobrar,
    };
  }
}
