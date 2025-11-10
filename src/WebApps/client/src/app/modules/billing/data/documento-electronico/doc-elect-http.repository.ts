import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';
import { FilterData } from '@billing/domain/models/documento-electronico.model';
import { SharedService } from '@core/services/shared.service';
import { catchError } from 'rxjs/operators';
import { ElectronicDocListMapper } from '@billing/data/documento-electronico/doc-elect-list.mapper';

@Injectable({
  providedIn: 'root',
})
export class DocElectHttpRepository implements DocumentoElectronicoRepository {
  private readonly _url = `${PATHS_API.FACT_ELECT}${BILLING_PATHS.DOC_ELECT}`;
  private readonly _http = inject(HttpClient);
  private readonly _sharedService = inject(SharedService);

  private filterDataCache: FilterData | null = null;
  filterDataSubject = new BehaviorSubject<FilterData | null>(null);

  authorize(id: number) {
    return this._http
      .put<ApiResponseLegacy>(`${this._url}${id}`, '')
      .pipe(map((response) => response));
  }
  cancel(id: number) {
    return this._http
      .put<ApiResponseLegacy>(`${this._url}Cancel/${id}`, '')
      .pipe(map((response) => response));
  }
  downloadXml(id: number) {
    return this._http
      .get(`${this._url}GetXmlSri/${id}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          this._sharedService.saveFile(response);
          return response.body!;
        }),
      );
  }

  getFilters(forceRefresh = false): Observable<FilterData> {
    if (this.filterDataCache && !forceRefresh) {
      console.log('Datos de filtros obtenidos desde caché local');
      return of(this.filterDataCache);
    }

    return this._http.get<ApiResponseLegacy>(`${this._url}GetFilters`).pipe(
      map((response) => this.processFilterResponse(response)),
      tap((processedData) => {
        // Actualizar caché local
        this.filterDataCache = processedData;
        this.filterDataSubject.next(processedData);
        console.log('💾 Datos de filtros actualizados en caché local');
      }),
      catchError((error) => {
        console.error('❌ Error al obtener datos de filtros:', error);

        // Si hay error y tenemos caché, devolver caché como fallback
        if (this.filterDataCache) {
          console.log('⚠️ Usando caché como fallback debido a error');
          return of(this.filterDataCache);
        }

        throw error;
      }),
    );
  }
  refreshFilters(): Observable<FilterData> {
    return this._http.get<ApiResponseLegacy>(`${this._url}RefreshFilters`).pipe(
      map((response) => this.processFilterResponse(response)),
      tap((processedData) => {
        // Actualizar caché local
        this.filterDataCache = processedData;
        this.filterDataSubject.next(processedData);
        console.log('💾 Datos de filtros actualizados en caché local');
      }),
      catchError((error) => {
        console.error('❌ Error al obtener datos de filtros:', error);

        // Si hay error y tenemos caché, devolver caché como fallback
        if (this.filterDataCache) {
          console.log('⚠️ Usando caché como fallback debido a error');
          return of(this.filterDataCache);
        }

        throw error;
      }),
    );
  }
  get filterData$(): Observable<FilterData | null> {
    return this.filterDataSubject.asObservable();
  }
  getAll<T>(obj: T) {
    const json = ElectronicDocListMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ElectronicDocListMapper.fromJson(response)));
  }

  /**
   * Procesa la respuesta del API y transforma los datos
   * @param response - Respuesta del API
   * @returns Datos procesados para usar en la aplicación
   */
  private processFilterResponse(response: ApiResponseLegacy): FilterData {
    try {
      const { tipoDocumentos, estadoDocumentos, estabs, estadoPagos } = JSON.parse(
        response.payload as string,
      );

      // Procesar establecimientos con la utilidad existente
      const establecimientos = groupEstabUtil({
        estabs: estabs,
        isGroupPuntoEmision: true,
      });

      return {
        estabs: establecimientos,
        tipoDocumentos: tipoDocumentos || [],
        estadoDocumentos: estadoDocumentos || [],
        estadoPagos: estadoPagos || [],
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('❌ Error al procesar respuesta de filtros:', error);
      throw new Error('Error al procesar datos de filtros del servidor');
    }
  }
}
