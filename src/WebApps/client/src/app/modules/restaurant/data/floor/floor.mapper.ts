import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class FloorMapper {
  static fromApiGetByEstab(response: ApiResponseLegacy) {
    let data = [] as any[];
    if (response.code === '1') {
      const mainData = (response.payload as any[]) || [];

      data = mainData.map((item: any, index: number) => {
        return {
          index: index + 1,
          codEstab: item.codEstab,
          establecimientoId: item.establecimientoId,
          code: item.code,
          description: item.description,
          capacity: item.capacity,
          rooms: item.rooms,
          id: item.id,
          enabled: item.enabled,
          deleted: item.deleted,
          userId: item.userId,
        };
      });
    }

    return data;
  }
}
