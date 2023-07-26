export interface StockFisico {
    id: number;
    codEstab: string;
    puntoEmisionId: number;
    secuencial: string;
    fecha: Date;
    responsable: string;
    obs: string;
    fechaRevision: Date;
    detalles: any
}

export interface StockFisicoDetalle {
    stockFisicoId: number;
    idBodega: number;
    idArticulo: number;
    codigo: string;
    descripcion: string;
    cantidadContada?: number;
    stockActual: number;
    discrepancia?: number;
    motivoDiscrepanciaId?: number;
    otroMotivo?: string;
}