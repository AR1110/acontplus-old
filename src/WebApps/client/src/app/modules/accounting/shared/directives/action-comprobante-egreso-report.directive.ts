import {Directive, HostListener, inject, input} from '@angular/core';
import {ReportParamsBuilder} from "@shared/utils/report-params.builder";
import {ACCOUNTING_CODE_REPORT} from "@accounting/shared/enums/accounting.constants";
import {SharedService} from "@core/services/shared.service";

@Directive({
  selector: '[appActionComprobanteEgresoReport]'
})
export class ActionComprobanteEgresoReportDirective {
  private sharedSvc = inject(SharedService);

  codEstab = input("")
  id = input(0)

  @HostListener('click', ['$event']) onClick($event:MouseEvent){
     const params = ReportParamsBuilder.getReportParameters(ACCOUNTING_CODE_REPORT.RCEGR, {
       id: this.id(),
       codEstab: this.codEstab()
     });
     if (params) {
       this.sharedSvc.getReport({
         data: params,
         format: 'pdf',
       })
     }
  }

}
