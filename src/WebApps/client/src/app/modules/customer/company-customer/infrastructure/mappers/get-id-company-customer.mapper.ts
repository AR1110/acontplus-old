import { ApiResponse } from '@core/models/api-response';
import { SEPARADORES_REGEX } from '@core/constants/global.constants';
import { isValidField, isValidJSON } from '@core/utils/utils';

export class GetIdCompanyCustomerMapper {
  static fromJson(response: ApiResponse) {
    let result = {} as any;
    if (response.code === '0') {
      console.log(response);
    }
    if (response.code === '1') {
      const data = JSON.parse(response.payload as string)[0];
      console.log(isValidJSON(data.dataInfoCred));
      console.log(isValidJSON(data.dataInfoCred) ? JSON.parse(data.dataInfoCred) : {});
      result = {
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
        telefono: data.telefono,
        correo: data.correo,
        estado: data.estado,
        idEmpleado: data.idEmpleado,
        diasCredito: data.diasCredito,
        empleado: data.empleado,
        idEmpresa: data.idEmpresa,
        idCargo: data.idCargo,
        placa: data.placa,
        validationSri: data.validationSri,
        codigoSri: data.codigoSri,
        correos: data.correo ? data.correo.split(SEPARADORES_REGEX) : [],
        telefonos: data.telefono ? data.telefono.split(SEPARADORES_REGEX) : [],
        placas: data.placa ? data.placa.split(SEPARADORES_REGEX) : [],
        idFormaPagoSri: data.idFormaPagoSri,
        dataInfoCred: isValidJSON(data.infoCrediticia) ? JSON.parse(data.infoCrediticia) : {},
        nota: isValidField(data.nota),
        configValorBruto: data.configValorBruto ?? false,
      };
    }

    return result;
  }
}
