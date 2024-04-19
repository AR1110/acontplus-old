import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
import { formatDateMoment } from "@core/utils/format-date-moment";
import { AtsService } from '@modules/billing/services/ats.service';

@Component({
  selector: 'app-ats-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
     DateRangeSelectionComponent
  ],
  templateUrl: './ats-page.component.html',
  styles: ``
})
export class AtsPageComponent {

  atsSvc = inject(AtsService);

  dataSearch = {
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    semiannual: false
  }

  ngOnInit() { }


   onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }
  getAts() {
    try {
      let json = {
        fromDate: this.dataSearch.fromDate,
        toDate: this.dataSearch.fromDate,
        semiannual: this.dataSearch.semiannual
      }
      this.atsSvc.download(json)

    } catch (error) {
      console.log(error)
    }
  }

}
