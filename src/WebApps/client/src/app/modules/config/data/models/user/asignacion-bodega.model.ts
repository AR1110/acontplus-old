export interface UserCustomerCustomerRoleBodega {
  idBodeg_Asig: number;
  codEstab_Asig: string;
  idBodega: number;
  descripcion: string;
  defaultBodga: boolean;
  estado: boolean;
}

export interface AsignacionBodegaList {
  idBodeg_Asig: number;
  codEstab_Asig: string;
  idBodega: number;
  descripcion: string;
  defaultBodga: boolean;
  estado: boolean;
}
export interface AsignacionBodegaResponse {
  data: AsignacionBodegaList[];
}
