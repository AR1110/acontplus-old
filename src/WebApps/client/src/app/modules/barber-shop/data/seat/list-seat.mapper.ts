import { SeatResponse } from '@barber-shop/domain/models/seat.model';
import { buildParams } from '@shared/utils/build-params';

export class ListSeatMapper {
  static toJson() {
    return buildParams({
      pageIndex: 1,
      pageSize: 10,
    });
  }
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
