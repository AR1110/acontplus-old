import { CompanyCustomerPayloadDto } from '@company-customer/domain/dtos/create-update-company-customer.payload';
import { getValidId, isValidField } from '@core/utils/utils';
import { formatDateToString } from '@core/utils/date.util';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { ApiResponse } from '@core/models/api-response';

export class CreateUpdateCompanyCustomerMapper {
  static toJson(param: any): CompanyCustomerPayloadDto {
    return {
      idCliente: getValidId(param.idCliente as number),
      idEmpleado: getValidId(param.idEmpleado as number),
      idTipoIdentificacion: param.idTipoIdentificacion,
      idTipoClienteProveedor: getValidId(param.idTipoClienteProveedor),
      idTipoEntidad: getValidId(param.idTipoEntidad),
      idCiudad: getValidId(param.idCiudad),
      idSubContribuyente: getValidId(param.idSubContribuyente),
      idTiempoCredito: getValidId(param.idTiempoCredito),
      idEmpresa: getValidId(param.idEmpresa),
      idCargo: getValidId(param.idCargo),
      numeroIdentificacion: param.numeroIdentificacion,
      nombreFiscal: param.nombreFiscal,
      nombreComercial: param.nombreComercial,
      direccion: isValidField(param.direccion),
      telefono: isValidField(param.telefono),
      correo: isValidField(param.correo),
      placa: isValidField(param.placa),
      montoCredito: isValidField(param.montoCredito),
      nota: isValidField(param.nota),
      validationSri: param.validationSri,
      idFormaPagoSri: getValidId(param.idFormaPagoSri),
      estado: param.estado ?? true,
      infoCrediticia: param.dataInfoCred && JSON.stringify(param.dataInfoCred),
      configValorBruto: param.configValorBruto ?? null,
      birthDate: isValidDate(param.birthDate) ? formatDateToString(param.birthDate) : null,
    };
  }

  static fromJson(response: ApiResponse): ApiResponse {
    if (response.code === '1') {
      const [data] = JSON.parse(response.payload as string);
      response.payload = {
        id: data.idCliente,
      };
    }
    return response;
  }
}
