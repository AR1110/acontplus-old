import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../domain/report.repository';
import { ReportParams } from '@modules/api/reports/domain/report.entity';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportUseCase {
  private readonly repo = inject(ReportRepository);

  execute(payload: ReportParams) {
    this.repo.generateReport(payload);
  }
}
