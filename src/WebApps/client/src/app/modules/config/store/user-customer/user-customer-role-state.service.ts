import { Injectable } from '@angular/core';
import {GenericStoreSignalService} from "@shared/services/generic-store-signal.service";


type  State = {
  userRoleId: number
}
@Injectable({
  providedIn: 'root'
})
export class UserCustomerRoleStateService extends  GenericStoreSignalService<State> {

  constructor() {
    super()
  }
}
