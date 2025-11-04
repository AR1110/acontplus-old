import { roundNumber } from '@core/utils/round-number.utils';
import { FieldDefinitionDetailSale } from '@shared/models/field-definition-detail-sale.model';

class ImpuestoDetailAdapter {
  to(details: FieldDefinitionDetailSale[]) {
    const impuestosTarifa = details.map((item) => {
      const obj = {
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        percent: item.percentage,
        taxBase: roundNumber(item.precioTotalSinImpuesto, 5),
        taxValue: roundNumber(item.taxValue, 5),
        discount: roundNumber(item.discount, 5),
      };
      return obj;
    });
    return impuestosTarifa;
  }
}

export const impuestoDetailAdapter = new ImpuestoDetailAdapter();
