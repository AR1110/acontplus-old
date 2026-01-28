import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SALES_PATH } from '../constants/sales-paths';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SuscripcionService {
  private URL = SALES_PATH.SUBSCRIPTION;
  constructor(private http: HttpClient) {}

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.URL}${id}`)
      .pipe(map((response) => response));
  }

  get<T extends { tipo: number }>(parameters: T) {
    const handleResponse = (tipo: number, payload: any) => {
      switch ((parameters as any)?.tipo) {
        case 5:
          return { payload };
        case 2:
          return {
            subscriptionTypes: payload.subscriptionTypes || [],
            licencias: payload.licencias || [],
            companies: payload.companies || [],
            details: payload.details || [],
          };
        default:
          return { suscripciones: payload.suscripciones || [] };
      }
    };
    return this.http
      .get<ApiResponse>(`${this.URL}?json=${JSON.stringify(parameters)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return handleResponse(parameters.tipo, {});
          }

          try {
            const parsedPayload = JSON.parse(response.payload as string);
            return handleResponse(parameters.tipo, parsedPayload);
          } catch (error) {
            console.warn('Failed to parse response payload:', error);
            return handleResponse(parameters.tipo, {});
          }
        }),
      );
  }
  getById(id: number) {
    return this.http
      .get<ApiResponse>(`${this.URL}${id}`)
      .pipe(map((response: any) => response));
  }
  pay(id: number, paid: boolean) {
    return this.http
      .put<ApiResponse>(`${this.URL}Pay/${id}/${paid}`, null)
      .pipe(map((response) => response));
  }
  post(data: any) {
    return this.http
      .post<ApiResponse>(this.URL, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}`, data)
      .pipe(map((response) => response));
  }

  putStatus(id: number, estado: boolean) {
    return this.http
      .put<ApiResponse>(`${this.URL}${id}/${estado}`, null)
      .pipe(map((response) => response));
  }
}
