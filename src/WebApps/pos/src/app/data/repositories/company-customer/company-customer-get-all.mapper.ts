
import { CompanyCustomerRead} from "@domain/models/company-customer.model";
import {CompanyCustomerEntitytGetAll} from "@data/repositories/company-customer/company-customer.entity";


export class CompanyCustomerGetAllMapper  {
  static fromJson(data: CompanyCustomerEntitytGetAll[]): CompanyCustomerRead[]  {
    return data.map((item: any) => {
      return {
        idCliente: item.idCliente,
        idTipoIdentificacion: item.idTipoIdentificacion,
        numeroIdentificacion: item.numeroIdentificacion,
        nombreComercial: item.nombreComercial,
        razonSocial: item.nombreFiscal,
        direccion: item.direccion,
        telefono: item.telefono,
        correo: item.correo,
        consumidorFinal: item.consumidorFinal,
        validationSri: item.validationSri,
        estado: item.estado,
        totalRecords: item.totalRecords
      }
    })
  }


}
