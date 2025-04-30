
import { Observable } from "rxjs";
import {
  FormDataConfig,
  FormDataConfigParams,
  GetEstabsResponse
} from "@domain/models/config.model";

export abstract class ConfigRepository {
  abstract getEstabs(): Observable<GetEstabsResponse>;
  abstract getFormData(obj: FormDataConfigParams): Observable<FormDataConfig>
}
