import { Directive, HostListener, inject, input } from '@angular/core';
import { ACCOUNTING_CODE_REPORT, REPORT_FORMAT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { SharedService } from '@core/services/shared.service';

@Directive({
  selector: '[appActionComprobanteEgresoReport]',
})
export class ActionComprobanteEgresoReportDirective {
  private sharedSvc = inject(SharedService);
  private reportFacade = inject(ReportFacade);

  codEstab = input('');
  id = input(0);

  @HostListener('click', ['$event']) onClick($event: MouseEvent) {
    const reportOptions = ReportParamsBuilder.build({
      codeReport: ACCOUNTING_CODE_REPORT.RCEGR,
      data: {
        id: this.id(),
        codEstab: this.codEstab(),
      },
      format: REPORT_FORMAT.PDF
    });
    this.reportFacade.openPDF(reportOptions).subscribe()
  }
}
