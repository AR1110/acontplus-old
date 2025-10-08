interface TipoIva {
  idTipoIva: number;
  descripcion: string;
  codigo: string;
  porcentaje: number;
}

export interface TipoIvaSelectHtmlOnly extends TipoIva {}
