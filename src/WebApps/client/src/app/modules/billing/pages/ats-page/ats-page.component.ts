import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { AtsService } from '@modules/billing/services/ats.service';
import moment from 'moment';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-ats-page',
  standalone: true,
  imports: [FormsModule, BreadcrumbComponent, DateRangeSelectionComponent],
  templateUrl: './ats-page.component.html',
  styles: ``,
})
export class AtsPageComponent {
  fromDate: any = moment().subtract(1, 'month').startOf('month');
  toDate: any = moment().subtract(1, 'month').endOf('month');
  dataSearch = {
    fromDate: formatDateMoment(this.fromDate),
    toDate: formatDateMoment(this.toDate),
    semiannual: false,
  };
  private readonly _atsSvc = inject(AtsService);
  private readonly _tS = inject(ToasterService);

  ngOnInit() {}

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  getAts() {
    const json = {
      fromDate: this.dataSearch.fromDate,
      toDate: this.dataSearch.toDate,
      semiannual: this.dataSearch.semiannual,
    };
    this._atsSvc.checkValidation(json).subscribe((response) => {
      if (response.code === '0') {
        this._tS.toastr({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this._atsSvc.download(json);
      }
    });
  }
}
