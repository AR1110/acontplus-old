import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {
  ElectronicSignatureParam
} from "@modules/config/domain/models/electronic-signature.model";
import {ElectronicSignatureRepository} from "@modules/config/domain/repositories/electronic-signature.repository";
import { Observable } from "rxjs";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})
export class UpdateSignatureElectronicSignatureUseCase implements BaseUseCase<ApiResponse, Partial<ElectronicSignatureParam>> {
  constructor(private repo: ElectronicSignatureRepository) {
  }

  execute(params:Partial<ElectronicSignatureParam>): Observable<ApiResponse> {
        return this.repo.updateSignature(params)
    }


}
