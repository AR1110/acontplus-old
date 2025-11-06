import { inject, Injectable } from '@angular/core';
import { EmailQueueRepository } from '@modules/common/core/repositories/email-queue-repository';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { API_ENDPOINTS } from '@modules/common/core/enums/common.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class EmailQueueWebRepository extends EmailQueueRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.COMMON}${API_ENDPOINTS.EMAIL_QUEUE}`;

  send(data: any) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, data);
  }
}
