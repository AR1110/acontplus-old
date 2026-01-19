import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '@modules/common/constants/common.constants';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class UserManualTypeService {
  #http = inject(HttpClient);
  #url = `${API_ENDPOINTS.USER_MANUAL_TYPE}`;

  get() {
    return this.#http.get<ApiResponse>(`${this.#url}`).pipe(
      map((response) => {
        if (response.code != '1') {
          return { userManualTypes: [] };
        }
        return { userManualTypes: response.payload as any[] };
      }),
    );
  }
}
