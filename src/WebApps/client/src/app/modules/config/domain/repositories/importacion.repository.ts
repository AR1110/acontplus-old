import { Observable } from 'rxjs';
import {ImportacionResponse} from "@modules/config/domain/models/importacion.model";

export abstract class ImportacionRepository {
  abstract list (): Observable<ImportacionResponse>;
  abstract getFormData (): Observable<ImportacionResponse>;

}
