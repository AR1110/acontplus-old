import { LookupType } from '@core/models/lookup-type';
import { PurchaseLookupResponse } from '../models/purchase-lookup';

export class PurchaseLookupsMapper {
  static toJson(params: LookupType) {
    const queryParams = new URLSearchParams();
    queryParams.append(`filters[module]`, String(params.module));
    queryParams.append(`filters[context]`, String(params.context));
    return queryParams.toString();
  }

  static fromJson(response: any): PurchaseLookupResponse {
    const { establishments = [], subcategories = [] } = response;

    const estabTemp = establishments.map((estab: any) => {
      const { metadata, ...rest } = estab;
      return rest;
    });

    return {
      establishments: estabTemp,
      subcategories,
    };
  }
}
