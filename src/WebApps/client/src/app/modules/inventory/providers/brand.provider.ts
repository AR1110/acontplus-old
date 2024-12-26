import {ClassProvider} from "@angular/core";
import {TagRepository} from "@inventory/domain/repositories/tag.repository";
import {TagWebRepository} from "@inventory/data/tag/tag-web.repository";
import {BrandRepository} from "@inventory/domain/repositories/brand.repository";
import {BrandWebRepository} from "@inventory/data/brand/brand-web.repository";

export const brandProvider:ClassProvider = {
  provide: BrandRepository,
  useClass: BrandWebRepository,
}

