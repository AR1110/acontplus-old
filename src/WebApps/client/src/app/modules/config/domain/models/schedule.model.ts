export interface Schedule {
  idDia?: number;
  descripcion: string;
  apertura?: string;
  cierre?: string;
  estado: boolean;
}

export interface ScheduleList {
  index: number;
  idDia?: number;
  descripcion: string;
  estado: boolean;
  apertura: Date;
  cierre: Date;
}

export class ListScheduleResponse {
  data: ScheduleList[] = [];
}
