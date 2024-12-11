import {ClassProvider} from "@angular/core";
import {SubCategoryRepository} from "@accounting/core/repositories/sub-category.repository";
import {SubCategoryWebRepository} from "@accounting/data/repository/sub-category/sub-category-web.repository";


export const subCategoryProvider:ClassProvider = {
  provide: SubCategoryRepository,
  useClass: SubCategoryWebRepository
}
