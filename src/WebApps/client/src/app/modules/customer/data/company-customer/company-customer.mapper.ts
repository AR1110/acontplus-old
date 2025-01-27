import {getValidId, isValidField} from "@core/utils/utils";


export class CompanyCustomerMapper {
  static fromApiGetAll(response:any){
    const [data] = response;
    return   data.map((item: any) => {
      let obj = {
        idCliente: item.idCliente,
        idTipoIdentificacion: item.idTipoIdentificacion,
        identificacionComprador: item.numeroIdentificacion,
        razonSocialComprador: item.nombreFiscal,
        nombreComercial: item.nombreComercial,
        direccion: item.direccion,
        telefono: item.telefono,
        correo: item.correo,
        consumidorFinal: item.consumidorFinal,
        validationSri: item.validationSri,
        tipoIdentificacion: item.tipoIdentificacion,
        codTipoIdentificacion: item.codTipoIdentificacion,
        estado: item.estado,
        esConsumidorFinal: item.codTipoIdentificacion === 'CF',
        totalRecords: item.totalRecords,
      };
      return obj;
    });
    }

  static fromApiSearch(response:any[]){
    return response.map(item=>{

      return {
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
        name: item.nombreFiscal
      }


    })

  }


  static toSave(param:any){
     return {
           idCliente:  isValidField(param.idCliente) ,
          idEmpleado: getValidId(param.idEmpleado),
          idTipoIdentificacion: param.idTipoIdentificacion,
          idTipoClienteProveedor: getValidId(param.idTipoClienteProveedor),
          idTipoEntidad:getValidId(param.idTipoEntidad),
          idCiudad: getValidId(param.idCiudad),
          idSubContribuyente: getValidId(param.idSubContribuyente),
          idTiempoCredito: param.idTiempoCredito,
          idEmpresa: getValidId(param.idEmpresa),
          idCargo: getValidId(param.idCargo),
          numeroIdentificacion: param.numeroIdentificacion,
          nombreFiscal: param.nombreFiscal,
          nombreComercial: param.nombreComercial,
          direccion:isValidField(param.direccion),
          telefono:isValidField(param.telefono),
          correo:isValidField(param.correo),
          placa:isValidField(param.placa),
          montoCredito:isValidField(param.montoCredito),
          nota:isValidField(param.nota),
          validationSri: param.validationSri,
          idFormaPagoSri: getValidId(param.idFormaPagoSri),
          estado: param.estado || true,
          infoCrediticia: param.dataInfoCred && JSON.stringify(param.dataInfoCred),
          configValorBruto : param.configValorBruto || null
     }
  }

}
