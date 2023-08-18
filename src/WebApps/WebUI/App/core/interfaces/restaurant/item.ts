
export interface Item {   
    readonly id: number;
    summary: string;
    cooking: boolean;
    recipe: string;
    instructions: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    enabled: boolean;
    deleted: boolean;
    userId: number;
    productId: number;
    descripcion: string;
    s3ObjectUrl: string;
    stockMinimo: number;
    stock: number;
    codigo: string;
    codigoAuxiliar: string;
    tipoIva: string;
    tipoArticulo: string;
    style: string;
    readonly productionAreaId: number;
    descriptionProductionArea: string;
}