import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListVehicleParams, ListVehicleResponse } from '@mechanical/domain/models/vehicle.model';

export class ListVehicleMapper {
  static toJson(params: ListVehicleParams): any {
    return JSON.stringify({
      ...params,
      tipo: 1,
    });
  }

  static fromJson(response: ApiResponseLegacy): ListVehicleResponse {
    let data = [] as any[];
    if (response.code === '1') {
      const { vehicles = [] } = JSON.parse(response.payload as string);

      data = vehicles.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
        };
      });
    }
    const totalRecords = data.length > 0 ? data[0].totalRecords : 0;
    return {
      data,
      totalRecords,
    };
  }
}
