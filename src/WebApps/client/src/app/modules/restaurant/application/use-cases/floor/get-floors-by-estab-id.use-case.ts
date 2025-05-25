import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {FloorRepository} from "@restaurant/domain/repositories/floor.repository";
import {GetFloorsByEstabIdResponse} from "@restaurant/domain/models/floor.model";

@Injectable({
  providedIn: 'root'
})
export class GetFloorsByEstabIdUseCase implements BaseUseCase<GetFloorsByEstabIdResponse, any> {
  constructor(private repo: FloorRepository) {
  }
  execute(params: any)  {
    return this.repo.getByEstablishmentId(params);
  }
}
