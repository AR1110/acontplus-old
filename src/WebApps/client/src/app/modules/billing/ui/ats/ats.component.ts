import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import { AtsService } from '@billing/services/ats.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { addDay, monthStart } from '@formkit/tempo';
import { DynamicCard } from '@acontplus/ng-components';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-ats',
  imports: [FormsModule, BreadcrumbComponent, DateRangeSelectionComponent, DynamicCard, Button],
  templateUrl: './ats.component.html',
  styles: ``,
})
export class AtsComponent {
  fromDate: any = monthStart(addDay(monthStart(new Date()), -1));
  toDate: any = addDay(monthStart(new Date()), -1);
  dataSearch = {
    fromDate: formatDateToString(this.fromDate),
    toDate: formatDateToString(this.toDate),
    semiannual: false,
  };
  private readonly _atsSvc = inject(AtsService);
  private readonly _tS = inject(ToastrNotificationService);

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
