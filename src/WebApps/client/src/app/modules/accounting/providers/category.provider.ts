import {ClassProvider} from "@angular/core";
import {CategoryRepository} from "@accounting/core/repositories/category.repository";
import {CategoryWebRepository} from "@accounting/data/category/category-web.repository";


export const categoryProvider:ClassProvider = {
  provide: CategoryRepository,
  useClass: CategoryWebRepository
}
