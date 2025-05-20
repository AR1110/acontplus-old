export interface SeatList {
  index: number
  seatNumber: number
  code: string
  name: string
  description: string
  isOccupied: string,
  id: number,
  createdAt: string
  enabled: boolean
  deleted: null
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
  id: number;
  seatNumber: number;
  code: string;
  name: string;
  description?: string;
}


export interface SeatUpdateParams {
  data: SeatUpdateDto;
  id: number;
}
