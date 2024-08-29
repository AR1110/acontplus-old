import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  StateInstanceGreenApiResponse, 
} from '@/models/qr-whatsapp.model';
import { PATHS_API,PATHS } from '@/enums/main.enum';  

@Injectable({
  providedIn: 'root',
})
export class QrWhatsappService {
  #idInstance = '7103845341';
  #apiTokenInstance = 'a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c';
  #http = inject(HttpClient);

  #url = `${PATHS_API.GREEN_API}${PATHS.WA_INSTANCE}`;

  getStateInstance() {
    return this.#http.get<StateInstanceGreenApiResponse>(
      `${this.#url}${this.#idInstance}/getStateInstance/${this.#apiTokenInstance}`, 
    );
  } 
}
