export interface TiempoCredito {
  idTiempoCredito: number;
  descripcion: string;
  numeroCuota: number;
  entrada: boolean;
  diasCredito: number;
}

export interface TiempoCreditoSelectHtmlOnly
  extends Pick<TiempoCredito, 'idTiempoCredito' | 'descripcion' | 'diasCredito' | 'numeroCuota'> {}
