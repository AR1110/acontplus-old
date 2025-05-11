import {ClassProvider} from "@angular/core";
import {SubCategoryWebRepository} from "@accounting/data/sub-category/sub-category-web.repository";
import {SubCategoryRepository} from "@accounting/domain/repositories/sub-category.repository";


export const subCategoryProvider:ClassProvider = {
  provide: SubCategoryRepository,
  useClass: SubCategoryWebRepository
}
