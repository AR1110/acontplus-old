import { CategoryReadDto } from "../models";


class CategoryAdapter {
    tableReadAdaptFromApi(categories: any): Array<CategoryReadDto> {
      
        return categories.map((category: any) => ({
            idSubFamilia: category.idSubFamilia,
            description: category.descripcion,
        })
        )
    }
}

const categoryAdapter = new CategoryAdapter();
export {
    categoryAdapter
}