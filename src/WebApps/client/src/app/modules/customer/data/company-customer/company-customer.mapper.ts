

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
}
