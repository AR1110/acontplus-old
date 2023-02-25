import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) {}

  get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}api/${url}`, {params});
  }

  post<T, D>(url: string, data: D | string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}api/${url}`, data);
  }

  put<T, D>(url: string, data: D | string): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}api/${url}`, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}api/${url}`);
  }

  // get headers(): HttpHeaders {
  //   const headersConfig = {
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   };

  //   return new HttpHeaders(headersConfig);
  // }
}
