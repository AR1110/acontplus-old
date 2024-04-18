import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '../enums/billing.enum.ts';

@Injectable({
  providedIn: 'root'
})
export class AtsService {
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.ATS}`

  constructor() { }
}
