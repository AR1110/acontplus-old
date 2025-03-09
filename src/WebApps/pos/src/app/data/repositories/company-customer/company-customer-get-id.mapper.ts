

import {
  CompanyCustomerEntitytGetId
} from "@data/repositories/company-customer/company-customer.entity";
import {STRING_SPLIT_REGEX} from "@domain/enums/main.enum";


export class CompanyCustomerGetIdMapper  {
  static fromJson(dataRepository: CompanyCustomerEntitytGetId): any  {
    let { correo, telefono, placa, ...data } = dataRepository;

    const correos = correo ? correo.split(STRING_SPLIT_REGEX) : [];
    const telefonos = telefono ? telefono.split(STRING_SPLIT_REGEX) : [];
    const placas = placa ? placa.split(STRING_SPLIT_REGEX) : [];

    return  {
      idCliente: data.idCliente,
      idTipoClienteProveedor: data.idTipoClienteProveedor,
      idTipoEntidad: data.idTipoEntidad,
      idSubContribuyente: data.idSubContribuyente,
      idTiempoCredito: data.idTiempoCredito,
      idTipoIdentificacion: data.idTipoIdentificacion,
      idCiudad: data.idCiudad,
      numeroIdentificacion: data.numeroIdentificacion,
      identificacionComprador: data.numeroIdentificacion,
      razonSocialComprador: data.nombreFiscal,
      nombreFiscal: data.nombreFiscal,
      montoCredito: data.montoCredito,
      nombreComercial: data.nombreComercial,
      direccion: data.direccion,
      estado: data.estado,
      idEmpleado: data.idEmpleado,
      empleado: data.empleado,
      idEmpresa: data.idEmpresa,
      idCargo: data.idCargo,
      validationSri: data.validationSri,
      correos,
      telefonos,
      placas,
      idFormaPagoSri: dataRepository.idFormaPagoSri,
      codigoSri: dataRepository.codigoSri
    }
  }


}
