import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDate } from '@core/utils/date.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';
import { mergeMeasureUtil } from '@inventory/utils/merge-measure.util';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { SupportMaintenanceDetail } from '@mechanical/domain/models/support-maintenance.model';
import { SupportDetailRepository } from '@mechanical/domain/repositories/support-detail.repository';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { SupportDetailMapper } from '@mechanical/data/support-detail/support-detail.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupportDetailWebRepository extends SupportDetailRepository {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT_DETAIL}`;
  #http = inject(HttpClient);

  getId(id: number) {
    const json = JSON.stringify({
      tipo: 1,
      id,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}`)
      .pipe(map((response) => SupportDetailMapper.fromApiGetId(response)));
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }
}
