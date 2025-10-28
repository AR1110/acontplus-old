export class ResumenContableMapper {
  static fromApiGetAll(response: any) {
    const { anticipos } = response;

    return anticipos.map((anticipo: any) => {
      return {
        idAnticipo: anticipo.idAnticipo,
        idTipoDocumento: anticipo.idTipoDocumento,
        codEstab: anticipo.codEstab,
        fechaEmision: anticipo.fechaEmision,
        valor: anticipo.valor,
        obs: anticipo.obs,
        serieComprobante: anticipo.serieComprobante,
        identificacion: anticipo.identificacion,
        razonSocialCiente: anticipo.nombreFiscal,
        subEntidadFinanciera: anticipo.subEntidadFinanciera,
        estadoDoc: anticipo.estadoDoc,
        codDoc: anticipo.codDoc,
        usuario: anticipo.usuario,
        identificacionUsuario: anticipo.identificacionUsuario,
        totalRecords: anticipo.totalRecords,
      };
    });
  }
}
