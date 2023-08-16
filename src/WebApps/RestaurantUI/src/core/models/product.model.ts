 
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


export interface ProductFilter {
    tipo: number,
    checkBoxSubFamilia: boolean
    bySubFamilia: number,
    pageIndex: number,
    pageSize: number,
}

export const productFilterInitialState:  ProductFilter = {
    tipo: 1,
    checkBoxSubFamilia: false,
    bySubFamilia: 0,
    pageIndex: 1,
    pageSize: 50
}