import { getCustomUrlContext } from '@/core/interceptors/inject-session.interceptor';
import { PATHS, PATHS_API } from '@/enums/main.enum';
import { StateInstanceGreenApiResponse } from '@/models/qr-whatsapp.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiGreenApiService {

  #idInstance = '7103845341';
  #apiTokenInstance = 'a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c';


  #url = `${PATHS_API.GREEN_API}${PATHS.WA_INSTANCE}`;

  constructor(
    private http: HttpClient,
  ) {
  }

  getStateInstance() {
    return this.http.get<StateInstanceGreenApiResponse>(
      `${this.#url}${this.#idInstance}/getStateInstance/${this.#apiTokenInstance}`,
    );
  }


  sendSMS(chatId: string, message: string) {
    const body = {
      chatId,
      message,
    }

    return this.http.post<StateInstanceGreenApiResponse>(
      `${this.#url}${this.#idInstance}/sendMessage/${this.#apiTokenInstance}`, body,
      {
        context: getCustomUrlContext()
      }
    );
  }


  sendFileByUpload<T extends { caption: string, chatId: string, file: File }>(obj: T) {

    const payload = new FormData();
    payload.append("caption", obj.caption)
    payload.append("chatId", obj.chatId)
    payload.append("file", obj.file)


    return this.http.post<StateInstanceGreenApiResponse>(
      `${this.#url}${this.#idInstance}/sendFileByUpload/${this.#apiTokenInstance}`, payload,
      {
        context: getCustomUrlContext()
      }
    );

  }

}
