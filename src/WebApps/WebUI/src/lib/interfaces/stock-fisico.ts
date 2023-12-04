export interface StockFisico {
    id: number;
    codEstab: string;
    puntoEmisionId: number;
    secuencial: number;
    serieDocumento: string;
    fecha: Date;
    responsable: string;
    obs: string;
    fechaRevision: Date;
    //stockFisicoDetalles: Array<StockFisicoDetalle>;
}

export interface StockFisicoDetalle {
    stockFisicoId: number;
    bodegaId: number;
    articuloId: number;
    codigo: string;
    descripcion: string;
    cantidadContada?: number;
    stockActual: number;
    discrepancia?: number;
    motivoDiscrepanciaId?: number;
    motivoDiscrepancia?: string;
    otroMotivo?: string;
}