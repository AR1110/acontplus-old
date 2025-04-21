import { Observable } from 'rxjs';
import {GeneralConfigResponse} from "@modules/config/domain/models/general-config.model";
import {ApiResponse} from "@core/models/api-response";

export abstract class GeneralConfigRepository {
  abstract list (parameters: string): Observable<GeneralConfigResponse>;
  abstract update<T>(parameters: T): Observable<ApiResponse>;
}
