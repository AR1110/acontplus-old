export interface CodigoRetencion {
  idCodigoRetencion: number;
  codigo: string;
  descripcion: string;
  porcentaje: number;
  estado: boolean;
}

export interface CodigoRetencionMixed
  extends Pick<CodigoRetencion, "codigo" | "descripcion" | "porcentaje"> {}
