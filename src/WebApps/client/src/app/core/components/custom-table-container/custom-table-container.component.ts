import {Component, input, output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {CustomMatSpinnerComponent} from "@core/components/custom-mat-spinner/custom-mat-spinner.component";
import { Pagination } from '@shared/models/pagination.model';


@Component({
  selector: 'app-custom-table-container',
  standalone: true,
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    CustomMatSpinnerComponent
  ],
  templateUrl: './custom-table-container.component.html',
  styleUrl: './custom-table-container.component.scss'
})
export class CustomTableContainerComponent {

  isLoadingResults = input<boolean>(false)
  isRateLimitReached = input<boolean>(false)
  pagination = input<Pagination>()
  valueHeight = input<string>() ;

  onPageEvent=output<PageEvent>()

  handlePageEvent(e: PageEvent) {
     this.onPageEvent.emit(e)
  }
}
