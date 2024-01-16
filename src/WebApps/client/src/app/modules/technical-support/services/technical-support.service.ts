import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSupportService {

  url = `${PATHS_API.TECHSUPPORT}`

}
