import { CuentaPorPagarCuotaConfig } from '@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.model';

export class CuentaPorPagarValidator {
  static validarCamposCuota(obj: any): [string?, any?] {
    const { idCuentaPorPagar, tiempoCreditoId, codigoEstado } = obj;
    console.log(obj);

    if (!idCuentaPorPagar) return ['idCuentaPorPagar requerido'];
    if (!tiempoCreditoId) return ['tiempoCreditoId requerido'];
    if (!codigoEstado) return ['codigoEstado es requerido'];

    return [undefined, obj];
  }

  static validarCamposActualizarCuota<T extends { cuotas: CuentaPorPagarCuotaConfig[] }>(
    obj: T,
  ): [string?, CuentaPorPagarCuotaConfig[]?] {
    const { cuotas } = obj;
    console.log(obj);

    if (
      cuotas.some(
        val => val.nroCuota === 'E' && [null, undefined, '', 0, '0', '.', '-'].includes(val.cuota),
      )
    ) {
      return ['Ingrese el Valor de la Entrada'];
    }

    if (
      cuotas.some(
        val => [null, undefined, '', 0, '0', '.', '-'].includes(val.cuota) || val.cuota < 0,
      )
    ) {
      return ['Verifique el valor de las Cuotas'];
    }

    if (cuotas.some(val => [null, undefined, ''].includes(val.fechaVencimiento as any))) {
      return ['Ingrese las fechas de vencimiento correctamente'];
    }

    // if (fS.roundNumber($scope.totalCuota) !== fS.roundNumber($scope.infrastructure.importeTotal)) {
    //     fS.sweetAlert('warning', 'El valor total del Documento no coincide con el valor total de la Cuota')
    //     return
    // }

    return [undefined, cuotas];
  }
}
