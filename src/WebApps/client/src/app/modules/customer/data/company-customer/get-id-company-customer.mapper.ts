import {ApiResponse} from "@core/models/api-response";
import {SEPARADORES_REGEX} from "@core/constants/global.constants";

export class GetIdCompanyCustomerMapper {

  static fromJson(response:ApiResponse){
    let result = {} as any;
      if (response.code === '0') {
        console.log(response);
      }
      if (response.code === '1') {
        let dataRepository = JSON.parse(response.payload as string)[0];

        result = {
          idCliente: dataRepository.idCliente,
          idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
          idTipoEntidad: dataRepository.idTipoEntidad,
          idSubContribuyente: dataRepository.idSubContribuyente,
          idTiempoCredito: dataRepository.idTiempoCredito,
          idTipoIdentificacion: dataRepository.idTipoIdentificacion,
          idCiudad: dataRepository.idCiudad,
          numeroIdentificacion: dataRepository.numeroIdentificacion,
          identificacionComprador: dataRepository.numeroIdentificacion,
          razonSocialComprador: dataRepository.nombreFiscal,
          nombreFiscal: dataRepository.nombreFiscal,
          montoCredito: dataRepository.montoCredito,
          nombreComercial: dataRepository.nombreComercial,
          direccion: dataRepository.direccion,
          telefono: dataRepository.telefono,
          correo: dataRepository.correo,
          estado: dataRepository.estado,
          idEmpleado: dataRepository.idEmpleado,
          diasCredito: dataRepository.diasCredito,
          empleado: dataRepository.empleado,
          idEmpresa: dataRepository.idEmpresa,
          idCargo: dataRepository.idCargo,
          placa: dataRepository.placa,
          validationSri: dataRepository.validationSri,
          codigoSri: dataRepository.codigoSri,
          correos: dataRepository.correo
            ? dataRepository.correo.split(SEPARADORES_REGEX)
            : [],
          telefonos: dataRepository.telefono
            ? dataRepository.telefono.split(SEPARADORES_REGEX)
            : [],
          placas:
            dataRepository.placa !== ''
              ? dataRepository.placa.split(SEPARADORES_REGEX)
              : [],
          idFormaPagoSri: dataRepository.idFormaPagoSri,
        };
      }

    return result;
  }

}
