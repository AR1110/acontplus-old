
import {CompanyCustomerDataForm} from "@domain/models/company-customer.model";


export class CompanyCustomerDataFormMapper {
  static  fromJson(mainData: any): CompanyCustomerDataForm  {
    return {
    tipoIdentificacion : mainData[0],
    tipoContribuyentes : mainData[1],
    tiempoCreditos : mainData[2] || [],
    ciudades : mainData[3],
    tiposCliente : mainData[4] || [],
    empresas : mainData[5] || [],
    cargos : mainData[6] || [],
    formasPagoSri : mainData[7] || [],

    }
  }


}
