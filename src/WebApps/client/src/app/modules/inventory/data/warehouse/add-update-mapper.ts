import { WarehouseList } from '@inventory/domain/models/warehouse.model';

export class AddUpdateMapper {
  static toJson(obj: WarehouseList) {


    return {
      id: obj.idBodega,
      descripcion: obj.descripcion,
      estado: obj.estado,
      telefono: obj.telefono,
      codEstab: obj.codEstab,
      direccion: obj.direccion,

    }

  }
}
