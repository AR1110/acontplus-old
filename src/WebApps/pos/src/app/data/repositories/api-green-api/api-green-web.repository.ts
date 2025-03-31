import { PATHS, PATHS_API } from '@domain/enums/main.enum';
import { StateInstanceGreenApiResponse } from '@domain/models/api-green.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiGreenRepository } from '@domain/repositories/api-green.repository';
import { customUrl } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class ApiGreenWebRepository implements ApiGreenRepository {
  #idInstance = '7103845341';
  #apiTokenInstance = 'a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c';

  #url = `${PATHS_API.GREEN_API}${PATHS.WA_INSTANCE}`;

  constructor(private http: HttpClient) {}

  private pathString(method: string) {
    return `${this.#url}${this.#idInstance}/${method}/${this.#apiTokenInstance}`;
  }

  getStateInstance() {
    return this.http.get<StateInstanceGreenApiResponse>(
      this.pathString('getStateInstance'),
    );
  }

  sendSMS(chatId: string, message: string) {
    const body = {
      chatId,
      message,
    };

    return this.http.post<StateInstanceGreenApiResponse>(
      this.pathString('sendMessage'),
      body,
      {
        context: customUrl(),
      },
    );
  }

  sendFileByUpload<T extends { caption: string; chatId: string; file: File }>(
    obj: T,
  ) {
    const payload = new FormData();
    payload.append('caption', obj.caption);
    payload.append('chatId', obj.chatId);
    payload.append('file', obj.file);

    return this.http.post<StateInstanceGreenApiResponse>(
      this.pathString('sendFileByUpload'),
      payload,
      {
        context: customUrl(),
      },
    );
  }
}
