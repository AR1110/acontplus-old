import { SeatResponse } from '@barber-shop/domain/models/seat.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class ListSeatMapper {
  static toJson() {}
  static fromJson(response: ApiResponseLegacy): SeatResponse {
    const results = (response.payload as any[]) || [];
    const data = results.map((item, index) => {
      return {
        index: index + 1,
        seatNumber: item.seatNumber,
        code: item.code,
        name: item.name,
        description: item.description,
        isOccupied: item.isOccupied,
        id: item.id,
        createdAt: item.createdAt,
        enabled: item.enabled,
        deleted: item.deleted,
      };
    });
    return {
      data,
      totalRecords: 0,
    };
  }
}
