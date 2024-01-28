
import { Component, inject } from '@angular/core';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ComprobanteIngreso } from '@modules/accounting/models/comp-ingreso.model';
import { ComprobanteIngresoService } from '@modules/accounting/services/comprobante-ingreso.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-cobro-page',
  standalone: true,
  imports: [AppModule, AccountingModule, DateRangeSelectionComponent],
  templateUrl: './cobro-page.component.html',
  styles: ``
})
export class CobroPageComponent {
  private compIngresoSvc = inject(ComprobanteIngresoService);
  private sharedSvc = inject(SharedService)

  establecimientos: Array<EstablecimientoSelectHtmlOnly> = []
  comprobantesIngreso: Array<ComprobanteIngreso> = [];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    codEstab: ''
  }
  getComprobantesIngreso() {
    const params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      codEstab: isValidField(this.dataSearch.codEstab)
    }
    this.comprobantesIngreso = []
    showLoader()
    this.compIngresoSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader()
        this.comprobantesIngreso = response;
        console.log(response)
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })
  }

  ngOnInit() {
    showLoader()
    this.sharedSvc.getEstabAsign().subscribe({
      next: (establecimientos) => {
        hideLoader()
        this.establecimientos = establecimientos as Array<EstablecimientoSelectHtmlOnly>
        if(this.establecimientos.length>0){
          let dataEstab = this.establecimientos.find(estab=>estab.predeterminado)
          this.dataSearch.codEstab = dataEstab?.codEstab || '';
          this.getComprobantesIngreso()
        }
      },
      error(err) {
        hideLoader()
        console.log(err)
      },
    })
  }

  onDateRangeSelection(range: { from: string, to: string }) {

    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getComprobantesIngreso()
  }

}
