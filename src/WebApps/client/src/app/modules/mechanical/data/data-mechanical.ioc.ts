import { Provider } from '@angular/core';
import { InspectionRepository } from '../domain/repositories/inspection.repository';
import { InspectionWebRepository } from './inspection/inspection-web.repository';
import { SupportDetailRepository } from '../domain/repositories/support-detail.repository';
import { SupportDetailWebRepository } from './support-detail/support-detail-web.repository';
import { SupportRepository } from '../domain/repositories/support.repository';
import { SupportWebRepository } from './support/support-web.repository';
import { VehicleRepository } from '../domain/repositories/vehicle.repository';
import { VehicleWebRepository } from './vehicle/vehicle-web.repository';

export const DATA_MECHANICAL_IOC: Provider[] = [
  {
    provide: InspectionRepository,
    useClass: InspectionWebRepository,
  },
  {
    provide: SupportDetailRepository,
    useClass: SupportDetailWebRepository,
  },
  {
    provide: SupportRepository,
    useClass: SupportWebRepository,
  },
  {
    provide: VehicleRepository,
    useClass: VehicleWebRepository,
  },
];
