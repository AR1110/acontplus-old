import {ClassProvider} from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {AnticipoWebRepository} from "@accounting/data/anticipo/anticipo-web.repository";
import {AuthRepository} from "@modules/auth/core/repositories/auth.repository";
import {AuthWebRepository} from "@modules/auth/core/domain/auth/auth-web.repository";


export const authProvider:ClassProvider = {
  provide: AuthRepository,
  useClass: AuthWebRepository
}
