export class CompanyCustomerAdapter {

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
