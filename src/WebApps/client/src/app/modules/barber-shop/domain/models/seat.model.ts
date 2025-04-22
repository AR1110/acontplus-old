export interface SeatList {
  id: number;
  name: string;
  description: string;
  orderSeat: number
}

export interface SeatResponse {
  data: SeatList[];
  totalRecords: number;
}

export interface SeatCreateDto {
  name: string ;
  description: string | null;
  seatNumber: number
}


export interface SeatUpdateDto {

}
export interface SeatUpdateParams {
  data: SeatUpdateDto;
  id: number;
}
