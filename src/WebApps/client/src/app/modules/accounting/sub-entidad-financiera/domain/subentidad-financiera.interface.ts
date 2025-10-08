export interface SubEntidadFinanciera {
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  descripcion: string;
  codigo: string;
  controlCaja: boolean;
}

export interface SubEntidadFinancieraSelectHtmlOnly extends SubEntidadFinanciera {}
