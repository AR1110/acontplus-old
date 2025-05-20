import {ClassProvider} from "@angular/core";
import {CategoryWebRepository} from "@accounting/data/category/category-web.repository";
import {CategoryRepository} from "@accounting/domain/repositories/category.repository";


export const categoryProvider:ClassProvider = {
  provide: CategoryRepository,
  useClass: CategoryWebRepository
}
