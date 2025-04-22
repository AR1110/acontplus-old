import {SeatResponse} from "@barber-shop/domain/models/seat.model";

export class ListSeatMapper {
  static toJson(){}
  static fromJson(obj:any): SeatResponse{
    console.log(obj)
    return {
      data: [],
      totalRecords: 0
    }
  }
}
