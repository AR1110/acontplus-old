
import { Observable } from "rxjs";
import {GroupedEstab} from "@domain/models/estab.model";
import {SubCategory} from "@domain/models/inventory/subcategory.model";
import {Tax, TaxRate} from "@domain/models/tax.model";
import {CompanyCustomerDefault} from "@domain/models/company-customer.model";
import {ConfigVenta} from "@domain/models/config-sistema.model";
import {DecimalVenta} from "@domain/models/decimal.model";

export abstract class ConfigRepository {
  abstract getEstabs(): Observable<{  estabs: GroupedEstab[] }>;
  abstract getDataForm<T extends { codEstab: string }>(obj: T): Observable<{
    subCategorias:   SubCategory[],
    roomTables: any[],
    taxes:  Record<string | number, Tax>,
    taxRates:   Record<string | number, TaxRate>,
    customer:   CompanyCustomerDefault,
    configVenta:   ConfigVenta,
    decimal:  DecimalVenta,
    vendedores:   any[],
    tarifas:   any[],
    pendingOrders: number
  }>
}
