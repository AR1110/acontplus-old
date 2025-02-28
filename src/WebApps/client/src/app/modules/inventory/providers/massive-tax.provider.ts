import {ClassProvider} from "@angular/core";
import {MassiveTaxRepository} from "@inventory/domain/repositories/massive-tax.repository";
import {MassiveTaxWebRepository} from "@inventory/data/massive-tax/massive-tax-web.repository";

export const massiveTaxProvider:ClassProvider = {
  provide: MassiveTaxRepository,
  useClass: MassiveTaxWebRepository,
}

