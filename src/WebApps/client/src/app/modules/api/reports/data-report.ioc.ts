import { Provider } from '@angular/core';
import { ReportRepository } from '@modules/api/reports/domain/report.repository';
import { ReportApiRepository } from '@modules/api/reports/infrastructure/report-api.repository';

export const DATA_REPORT_IOC: Provider[] = [
  {
    provide: ReportRepository,
    useClass: ReportApiRepository,
  },
];
