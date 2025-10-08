export interface UserCustomerCustomerRolePtoEmision {
  idPtoEmi_Asig: number;
  codEstab_Asig: string;
  idPuntoEmision: number;
  ptoEmi: string;
  defaultPtoEmi: boolean;
  estado: boolean;
}

export interface AsignacionPuntoEmisionList {
  idPtoEmi_Asig: number;
  codEstab_Asig: string;
  idPuntoEmision: number;
  ptoEmi: string;
  defaultPtoEmi: boolean;
  estado: boolean;
}

export interface AsignacionPuntoEmisionResponse {
  data: AsignacionPuntoEmisionList[];
}
