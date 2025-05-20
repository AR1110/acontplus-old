import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ElectronicSignatureListResponse} from "@modules/config/domain/models/electronic-signature.model";
import {ElectronicSignatureRepository} from "@modules/config/domain/repositories/electronic-signature.repository";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ListElectronicSignatureUseCase implements BaseUseCase<ElectronicSignatureListResponse, any> {
  constructor(private repo: ElectronicSignatureRepository) {
  }

  execute(): Observable<ElectronicSignatureListResponse> {
        return this.repo.list()
    }


}
