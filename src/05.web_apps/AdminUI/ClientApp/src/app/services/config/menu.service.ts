import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiPaths } from '@enums/api-paths';
import { map } from 'rxjs';
import { StructureResponse } from '@models/structure-response.model';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<StructureResponse>(`${this.baseUrl}api/Menu/Get/${JSON.stringify({tipo:'G'})}}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }

  save(data: any){
    return this.httpClient.post<StructureResponse>(this.baseUrl + ApiPaths.Menu+ '/Post/',data).pipe(
      map(res=>JSON.parse(res.payload)[0])
    )
  }

  update(idMenu: string, data:any){
    return this.httpClient.put<StructureResponse>(this.baseUrl+ ApiPaths.Menu+ '/Put?id='+idMenu, data).pipe(
      map(res=>JSON.parse(res.payload)[0])
    )
  }

  delete(idMenu :string){
    return this.httpClient.delete<StructureResponse>(this.baseUrl+ ApiPaths.Menu+ '/Delete?id='+idMenu).pipe(
      map(res=>JSON.parse(res.payload)[0])
    )
  }
}
