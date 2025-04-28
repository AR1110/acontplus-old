import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import { GetEstabsResponse} from "@domain/models/config.model";
import {ConfigRepository} from "@domain/repositories/config.repository";

@Injectable({
  providedIn: 'root',
})
export class GetEstabsConfigUseCase implements BaseUseCase<GetEstabsResponse, any>{
  constructor(private repo: ConfigRepository) {
  }
  execute() {
    return this.repo.getEstabs();
  }
}
