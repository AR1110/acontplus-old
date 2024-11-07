export class SupplierAdapter {


  static fromApiSearch(response: any[]) {
    return response.map(item => {

      return {
        idProveedor: item.idProveedor,
        identificacionComprador: item.numeroIdentificacion,
        razonSocialComprador: item.razonSocial,
        name: item.razonSocial,
        codigoTipoIdentificacion: item.tipoIdentificacion,
      }


    })


  }

}
