import { PATHS_API } from '@/enums/main.enum';
import { ApiResponse } from '@/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private http = inject(HttpClient)
  private url = `${PATHS_API.RESTAURANT}`

  constructor() { }

  unassign(id: number) {
    return this.http.put<ApiResponse>(`${this.url}Unassign/${id}`, {});
  }

}
