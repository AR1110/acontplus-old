import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  CompanyCustomerSearch,
  SearchCompanyCustomerParams,
} from '@company-customer/domain/entities/company-customer.entity';

export class SearchCompanyCustomerMapper {
  static toJson(params: SearchCompanyCustomerParams) {
    return JSON.stringify({
      textSearch: params.textSearch,
    });
  }

  static fromJson(response: ApiResponseLegacy) {
    let customers: CompanyCustomerSearch[] = [];
    if (response?.code === '1') {
      const results = JSON.parse(response.payload as string) || [];
      customers = results.map((item: any) => ({
        idCliente: item.idCliente,
        idTipoIdentificacion: item.idTipoIdentificacion,
        idTiempoCredito: item.idTiempoCredito,
        customerId: item.customerId,
        estado: item.estado,
        correo: item.correo,
        telefono: item.telefono,
        direccion: item.direccion,
        placa: item.placa,
        diasCredito: item.diasCredito,
        validationSri: item.validationSri,
        nombreFiscal: item.nombreFiscal,
        nombreComercial: item.nombreComercial,
        numeroIdentificacion: item.numeroIdentificacion,
        tipoIdentificacion: item.tipoIdentificacion,
        codigoSri: item.codigoSri,
        rucEmpresa: item.rucEmpresa,
        companyId: item.companyId,
        identificacionComprador: item.numeroIdentificacion,
        name: item.nombreFiscal,
      }));
    }
    return customers;
  }
}
