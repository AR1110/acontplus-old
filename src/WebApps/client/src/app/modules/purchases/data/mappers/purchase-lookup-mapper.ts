import { LookupType } from '@core/models/lookup-type';

export class PurchaseLookupsMapper {
  static toJson(params: LookupType) {
    const queryParams = new URLSearchParams();
    queryParams.append(`filters[module]`, String(params.module));
    queryParams.append(`filters[context]`, String(params.context));
    return queryParams.toString();
  }

  static fromJson(response: any): any {
    const { taxes = [], establishments = [] } = response;

    const estabTemp = establishments.map((estab: any) => {
      const { metadata, ...rest } = estab;
      return rest;
    });

    const taxesTemp = taxes.map((tax: any) => {
      const { metadata, ...rest } = tax;
      const metadataTemp = JSON.parse(metadata) || {};
      return {
        ...rest,
        metadata: {
          percentage: metadataTemp.porcentage,
        },
      };
    });

    console.log(response);
    return {
      taxes: taxesTemp,
      establishments: estabTemp,
    };
  }
}
