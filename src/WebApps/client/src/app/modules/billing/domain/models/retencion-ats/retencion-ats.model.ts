export interface RetencionAts {
  id: number;
}

export interface RetencionAtsList extends Pick<RetencionAts, 'id'> {
  totalRecords: number;
}

export interface RetAtsInfoAdicional extends Pick<RetencionAts, 'id'> {
  idRetAtsInfoAdicional: number;
  nombre: string;
  valor: string;
}
