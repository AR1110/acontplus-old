 
export interface RawProductData  {
    idArticulo: number;
    descripcion: string;
    precioCosto: number;
    codigo: string;
    stock: number
    s3ObjectUrl: string;
}


export interface ProductReadDto {
    productId: number;
    description: string;
    unitPrice: number;
    code: string;
    stock: number;
    s3ObjectUrl: string
}