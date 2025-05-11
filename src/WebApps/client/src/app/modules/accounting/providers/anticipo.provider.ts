import {ClassProvider} from "@angular/core";
import {AnticipoWebRepository} from "@accounting/data/anticipo/anticipo-web.repository";
import {AnticipoRepository} from "@accounting/domain/repositories/anticipo.repository";


export const anticipoProvider:ClassProvider = {
  provide: AnticipoRepository,
  useClass: AnticipoWebRepository
}
