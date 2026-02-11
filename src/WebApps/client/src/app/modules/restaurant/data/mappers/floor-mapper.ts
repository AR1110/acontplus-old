import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { GetFloorsByEstabIdResponse } from '@restaurant/data/models/floor.model';

export class FloorMapper {
  static fromJson(response: ApiResponseLegacy) {
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


export class GetFloorsByEstabIdMapper {
  static fromJson(response: ApiResponseLegacy): GetFloorsByEstabIdResponse {
    const result = new GetFloorsByEstabIdResponse();
    if (response.code === '1') {
      function tablesMapper(tables: any[], roomName: string) {
        return tables.map((item: any) => {
          return {
            roomId: item.roomId,
            numberTable: item.numberTable,
            description: item.description,
            capacity: item.capacity,
            id: item.id,
            enabled: item.enabled,
            type: 'table',
            roomName,
          };
        });
      }

      function roomsMapper(rooms: any[]=[]) {
        return rooms.map((item: any) => {
          const children = tablesMapper(item.tables || [], item.description);
          return {
            floorId: item.floorId,
            code: item.code,
            description: item.description,
            capacity: item.capacity,
            children,
            id: item.id,
            enabled: item.enabled,
            type: 'room',
          };
        });
      }

      result.floors = ((response.payload as any) || []).map((item: any) => {
        const children = roomsMapper(item.rooms);
        return {
          codEstab: item.codEstab,
          establecimientoId: item.establecimientoId,
          code: item.code,
          description: item.description,
          capacity: item.capacity,
          children,
          id: item.id,
          enabled: item.enabled,
          type: 'floor',
        };
      });
    }

    return result;
  }
}
