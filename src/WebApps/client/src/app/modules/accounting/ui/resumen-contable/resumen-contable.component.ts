import { Component, inject } from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import { SubCategorySelectHtmlOnly } from '@accounting/core/domain/subcategory';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {FORMAT_REPORT, TIPO_TRANSACCION } from '@core/constants/global.constants';
import {SharedService} from "@core/services/shared.service";
import {getValidId} from "@core/utils/utils";
import {ACCOUNTING_CODE_REPORT} from "@accounting/core/enums/accounting.constants";
import {ResumenContableUsecase} from "@accounting/core/usecases/resumen-contable.usecase";

@Component({
    selector: 'app-resumen-contable',
    imports: [
        FormsModule,
        BreadcrumbComponent,
        DateRangeSelectionComponent
    ],
    templateUrl: './resumen-contable.component.html',
    styles: ``
})
export class ResumenContableComponent {
  private _resumenContableCaseUse = inject(ResumenContableUsecase)
  private sharedSvc = inject(SharedService)
   subcategories: SubCategorySelectHtmlOnly[]=[]
   transactionTypes:any[]=[];

   isPurchase = false;

   private format = '';

   dataSearch = {
     idTipoTransaccion: 0,
     fromDate: formatDateToString(new Date()) ,
     toDate: formatDateToString(new Date()) ,
     idSubcategoria: 0
   }
  getDataFilter(){
    this._resumenContableCaseUse.getDataFilter().subscribe(response=>{
      this.subcategories = response.subCategories;
      this.transactionTypes = response.transactionTypes;
      let dataTipoTransaccion = this.transactionTypes.find(tt=>tt.codigo===TIPO_TRANSACCION.V);
      this.dataSearch.idTipoTransaccion = dataTipoTransaccion?.idTipoTransaccion ?? 0;
    })
  }

  ngOnInit(){
    this.getDataFilter()
  }


  public onChangeTypeTransaccion(){
    this.isPurchase = this.transactionTypes.some(tt=>tt.idTipoTransaccion===this.dataSearch.idTipoTransaccion && tt.codigo===TIPO_TRANSACCION.C);

  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  reportPdf(){
    this.format = FORMAT_REPORT.PDF;
    this.getReport()
  }

  reportExcel(){
    this.format = FORMAT_REPORT.EXCEL;
    this.getReport()
  }



  private getReport(){


    let dataParams = {
      tipo: 1,
      ckFecha: true,
      tipoTransaccionId: getValidId(this.dataSearch.idTipoTransaccion),
      subCategoryId : getValidId(this.dataSearch.idSubcategoria),
      fromDate: this.dataSearch.fromDate,
      toDate: this.dataSearch.toDate,
    };

    let  reportParams = JSON.stringify({
      hasParams: false,
      codigo: ACCOUNTING_CODE_REPORT.RAAM,
      format: this.format,
      aditionalParams: []
    })

    const parameters = {
      hasIdUsuarioRol: true,
      reportParams,
      dataParams: JSON.stringify(dataParams)
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,

    })

  }

}
