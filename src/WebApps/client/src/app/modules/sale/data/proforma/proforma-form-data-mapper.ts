import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupEstablishments, groupEstabUtil } from '@core/utils/group-estab.util';

export class ProformaInvoiceFormDataMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    const {
      decimalSettings,
      taxPercentages,
      fees = [],
      creditTimes,
      defaultProduct,
      defaultCustomer,
      salesConfig,
      users,
      estabEmissionPoints,
      estabWarehouses,
      documentConfig,
    } = JSON.parse(response.payload as string);
    console.log(JSON.parse(response.payload as string));

    const estabs = groupEstablishments({
      emissionPoints: estabEmissionPoints,
      warehouses: estabWarehouses,
    });
    console.log(estabs);

    return {
      fees: fees.map((fee: any) => ({
        id: fee.idTarifa,
        name: fee.descripcion,
        isDefault: fee.predeterminada,
      })),
      taxRates: taxPercentages.map((tax: any) => ({
        id: tax.idTipoIva,
        taxTypeId: tax.idImpuesto,
        name: tax.descripcion,
        rate: tax.tarifa,
        code: tax.codigoPorcentaje,
      })),
      estabs,
    };
  }
}
