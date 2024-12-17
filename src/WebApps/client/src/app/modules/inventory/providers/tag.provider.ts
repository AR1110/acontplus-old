import {ClassProvider} from "@angular/core";
import {TagRepository} from "@inventory/core/repositories/tag.repository";
import {TagWebRepository} from "@inventory/data/tag/tag-web.repository";

export const tagProvider:ClassProvider = {
  provide: TagRepository,
  useClass: TagWebRepository
}

