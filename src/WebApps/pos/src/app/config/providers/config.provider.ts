import {ClassProvider} from "@angular/core";
import {ConfigRepository} from "@domain/repositories/config.repository";
import {ConfigRepositoryImpl} from "@data/repositories/config/config-repository.impl";


export const configProvider:ClassProvider = {
  provide: ConfigRepository,
  useClass: ConfigRepositoryImpl
}
