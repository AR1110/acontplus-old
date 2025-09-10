export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ShiftList {
  index: number;
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  totalRecords: number;
}

export class ListShiftResponse {
  data: ShiftList[] = [];
  totalRecords = 0;
}
