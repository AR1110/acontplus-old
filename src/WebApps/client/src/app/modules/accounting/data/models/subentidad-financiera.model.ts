export interface SubEntidadFinanciera {
  idSubEntidadFinanciera: number;
  idEntidadFinanciera: number;
  descripcion: string;
  codigo: string;
}

export interface SubEntidadFinancieraRead extends SubEntidadFinanciera {}

export interface SubEntidadFinancieraSelectHtmlOnly
  extends Pick<
    SubEntidadFinanciera,
    'idSubEntidadFinanciera' | 'idEntidadFinanciera' | 'descripcion' | 'codigo'
  > {}
