import { PATHS, PATHS_API } from '@/shared/enums/main.enum';
import { ApiResponse } from '@/domain/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private http = inject(HttpClient)
  private url = `${PATHS_API.RESTAURANT}${PATHS.TABLE}`

  constructor() { }

  unassign(id: number) {
    return this.http.put<ApiResponse>(`${this.url}Unassign/${id}`, {});
  }

}
