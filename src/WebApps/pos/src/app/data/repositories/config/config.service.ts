import { getNoLoader } from "@core/interceptors/loader.interceptor";
import { groupEstabUtil } from "@domain/utils/group-estab.util";
import { groupRoomTableUtil } from "@domain/utils/group-room-table.util";
import { indexById } from "@domain/utils/utils";
import { ApiResponse } from "@domain/models/api-response";
import { CompanyCustomerDefault } from "@domain/models/company-customer.model";
import { ConfigVenta } from "@domain/models/config-sistema.model";
import { DecimalVenta } from "@domain/models/decimal.model";
import { GroupedEstab } from "@domain/models/estab.model";
import { SubCategory } from "@domain/models/inventory/subcategory.model";
import { Tax, TaxRate } from "@domain/models/tax.model";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { PATHS, PATHS_API } from "@domain/enums/main.enum";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.RESTAURANT}${PATHS.CONFIG}`

  getMainData() {
    const json = JSON.stringify({
      tipo: 1
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let result = {
          estabs: [] as GroupedEstab[]
        }
        if (response.code === "1") {
          let { puntosEmision, bodegas } = JSON.parse(response.payload as string)
          let obj = {
            puntosEmisionEstab: puntosEmision,
            bodegasEstab: bodegas,
            isGroupBodega: true,
            isGroupPuntoEmision: true,
          };
          result.estabs = groupEstabUtil(obj)
        }
        return result;
      })
    )
  }
  getDataForm<T extends { codEstab: string }>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 2
    })

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let resultData = {
          subCategorias: [] as SubCategory[],
          roomTables: [] as any[],
          taxes: {} as Record<string | number, Tax>,
          taxRates: {} as Record<string | number, TaxRate>,
          customer: {} as CompanyCustomerDefault,
          configVenta: {} as ConfigVenta,
          decimal: {} as DecimalVenta,
          vendedores: [] as any[],
          tarifas: [] as any[]
        }
        if (response.code === "1") {
          let {
            configDecimal,
            tables,
            subCategorias,
            impuesto,
            tarifaImpuesto,
            customer,
            config,
            vendedores,
            tarifas
          } = JSON.parse(response.payload as string);

          const roomTables = groupRoomTableUtil(tables);
          const taxes = indexById<Tax>(impuesto, d => d.codigo);
          const taxRates = indexById<TaxRate>(tarifaImpuesto, d => d.codigo);
          const configVenta: ConfigVenta = config[0] || {}
          const decimal: DecimalVenta = configDecimal[0] || {};
          const customerDefault: CompanyCustomerDefault = customer && customer[0] || {}

          subCategorias = (subCategorias || []) as SubCategory[];
          resultData.subCategorias = subCategorias.map((item:any)=>{
            return {
              ...item,
              img: item.s3ObjectUrl
            }
          })
          resultData.roomTables = roomTables;
          resultData.taxes = taxes;
          resultData.taxRates = taxRates;
          resultData.customer = customerDefault;
          resultData.configVenta = configVenta;
          resultData.decimal = decimal;
          resultData.vendedores = vendedores;
          resultData.tarifas = tarifas;
        }
        return resultData;
      })
    )
  }

}
