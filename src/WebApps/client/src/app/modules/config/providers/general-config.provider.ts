import { ClassProvider } from '@angular/core';
import {GeneralConfigRepository} from "@modules/config/domain/repositories/general-config.repository";
import {GeneralConfigRepositoryImpl} from "@modules/config/data/general-config/general-config-repository-impl";

export const generalConfigProvider: ClassProvider = {
  provide: GeneralConfigRepository,
  useClass: GeneralConfigRepositoryImpl,
};
