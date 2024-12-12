import {ClassProvider} from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {AnticipoWebRepository} from "@accounting/data/anticipo/anticipo-web.repository";


export const anticipoProvider:ClassProvider = {
  provide: AnticipoRepository,
  useClass: AnticipoWebRepository
}
