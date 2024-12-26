import {ClassProvider} from "@angular/core"; 
import {ApiGreenRepository} from "@domain/repositories/api-green.repository";
import {ApiGreenWebRepository} from "@data/repositories/api-green-api/api-green-web.repository";


export const apiGreenProvider:ClassProvider = {
  provide: ApiGreenRepository,
  useClass: ApiGreenWebRepository
}
