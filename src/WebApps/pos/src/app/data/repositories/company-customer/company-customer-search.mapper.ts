
import { CompanyCustomerEntitySearch,
} from "@data/repositories/company-customer/company-customer.entity";
import {CompanyCustomerSearch} from "@domain/models/company-customer.model";


export class CompanyCustomerSearchMapper  {
  static fromJson(data: CompanyCustomerEntitySearch[]): CompanyCustomerSearch[]  {
    return data.map((item) => {
      return {
        customerId: item.customerId,
        idCliente: item.idCliente,
        razonSocialComprador: item.nombreFiscal,
        identificacionComprador: item.numeroIdentificacion,
        nombreComercial: item.nombreComercial,
        name: item.nombreComercial,
        codigoSri: item.codigoSri
      }
    })
  }


}
