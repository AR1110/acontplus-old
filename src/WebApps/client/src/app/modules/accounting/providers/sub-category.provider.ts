import {ClassProvider} from "@angular/core";
import {SubCategoryRepository} from "@accounting/core/repositories/sub-category.repository";
import {SubCategoryRepositoryImpl} from "@accounting/data/repository/sub-category/sub-category.repository.impl";


export const subCategoryProvider:ClassProvider = {
  provide: SubCategoryRepository,
  useClass: SubCategoryRepositoryImpl
}
