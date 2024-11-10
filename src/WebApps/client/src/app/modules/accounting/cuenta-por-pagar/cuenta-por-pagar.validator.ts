export class CuentaPorPagarValidator {



  static generarCuotaCamposValido(obj: any):[string?, any?] {
    const {
      id,
      tiempoCreditoId,
      codigoEstado
    } = obj;

    if (!id) return ["id requerido"];
    if (!tiempoCreditoId) return ["tiempoCreditoId requerido"];
    if (!codigoEstado) return ["codigoEstado es requerido"];


    return [
      undefined,
      obj
    ]


  }

}
