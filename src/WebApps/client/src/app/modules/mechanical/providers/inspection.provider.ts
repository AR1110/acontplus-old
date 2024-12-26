import {ClassProvider} from "@angular/core";
import {InspectionRepository} from "@mechanical/domain/repositories/inspection.repository";
import {InspectionWebRepository} from "@mechanical/data/inspection/inspection-web.repository";

export const inspectionProvider: ClassProvider={
  provide : InspectionRepository,
  useClass: InspectionWebRepository
}
