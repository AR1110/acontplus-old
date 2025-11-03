import { Supplier } from '@customer/domain/models/supplier.interface';

export class SupplierMapper {
  static fromApiSearch(response: Supplier[]) {
    return response.map((item) => {
      return {
        idProveedor: item.idProveedor,
        identificacionComprador: item.numeroIdentificacion,
        razonSocialComprador: item.razonSocial,
        name: item.razonSocial,
        codigoTipoIdentificacion: item.tipoIdentificacion,
      };
    });
  }
}
