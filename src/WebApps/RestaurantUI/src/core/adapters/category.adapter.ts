import { CategoryReadDto, RawCategoryData } from "../models"; 

function categoryReadAdapter(categories: RawCategoryData[]): Array<CategoryReadDto> {
    console.log(categories)      
    return categories.map((category) => ({
        idSubFamilia: category.idSubFamilia,
        description: category.descripcion,
        s3ObjectUrl: category.s3ObjectUrl
    })
    )
}

export {
    categoryReadAdapter
}