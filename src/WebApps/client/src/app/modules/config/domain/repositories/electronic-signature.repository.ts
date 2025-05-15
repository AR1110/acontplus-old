import {Observable} from "rxjs";
import {ElectronicSignatureListResponse} from "@modules/config/domain/models/electronic-signature.model";

export abstract class ElectronicSignatureRepository {
  abstract list():Observable<ElectronicSignatureListResponse>;
}
