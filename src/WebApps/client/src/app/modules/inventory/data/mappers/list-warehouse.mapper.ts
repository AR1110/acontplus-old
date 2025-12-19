import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListWarehouseResponse } from '@inventory/domain/models/warehouse.model';

export class ListWarehouseMapper {
  static fromJson(response: ApiResponseLegacy): ListWarehouseResponse {
    const result = new ListWarehouseResponse();
    if (response.code === '1') {
      const warehouses = JSON.parse(response.payload as any);
      result.data = warehouses.map((item: any, index: number) => {
        return {
          index: index + 1,
          idBodega: item.idBodega,
          codEstab: item.codEstab,
          descripcion: item.descripcion,
          telefono: item.telefono,
          direccion: item.direccion,
          estado: item.estado,
          nomEstab: item.nombreComercial,
          totalRecords: item.totalRecords,
          nomEstado: item.estado ? 'Activo' : 'Inactivo',
        };
      });
    }

    return result;
  }
}
