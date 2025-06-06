
import {ReportParams} from "@modules/api/reports/domain/report.entity";

export abstract class ReportRepository {
  abstract generateReport(payload: ReportParams): void;
}
