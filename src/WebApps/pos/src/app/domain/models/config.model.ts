import {SubCategory} from "@domain/models/inventory/subcategory.model";
import {Tax, TaxRate} from "@domain/models/tax.model";
import {CompanyCustomerDefault} from "@domain/models/company-customer.model";
import {ConfigVenta} from "@domain/models/config-sistema.model";
import {DecimalVenta} from "@domain/models/decimal.model";
import {GroupedEstab} from "@domain/models/estab.model";

export class FormDataConfig {
  subCategorias:   SubCategory[]=[]
  roomTables: any[]=[]
  taxes:  Record<string | number, Tax>={}
  taxRates:   Record<string | number, TaxRate>={}
  customer = {} as  CompanyCustomerDefault
  configVenta= {} as  ConfigVenta
  decimal = {} as  DecimalVenta;
  vendedores:   any[]=[]
  tarifas:   any[]=[]
  pendingOrders: number =0
}

export interface FormDataConfigResponse {
  data?: FormDataConfig;
}

export interface FormDataConfigParams{
  codEstab: string
}


export interface GetEstabsResponse {
  estabs: GroupedEstab[]
}
