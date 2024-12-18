import {ClassProvider} from "@angular/core";
import {ConfigRepository} from "@domain/repositories/config.repository";
import {ConfigWebRepository} from "@data/repositories/config/config-web.repository";


export const configProvider:ClassProvider = {
  provide: ConfigRepository,
  useClass: ConfigWebRepository
}
