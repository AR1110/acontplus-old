import { Injectable } from '@angular/core';
import { ReportRepository } from '../domain/report.repository';
import { ReportParams } from '@modules/api/reports/domain/report.entity';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportUseCase {
  constructor(private readonly repo: ReportRepository) {}

  execute(payload: ReportParams) {
    this.repo.generateReport(payload);
  }
}
