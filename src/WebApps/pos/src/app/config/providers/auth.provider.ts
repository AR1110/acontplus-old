import {ClassProvider} from "@angular/core";
import {AuthRepository} from "@domain/repositories/auth.repository";
import {AuthWebRepository} from "@data/repositories/auth/auth-web.repository";


export const authProvider:ClassProvider = {
  provide: AuthRepository,
  useClass: AuthWebRepository
}
