 
export interface RawProductData  {
    idArticulo: number;
    descripcion: string;
    precioCosto: number;
    codigo: string;
}


export interface ProductReadDto {
    productId: number;
    description: string;
    unitPrice: number;
    code: string;
}