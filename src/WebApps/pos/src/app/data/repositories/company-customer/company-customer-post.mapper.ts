
import {
  CompanyCustomerEntityPost,
} from "@data/repositories/company-customer/company-customer.entity";
import {getValidId, isValidField} from "@domain/utils/utils";


export class CompanyCustomerPostMapper  {
  static toJson(data: any): CompanyCustomerEntityPost  {

      return {
        idCliente: getValidId(data.idCliente),
        idEmpleado: getValidId(data.idEmpleado),
        idTipoIdentificacion: data.idTipoIdentificacion,
        idTipoClienteProveedor: getValidId(data.idTipoClienteProveedor),
        idTipoEntidad: getValidId(data.idTipoEntidad),
        idCiudad: getValidId(data.idCiudad),
        idSubContribuyente: getValidId(data.idSubContribuyente),
        idTiempoCredito: data.idTiempoCredito,
        idEmpresa: getValidId(data.idEmpresa),
        idCargo: getValidId(data.idCargo),
        numeroIdentificacion: data.numeroIdentificacion,
        nombreFiscal: data.nombreFiscal,
        nombreComercial: data.nombreComercial,
        direccion: isValidField(data.direccion),
        telefono: isValidField(data.telefono),
        correo: isValidField(data.correo),
        placa: isValidField(data.placa),
        montoCredito: isValidField(data.montoCredito),
        nota: isValidField(data.nota),
        validationSri: data.validationSri,
        idFormaPagoSri: getValidId(data.idFormaPagoSri),
        estado: data.estado || true
      }
  }


}
