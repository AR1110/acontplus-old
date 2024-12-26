import {ClassProvider} from "@angular/core";
import {SupportDetailWebRepository} from "@mechanical/data/support-detail/support-detail-web.repository";
import {SupportDetailRepository} from "@mechanical/domain/repositories/support-detail.repository";

export const supportDetailProvider :ClassProvider = {
  provide : SupportDetailRepository,
  useClass : SupportDetailWebRepository
}
