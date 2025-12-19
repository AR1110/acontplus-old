export class WarehouseTransferGenerateSerieMapper {
  static toJson(obj: any) {
    return JSON.stringify({
      tipo: 4,
      idPuntoEmision: obj.puntoEmisionId,
    });
  }

  static fromJson(response: any): any {
    let value = null;
    if (response !== null && typeof response === 'object') {
      const { serieComprobante } = response;
      value = serieComprobante[0].serieComprobante;
    }
    return value;
  }
}
