import { ProductReadDto, RawProductData } from "../models";

function productReadAdapter(products: RawProductData[]): Array<ProductReadDto> {
    return products.map((product) => ({
            productId: product.idArticulo,
            description: product.descripcion,            
            unitPrice: product.precioCosto,
            code: product.codigo
        })
    )
}

export {
    productReadAdapter
}