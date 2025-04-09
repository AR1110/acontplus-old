export interface ConceptoRetencionAir {
  id: number;
  codigo: string;
  descripcion: string;
  porcentaje: number;
  enabled?: boolean;
}

export interface CodigoRetencionMixed
  extends Pick<ConceptoRetencionAir, "codigo" | "descripcion" | "porcentaje"> {}
