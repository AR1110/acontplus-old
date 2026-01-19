export interface AsignacionEstabList {
  idEstab_Asig: number;
  codEstab_Asig: string;
  codEstab: string;
  estab: string;
  nombreComercial: string;
  defaultEstab: boolean;
  estado: boolean;
  idEstablecimiento: number;
}
export interface AsignacionEstabResponse {
  data: AsignacionEstabList[];
}
