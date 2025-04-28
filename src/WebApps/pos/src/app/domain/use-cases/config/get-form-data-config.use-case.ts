import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {FormDataConfig, FormDataConfigParams} from "@domain/models/config.model";
import {Observable} from "rxjs";
import {ConfigRepository} from "@domain/repositories/config.repository";

@Injectable({
  providedIn: 'root',
})
export class GetFormDataConfigUseCase implements BaseUseCase<FormDataConfig, FormDataConfigParams>{
  constructor(private repo: ConfigRepository) {
  }
  execute(params: FormDataConfigParams): Observable<FormDataConfig> {
    return this.repo.getFormData(params);
  }
}
