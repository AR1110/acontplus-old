import { SeatResponse } from '@barber-shop/domain/models/seat.model';

export class ListSeatMapper {

  static fromJson(response: any): SeatResponse {
    const { items = [], totalCount = 0 } = response.payload;
    const data = items.map((item: any, index: number) => {
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
      totalRecords: totalCount,
    };
  }
}
