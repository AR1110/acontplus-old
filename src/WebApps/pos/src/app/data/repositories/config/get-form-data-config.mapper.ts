import {FormDataConfig, FormDataConfigParams} from "@domain/models/config.model";
import {SubCategory} from "@domain/models/inventory/subcategory.model";
import {Tax, TaxRate} from "@domain/models/tax.model";
import {CompanyCustomerDefault} from "@domain/models/company-customer.model";
import {ConfigVenta} from "@domain/models/config-sistema.model";
import {DecimalVenta} from "@domain/models/decimal.model";
import {groupRoomTableUtil} from "@domain/utils/group-room-table.util";
import {indexById} from "@domain/utils/utils";
import {ApiResponse} from "acontplus-utils";

export class GetFormDataConfigMapper {
  static toJson(params:FormDataConfigParams){
    return JSON.stringify({
      ...params,
      tipo: 2,
    });
  }

  static fromJson(response: ApiResponse): FormDataConfig{
    let resultData = new FormDataConfig();
    if (response.code === '1') {
      let {
        configDecimal,
        tables,
        subCategorias,
        impuesto,
        tarifaImpuesto,
        customer,
        config,
        vendedores,
        tarifas,

        orderCount,
      } = JSON.parse(response.payload as string);

      const roomTables = groupRoomTableUtil(tables);
      const taxes = indexById<Tax>(impuesto, (d) => d.codigo);
      const taxRates = indexById<TaxRate>(
        tarifaImpuesto,
        (d) => d.codigo,
      );
      const configVenta: ConfigVenta = config[0] || {};
      const decimal: DecimalVenta = configDecimal[0] || {};
      const customerDefault: CompanyCustomerDefault =
        (customer && customer[0]) || {};

      subCategorias = (subCategorias || []) as SubCategory[];
      resultData.subCategorias = subCategorias.map((item: any) => {
        return {
          ...item,
          img: item.s3ObjectUrl,
        };
      });
      resultData.roomTables = roomTables;
      resultData.taxes = taxes;
      resultData.taxRates = taxRates;
      resultData.customer = customerDefault;
      resultData.configVenta = configVenta;
      resultData.decimal = decimal;
      resultData.vendedores = vendedores;
      resultData.tarifas = tarifas;

      resultData.pendingOrders =
        Array.isArray(orderCount) && orderCount.length > 0
          ? orderCount[0].pendingOrders
          : 0;
    }
    return  resultData


  }
}
