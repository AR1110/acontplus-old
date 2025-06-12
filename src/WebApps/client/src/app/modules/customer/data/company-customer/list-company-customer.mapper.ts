import {ApiResponse} from "@core/models/api-response";
import {ListCompanyCustomerResponse} from "@customer/domain/models/company-customer";

export class ListCompanyCustomerMapper {

  static toJson(params:any){
    return JSON.stringify({
      ...params,
      tipo: 1,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    });
  }

  static fromJson(response:ApiResponse):ListCompanyCustomerResponse{

    const result = new ListCompanyCustomerResponse();
    const [data] = JSON.parse(response.payload as string);
    console.log(JSON.parse(response.payload as string))
    result.data = data.map((item: any, index:number) => {
      return {
        index: index+1,
        idCliente: item.idCliente,
        idTipoIdentificacion: item.idTipoIdentificacion,
        identificacionComprador: item.numeroIdentificacion,
        razonSocialComprador: item.nombreFiscal,
        nombreComercial: item.nombreComercial,
        direccion: item.direccion,
        telefono: item.telefono,
        correo: item.correo,
        consumidorFinal: item.consumidorFinal,
        nomValidationSri: item.validationSri?'SI': 'N0',
        tipoIdentificacion: item.tipoIdentificacion,
        estado: item.estado,
        nomEstado: item.estado?'Activo': 'Inactivo',
        esConsumidorFinal: item.codTipoIdentificacion === 'CF',
        totalRecords: item.totalRecords,
      };
    });
    result.totalRecords = result.data.length>0? result.data[0].totalRecords: 0;
    return result;

  }

}
