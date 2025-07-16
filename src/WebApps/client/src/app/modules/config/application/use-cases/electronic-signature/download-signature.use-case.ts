import {inject, Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ElectronicSignatureRepository} from "@modules/config/domain/repositories/electronic-signature.repository";

@Injectable({
  providedIn: 'root'
})
export class DownloadSignatureUseCase implements BaseUseCase<any, number> {
  private repo = inject(ElectronicSignatureRepository)

  execute(id: number)  {
        return this.repo.downloadSignature(id)
    }


}
