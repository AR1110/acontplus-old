import { Component, input, output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CustomMatSpinnerComponent } from '@core/components/custom-mat-spinner/custom-mat-spinner.component';
import { Pagination } from '@shared/models/pagination.model';

@Component({
  selector: 'app-custom-table-container',
  imports: [MatPaginator, CustomMatSpinnerComponent],
  templateUrl: './custom-table-container.component.html',
  styleUrl: './custom-table-container.component.scss',
})
export class CustomTableContainerComponent {
  isLoadingResults = input<boolean>(false);
  isRateLimitReached = input<boolean>(false);
  pagination = input<Pagination>();
  valueHeight = input<string>();

  onPageEvent = output<PageEvent>();

  handlePageEvent(e: PageEvent) {
    this.onPageEvent.emit(e);
  }
}
