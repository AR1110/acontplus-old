export interface WarehouseList {
  index: number;
  idBodega: number;
  codEstab: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  nomEstab: string;
  totalRecords: number;
  nomEstado: string;
}

export class ListWarehouseResponse {
  data: WarehouseList[] = [];
  totalRecords = 0;
}
