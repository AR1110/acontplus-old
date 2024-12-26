import {ClassProvider} from "@angular/core";
import {SupportRepository} from "@mechanical/domain/repositories/support.repository";
import {SupportWebRepository} from "@mechanical/data/support/support-web.repository";

export const supportProvider : ClassProvider =  {
  provide : SupportRepository,
  useClass: SupportWebRepository
}
