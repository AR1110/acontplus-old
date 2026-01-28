export interface Shift {
  idTurno?: number;
  descripcion: string;
  estado: boolean;
  idUsuario?: number;
  idEntidad?: number;
}

export interface ShiftList {
  index: number;
  idTurno?: number;
  descripcion: string;
  estado: boolean;
  idUsuario?: number;
  idEntidad?: number;
  totalRecords: number;
}

export class ListShiftResponse {
  data: ShiftList[] = [];
  totalRecords = 0;
}
