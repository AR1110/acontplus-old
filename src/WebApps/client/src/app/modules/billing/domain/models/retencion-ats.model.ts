export interface RetencionAts {
  id: number;
}

export interface RetencionAtsList extends Pick<RetencionAts, 'id'> {
  totalRecords: number;
}
