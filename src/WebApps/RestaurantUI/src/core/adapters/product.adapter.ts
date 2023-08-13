import { ProductReadDto, RawProductData } from "../models";

function productReadAdapter(products: RawProductData[]): Array<ProductReadDto> {
    console.log(products)
    return products.map((product) => ({
            productId: product.idArticulo,
            description: product.descripcion,            
            unitPrice: product.precioCosto,
            code: product.codigo,
            stock: product.stock,
            s3ObjectUrl: product.s3ObjectUrl
        })
    )
}

export {
    productReadAdapter
}