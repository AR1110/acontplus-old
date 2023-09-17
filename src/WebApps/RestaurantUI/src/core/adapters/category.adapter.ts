import { CategoryReadDto, RawCategoryData } from "../models"; 

function categoryReadAdapter(categories: RawCategoryData[]): Array<CategoryReadDto> { 
    return categories.map((category) => ({
        idSubFamilia: category.idSubFamilia,
        description: category.descripcion,
        code: category.codigo,
        s3ObjectUrl: category.s3ObjectUrl
    })
    )
}

export {
    categoryReadAdapter
}