import { Component, inject } from '@angular/core';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { AtsService } from '@billing/services/ats.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { DateRangePicker, DateRangeValue, DynamicCard } from '@acontplus/ng-components';
import { Button } from '@acontplus/ng-components';
import {lastMonthRange} from "ngx-datex";

@Component({
  selector: 'app-ats-page',
  imports: [ReactiveFormsModule, FormsModule, BreadcrumbComponent, DateRangePicker, DynamicCard, Button],
  templateUrl: './ats-page.html',
  styles: ``,
})
export class AtsPage {
  fromDate=  lastMonthRange()[0];
  toDate =lastMonthRange()[1];
  dataSearch = {
    fromDate: formatDateToString(this.fromDate),
    toDate: formatDateToString(this.toDate),
    semiannual: false,
  };
  private readonly _atsSvc = inject(AtsService);
  private readonly _tS = inject(ToastrNotificationService);

  onDateRangeSelection(range: DateRangeValue<true>) {
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
        this._tS.show({
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
