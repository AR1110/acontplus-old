import {
  ElectronicSignatureListResponse,
  ElectronicSignatureParam,
} from '@modules/config/data/models/electronic-signature.model';
import { ElectronicSignatureMapper } from '@modules/config/data/mappers/electronic-signature-mapper';
import { ElectronicSignatureRepository } from '@modules/config/data/repositories/electronic-signature.repository';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronicSignatureHttp implements ElectronicSignatureRepository {
  updateSignature(params: Partial<ElectronicSignatureParam>): Observable<ApiResponseLegacy> {
    const formData = new FormData();
    if (params.file) {
      formData.append('file', params.file);
    }
    if (params.contrasenia) {
      formData.append('contrasenia', params.contrasenia);
    }
    return this._http.post<ApiResponseLegacy>(
      `${this._url}/UpdateSignature/${params.idFirmaElectronica}`,
      formData,
    );
  }
  create(params: ElectronicSignatureParam): Observable<ApiResponseLegacy> {
    const formData = new FormData();
    if (params.file) {
      formData.append('file', params.file);
    }
    const jsonParam = encodeURIComponent(JSON.stringify(params));
    return this._http.post<ApiResponseLegacy>(`${this._url}/Post?json=${jsonParam}`, formData);
  }
  update(params: Partial<ElectronicSignatureParam>): Observable<ApiResponseLegacy> {
    const jsonParam = encodeURIComponent(JSON.stringify(params));
    return this._http.put<ApiResponseLegacy>(`${this._url}/Put?json=${jsonParam}`, '');
  }
  list(): Observable<ElectronicSignatureListResponse> {
    const json = JSON.stringify({ tipo: 1 });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ElectronicSignatureMapper.fromJson(response)));
  }

  save(signature: ElectronicSignatureParam): Observable<ApiResponseLegacy> {
    const formData = new FormData();
    if (signature.file) {
      formData.append('file', signature.file);
    }
    const jsonParam = encodeURIComponent(JSON.stringify(signature));
    return this._http.post<ApiResponseLegacy>(`${this._url}/Post?json=${jsonParam}`, formData);
  }

  downloadSignature(id: number) {
    const url = `${this._url}/Download/${id}`;
    console.log(url);
    return this._http.get(url, {
      responseType: 'blob', // importante para recibir el archivo binario
      observe: 'response', // para obtener encabezados (como filename)
    });
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.ELECTRONIC_SIGNATURE}`;
  private _http = inject(HttpClient);
}
